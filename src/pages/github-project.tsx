import { useState, useEffect } from 'react';
import { marked } from 'marked';
import type { GitHubRepo } from '../App';
import styles from './github-project.module.css';

interface GithubProjectProps {
  repo: GitHubRepo;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

export default function GithubProject({ repo, onToggleFullScreen, isFullScreen }: GithubProjectProps) {
  const [readmeHtml, setReadmeHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cacheKey = `github_readme_${repo.name}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setReadmeHtml(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setReadmeHtml('');

    // Fetch README from GitHub raw content
    fetch(`https://raw.githubusercontent.com/rudrarathod/${repo.name}/${repo.default_branch}/README.md`)
      .then(res => {
        if (!res.ok) throw new Error('README not found');
        return res.text();
      })
      .then(text => {
        // Parse markdown text to HTML
        const parsed = marked.parse(text) as string;
        setReadmeHtml(parsed);
        sessionStorage.setItem(cacheKey, parsed);
        setLoading(false);
      })
      .catch(() => {
        setReadmeHtml('<p class="no-readme"><i>README.md file could not be loaded or does not exist for this repository.</i></p>');
        setLoading(false);
      });
  }, [repo.name, repo.default_branch]);

  // Clean language and license display
  const primaryLanguage = repo.language || 'Markdown';
  const licenseName = repo.license?.name || 'No License';

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

        {/* README Markdown Viewport */}
        <div className={styles.readmeSection}>
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-file-lines" style={{ marginRight: '8px', color: '#b8bb26' }}></i>
            README.md
          </h2>
          
          {loading ? (
            <div className={styles.loader}>
              <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px', color: '#fabd2f' }}></i>
              Fetching repository documentation...
            </div>
          ) : (
            <div 
              className={styles.readmeContent}
              dangerouslySetInnerHTML={{ __html: readmeHtml }}
            />
          )}
        </div>

        <div className={styles.divider}></div>

        {/* IDE Source Metadata JSON Block */}
        <div className={styles.codeBlockHeader}>Repository Metadata</div>
        <pre className={styles.codeBlock}>
{`{
  "repositoryName": "${repo.name}",
  "githubUrl": "${repo.html_url}",
  "defaultBranch": "${repo.default_branch}",
  "primaryLanguage": "${primaryLanguage}",
  "starsCount": ${repo.stargazers_count},
  "forksCount": ${repo.forks_count},
  "openIssues": ${repo.open_issues_count},
  "license": "${licenseName}"
}`}
        </pre>
      </div>
    </div>
  );
}
