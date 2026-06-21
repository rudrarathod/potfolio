import { useState, useEffect } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';
import type { GitHubRepo } from '../App';
import styles from './github-project.module.css';

const LANGUAGE_COLORS: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Rust: '#dee5d6',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Ruby: '#701516',
  SCSS: '#c6538c',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
};

const getLanguageColor = (lang: string): string => {
  if (LANGUAGE_COLORS[lang]) return LANGUAGE_COLORS[lang];
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    background: '#1d2021',
    primaryColor: '#32312f',
    primaryTextColor: '#ebdbb2',
    lineColor: '#b8bb26',
    nodeBorder: '#3c3836',
  }
});

interface GithubProjectProps {
  repo: GitHubRepo;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

export default function GithubProject({ repo, onToggleFullScreen, isFullScreen }: GithubProjectProps) {
  const [resumeHtml, setResumeHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setResumeHtml('');

    const processMarkdown = (text: string) => {
      const parsed = marked.parse(text) as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(parsed, 'text/html');
      doc.querySelectorAll('pre code.language-mermaid').forEach(codeElement => {
        const preElement = codeElement.parentElement;
        if (preElement) {
          const div = document.createElement('div');
          div.className = 'mermaid';
          div.textContent = codeElement.textContent;
          preElement.replaceWith(div);
        }
      });
      setResumeHtml(doc.body.innerHTML);
      setLoading(false);
    };

    if (repo.resume_content) {
      processMarkdown(repo.resume_content);
      return;
    }

    // Fetch RESUME.md from GitHub raw content with cache-busting timestamp
    const baseUrl = repo.resume_url || `https://raw.githubusercontent.com/rudrarathod/${repo.name}/${repo.default_branch}/RESUME.md`;
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}_=${Date.now()}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('RESUME.md not found');
        return res.text();
      })
      .then(text => {
        processMarkdown(text);
      })
      .catch(() => {
        setResumeHtml('<p class="no-readme"><i>RESUME.md file could not be loaded or does not exist for this repository.</i></p>');
        setLoading(false);
      });
  }, [repo.name, repo.default_branch, repo.resume_url, repo.resume_content]);

  useEffect(() => {
    if (!loading && resumeHtml) {
      // Small timeout to allow the browser to paint DOM before running mermaid
      const timer = setTimeout(() => {
        try {
          mermaid.run();
        } catch (err) {
          console.error('Mermaid render error:', err);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [resumeHtml, loading]);

  // Clean language and license display
  const primaryLanguage = repo.language || 'Markdown';
  const licenseName = repo.license?.name || 'No License';

  // Calculate languages percentage list
  const repoLanguages = repo.languages || {};
  const totalBytes = Object.values(repoLanguages).reduce((sum, val) => sum + val, 0);
  const languagesList = Object.entries(repoLanguages)
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const mainLanguages: typeof languagesList = [];
  let otherPercentage = 0;

  languagesList.forEach(lang => {
    if (lang.percentage >= 0.1) {
      mainLanguages.push(lang);
    } else {
      otherPercentage += lang.percentage;
    }
  });

  if (otherPercentage > 0) {
    mainLanguages.push({
      name: 'Other',
      percentage: otherPercentage,
      color: '#867c6b',
    });
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>
        <span>github/{repo.name}</span>
        <button
          onClick={onToggleFullScreen}
          className={styles.fullscreenBtn}
          title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <i className={isFullScreen ? "fa-solid fa-down-left-and-up-right-to-center" : "fa-solid fa-up-right-and-down-left-from-center"}></i>
        </button>
      </h4>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{repo.name}</h1>
          {!repo.private && (
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubRedirectBtn}
              title="Open Repository on GitHub"
            >
              <i className="fa-brands fa-github" style={{ marginRight: '8px' }}></i>
              Open on GitHub
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: '8px', fontSize: '0.75rem' }}></i>
            </a>
          )}
        </div>

        {repo.description && (
          <p className={styles.description}>{repo.description}</p>
        )}

        {/* Live Repository Statistics Badges */}
        <div className={styles.badges}>
          <div className={styles.badge} title="Primary Language">
            <i className="fa-solid fa-circle" style={{ color: '#fabd2f', fontSize: '0.65rem', marginRight: '6px' }}></i>
            {primaryLanguage}
          </div>
          <div className={styles.badge} title="Repository Visibility">
            <i className={repo.private ? "fa-solid fa-lock" : "fa-solid fa-earth-americas"} style={{ color: repo.private ? '#fe8019' : '#83a598', marginRight: '6px' }}></i>
            {repo.private ? "Private" : "Public"}
          </div>
          <div className={styles.badge} title="GitHub Stars">
            <i className="fa-solid fa-star" style={{ color: '#fe8019', marginRight: '6px' }}></i>
            {repo.stargazers_count}
          </div>
          <div className={styles.badge} title="Forks count">
            <i className="fa-solid fa-code-fork" style={{ color: '#83a598', marginRight: '6px' }}></i>
            {repo.forks_count}
          </div>
          <div className={styles.badge} title="Open Issues">
            <i className="fa-solid fa-circle-exclamation" style={{ color: '#fb4934', marginRight: '6px' }}></i>
            {repo.open_issues_count} open issues
          </div>
          <div className={styles.badge} title="License">
            <i className="fa-solid fa-scale-balanced" style={{ color: '#b8bb26', marginRight: '6px' }}></i>
            {licenseName}
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* RESUME Markdown Viewport */}
        <div className={styles.readmeSection}>
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-file-lines" style={{ marginRight: '8px', color: '#b8bb26' }}></i>
            RESUME.md
          </h2>
          
          {loading ? (
            <div className={styles.skeletonContainer}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText} style={{ width: '90%' }}></div>
              <div className={styles.skeletonText} style={{ width: '75%' }}></div>
              <div className={styles.skeletonHeading}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText} style={{ width: '85%' }}></div>
              <div className={styles.skeletonBullet}></div>
              <div className={styles.skeletonBullet} style={{ width: '60%' }}></div>
              <div className={styles.skeletonBullet} style={{ width: '70%' }}></div>
            </div>
          ) : (
            <div 
              className={styles.readmeContent}
              dangerouslySetInnerHTML={{ __html: resumeHtml }}
            />
          )}
        </div>

        {!repo.private && (
          <>
            <div className={styles.divider}></div>

            {/* Languages Section */}
            {mainLanguages.length > 0 && (
              <div className={styles.languagesSection}>
                <div className={styles.languagesHeader}>Languages</div>
                <div className={styles.languagesBar}>
                  {mainLanguages.map(lang => (
                    <div
                      key={lang.name}
                      className={styles.languageBarSegment}
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                    />
                  ))}
                </div>
                <div className={styles.languagesList}>
                  {mainLanguages.map(lang => (
                    <div key={lang.name} className={styles.languageItem}>
                      <span
                        className={styles.languageDot}
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className={styles.languageName}>{lang.name}</span>
                      <span className={styles.languagePercent}>
                        {lang.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* IDE Source Metadata JSON Block */}
        <div className={styles.codeBlockHeader}>Repository Metadata</div>
        <pre className={styles.codeBlock}>
{JSON.stringify({
  repositoryName: repo.name,
  ...(!repo.private && { githubUrl: repo.html_url }),
  defaultBranch: repo.default_branch,
  primaryLanguage: primaryLanguage,
  ...(!repo.private && {
    languages: Object.fromEntries(mainLanguages.map(l => [l.name, `${l.percentage.toFixed(1)}%`]))
  }),
  starsCount: repo.stargazers_count,
  forksCount: repo.forks_count,
  openIssues: repo.open_issues_count,
  license: licenseName
}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
