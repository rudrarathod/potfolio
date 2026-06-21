const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.warn('Could not parse .env file:', e);
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || '';
const username = 'rudrarathod';

async function run() {
  console.log('Starting projects sync...');
  const headers = {};
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    console.log('Using GITHUB_TOKEN for authentication.');
  } else {
    console.log('No GITHUB_TOKEN provided. Fetching public repositories only.');
  }

  // 1. Fetch repositories
  const reposUrl = GITHUB_TOKEN 
    ? 'https://api.github.com/user/repos?type=owner&sort=updated'
    : `https://api.github.com/users/${username}/repos?sort=updated`;

  let reposData = [];
  try {
    const res = await fetch(reposUrl, { headers });
    if (!res.ok) {
      throw new Error(`Failed to fetch repositories: ${res.status} ${res.statusText}`);
    }
    reposData = await res.json();
  } catch (err) {
    console.error('Error fetching repositories:', err);
    process.exit(1);
  }

  console.log(`Fetched ${reposData.length} repositories.`);
  const syncedRepos = [];

  for (const repo of reposData) {
    try {
      const isResumesRepo = repo.name.toLowerCase() === 'resumes' || repo.name.toLowerCase() === 'resume';
      if (isResumesRepo) {
        console.log(`Processing virtual repos from ${repo.name}...`);
        const contentsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contents/`, { headers });
        if (contentsRes.ok) {
          const files = await contentsRes.json();
          if (Array.isArray(files)) {
            const mdFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.md') && f.name.toLowerCase() !== 'readme.md');
            for (const file of mdFiles) {
              console.log(`  Fetching virtual project: ${file.name}`);
              let text = '';
              const fileRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contents/${file.name}`, { headers });
              if (fileRes.ok) {
                const fileData = await fileRes.json();
                if (fileData.content) {
                  text = decodeBase64(fileData.content);
                }
              }
              const displayName = file.name.replace(/\.md$/, '');
              const desc = extractDescriptionFromMarkdown(text) || 'Private project documentation.';
              const virtualLanguages = extractLanguagesFromMarkdown(text);
              syncedRepos.push({
                name: displayName,
                html_url: file.html_url,
                description: desc,
                stargazers_count: 0,
                forks_count: 0,
                open_issues_count: 0,
                language: 'Markdown',
                languages: virtualLanguages,
                license: null,
                default_branch: repo.default_branch,
                resume_url: file.download_url,
                private: true,
                resume_content: text
              });
            }
          }
        }
        continue;
      }

      // Check for RESUME.md / resume.md
      console.log(`Checking ${repo.name} for resume file...`);
      let resumeUrl = '';
      let text = '';

      const res1 = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contents/RESUME.md`, { headers });
      if (res1.ok) {
        const data1 = await res1.json();
        if (data1.content) {
          text = decodeBase64(data1.content);
          resumeUrl = data1.download_url || `https://api.github.com/repos/${username}/${repo.name}/contents/RESUME.md`;
        }
      } else {
        const res2 = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contents/resume.md`, { headers });
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.content) {
            text = decodeBase64(data2.content);
            resumeUrl = data2.download_url || `https://api.github.com/repos/${username}/${repo.name}/contents/resume.md`;
          }
        }
      }

      if (resumeUrl) {
        console.log(`  Found resume for ${repo.name}!`);
        let languages = {};
        try {
          const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, { headers });
          if (langRes.ok) {
            languages = await langRes.json();
          }
        } catch (e) {
          console.error(`Failed to fetch languages for ${repo.name}`, e);
        }

        const desc = repo.description || extractDescriptionFromMarkdown(text) || 'A GitHub repository.';
        syncedRepos.push({
          name: repo.name,
          html_url: repo.html_url,
          description: desc,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          open_issues_count: repo.open_issues_count,
          language: repo.language,
          languages,
          license: repo.license ? { name: repo.license.name } : null,
          default_branch: repo.default_branch,
          resume_url: resumeUrl,
          private: repo.private,
          resume_content: text
        });
      }
    } catch (e) {
      console.error(`Error processing repo ${repo.name}:`, e);
    }
  }

  // Write file
  const outDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'projects.json');
  fs.writeFileSync(outFile, JSON.stringify(syncedRepos, null, 2), 'utf-8');
  console.log(`Successfully synced ${syncedRepos.length} projects to ${outFile}`);
}

function decodeBase64(str) {
  const cleaned = str.replace(/\s/g, '');
  try {
    return Buffer.from(cleaned, 'base64').toString('utf-8');
  } catch {
    return atob(cleaned);
  }
}

function extractDescriptionFromMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  for (let line of lines) {
    const cleanLine = line.trim();
    if (cleanLine.startsWith('#') || cleanLine === '') continue;
    if (cleanLine.length > 10) {
      if (cleanLine.length > 140) {
        return cleanLine.substring(0, 137) + '...';
      }
      return cleanLine;
    }
  }
  return '';
}

function extractLanguagesFromMarkdown(text) {
  const languages = {};
  const commonLangs = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python', 'Rust', 'Go', 'Java', 'C++', 'C', 'PHP', 'Shell', 'Ruby', 'SCSS', 'Swift', 'Kotlin'];
  
  commonLangs.forEach(lang => {
    const escapedLang = lang.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedLang}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      languages[lang] = matches.length * 2000;
    }
  });
  
  if (Object.keys(languages).length === 0) {
    languages['Markdown'] = 1000;
  }
  return languages;
}

run();
