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

async function rateLimitCheckedFetch(url, options) {
  const res = await fetch(url, options);
  if (res.status === 403) {
    const rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
    if (rateLimitRemaining === '0') {
      throw new Error(`RATE_LIMIT_EXCEEDED: ${url}`);
    }
  }
  return res;
}

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
    console.error('Error fetching repositories:', err.message);
    const outFile = path.join(__dirname, '..', 'src', 'data', 'projects.json');
    if (fs.existsSync(outFile)) {
      console.warn(`WARNING: Sync failed, but using existing ${outFile} as fallback.`);
      process.exit(0); // Exit 0 to not block build
    } else {
      console.error(`ERROR: Sync failed and no existing projects.json fallback found.`);
      process.exit(1);
    }
  }

  console.log(`Fetched ${reposData.length} repositories.`);
  const syncedRepos = [];

  try {
    for (const repo of reposData) {
      const isResumesRepo = repo.name.toLowerCase() === 'resumes' || repo.name.toLowerCase() === 'resume';
      if (isResumesRepo) {
        console.log(`Processing virtual repos from ${repo.name}...`);
        const contentsRes = await rateLimitCheckedFetch(`https://api.github.com/repos/${username}/${repo.name}/contents/`, { headers });
        if (contentsRes.ok) {
          const files = await contentsRes.json();
          if (Array.isArray(files)) {
            const mdFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.md') && f.name.toLowerCase() !== 'readme.md');
            for (const file of mdFiles) {
              console.log(`  Fetching virtual project: ${file.name}`);
              let text = '';
              const fileRes = await rateLimitCheckedFetch(`https://api.github.com/repos/${username}/${repo.name}/contents/${file.name}`, { headers });
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

      const res1 = await rateLimitCheckedFetch(`https://api.github.com/repos/${username}/${repo.name}/contents/RESUME.md`, { headers });
      if (res1.ok) {
        const data1 = await res1.json();
        if (data1.content) {
          text = decodeBase64(data1.content);
          resumeUrl = data1.download_url || `https://api.github.com/repos/${username}/${repo.name}/contents/RESUME.md`;
        }
      } else {
        const res2 = await rateLimitCheckedFetch(`https://api.github.com/repos/${username}/${repo.name}/contents/resume.md`, { headers });
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
          const langRes = await rateLimitCheckedFetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, { headers });
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
    }

    // Write file
    const outDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, 'projects.json');
    fs.writeFileSync(outFile, JSON.stringify(syncedRepos, null, 2), 'utf-8');
    console.log(`Successfully synced ${syncedRepos.length} projects to ${outFile}`);
  } catch (err) {
    if (err.message.startsWith('RATE_LIMIT_EXCEEDED')) {
      console.warn(`WARNING: Sync aborted midway due to rate limit: ${err.message}`);
      const outFile = path.join(__dirname, '..', 'src', 'data', 'projects.json');
      if (fs.existsSync(outFile)) {
        console.warn(`Using existing ${outFile} as fallback.`);
        process.exit(0);
      } else {
        console.error(`ERROR: No existing projects.json fallback found.`);
        process.exit(1);
      }
    } else {
      console.error('Error during repository processing:', err.message);
      process.exit(1);
    }
  }
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
    line = line.trim();
    // Skip empty lines, headers, images, list items, HRs, and markdown links
    if (!line || line.startsWith('#') || line.startsWith('!') || line.startsWith('-') || line.startsWith('*') || line.startsWith('[')) {
      continue;
    }
    // Clean up quotes, links, and styling brackets
    let cleanLine = line
      .replace(/^>\s*/, '') // strip blockquote characters
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // strip links [text](url) -> text
      .replace(/[\*_`~]/g, '') // strip markdown bold/italic/code block symbols
      .trim();

    // Ignore lines that are just live demo links or emoji-pointed call-to-actions
    if (cleanLine.toLowerCase().includes('live demo') || cleanLine.toLowerCase().includes('demo:') || cleanLine.startsWith('👉')) {
      continue;
    }

    if (cleanLine.length > 25) {
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
