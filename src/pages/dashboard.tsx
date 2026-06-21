import { getFileExtensionForLanguage } from '../App';
import type { GitHubRepo } from '../App';
import styles from './dashboard.module.css';

interface DashboardProps {
  section: 'home' | 'projects' | 'experience' | 'skills';
  repos: GitHubRepo[];
  loadingRepos: boolean;
  onSelectFile: (file: string | null) => void;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  isCachedData?: boolean;
}

const STATIC_PROJECTS = [
  {
    title: 'YouTube Experience Enhancer',
    description: 'Chrome extension published on Web Store with picture-in-picture and gesture controls.',
    language: 'JavaScript',
    filename: 'yt-play.js'
  },
  {
    title: 'Nitro-Input-AI',
    description: 'AI writing assistant extension integrated with Gemini API for context-aware writing.',
    language: 'JavaScript',
    filename: 'nitro.js'
  },
  {
    title: 'Finance Expense Tracker',
    description: 'AI-powered budgeting dashboard with OCR receipt scanner and Gemini Vision analytics.',
    language: 'TypeScript',
    filename: 'expenses.tsx'
  },
  {
    title: 'Gemini Bulk Image Editor',
    description: 'Parallel batch image processing editor utilizing Gemini Vision API services.',
    language: 'TypeScript',
    filename: 'bulk-img.tsx'
  }
];

const EXPERIENCES = [
  {
    title: 'Software Development & Training Intern',
    company: 'Black Orange Talent-India',
    period: 'Aug 2025 – Present',
    description: 'EdTech and IoT modules using ESP32; programming workshops coordinator.',
    filename: 'bot-intern.md'
  },
  {
    title: 'Chrome Extension Developer',
    company: 'Freelance Contracts',
    period: 'Sep 2023 – Present',
    description: 'Manifest V3, AI text features, memory optimization under 50MB RAM.',
    filename: 'chrome-freelance.md'
  },
  {
    title: 'Full-Stack Developer',
    company: 'Freelance Projects',
    period: 'Jan 2023 – Present',
    description: 'Fullstack webapps with React, Node, PHP, MySQL, and Gemini integration.',
    filename: 'fullstack-freelance.md'
  }
];

const SKILLS = [
  {
    category: 'Programming Languages',
    skills: ['JS', 'TS', 'Python', 'PHP', 'SQL', 'HTML', 'CSS'],
    description: 'Core languages for web client interfaces, scripting, and DB queries.',
    filename: 'languages.json'
  },
  {
    category: 'Frontend & Design',
    skills: ['React', 'Next.js', 'Tailwind', 'SCSS', 'Responsive'],
    description: 'Frameworks and styling systems for responsive dashboards.',
    filename: 'frontend.json'
  },
  {
    category: 'Backend Technologies',
    skills: ['Node.js', 'Express', 'REST APIs', 'PHP'],
    description: 'Server runtimes and APIs for secure backend routing.',
    filename: 'backend.json'
  },
  {
    category: 'Database Systems',
    skills: ['MySQL', 'MongoDB', 'IndexedDB'],
    description: 'Storage engines and persistence layers for app state.',
    filename: 'databases.json'
  },
  {
    category: 'AI/ML Integration',
    skills: ['Gemini API', 'Vision', 'OCR', 'NLP', 'Computer Vision'],
    description: 'AI model connections for OCR, text, and parallel image jobs.',
    filename: 'ai-ml.json'
  }
];

export default function Dashboard({
  section,
  repos,
  loadingRepos,
  onSelectFile,
  onToggleFullScreen,
  isFullScreen,
  isCachedData
}: DashboardProps) {
  // Helper for generating languages list string
  const getCardLanguagesString = (languages?: { [key: string]: number }): string => {
    if (!languages || Object.keys(languages).length === 0) return 'Markdown';
    const totalBytes = Object.values(languages).reduce((sum, val) => sum + val, 0);
    return Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3)
      .map(lang => lang.name)
      .join(' \u2022 ');
  };

  // Helper for file icon & color
  const getCardIconAndColor = (filename: string) => {
    const ext = filename.split('.').pop() || '';
    switch (ext) {
      case 'json':
        return { iconClass: 'fa-solid fa-gears', color: '#83a598' }; // blue
      case 'md':
        return { iconClass: 'fa-solid fa-file-lines', color: '#b8bb26' }; // green
      default:
        return { iconClass: 'fa-solid fa-file-code', color: '#fabd2f' }; // yellow
    }
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>
        <span>workspace / {section}</span>
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
        <h1 className={styles.sectionTitle}>
          Select a file to edit / view details
        </h1>
        <p className={styles.sectionSubtitle}>
          Click any card below to open its corresponding editor node in the workspace panel.
        </p>

        {isCachedData && (
          <div className={styles.cacheWarning}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px', color: '#fabd2f' }}></i>
            <span>GitHub API rate limit reached. Displaying cached projects.</span>
          </div>
        )}

        {section === 'projects' && (
          <div className={styles.grid}>
            {loadingRepos ? (
              // Render skeleton loader cards
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`${styles.card} ${styles.skeletonCard}`}>
                  <div className={styles.skeletonHeader}></div>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonDescription}></div>
                  <div className={styles.skeletonFooter}></div>
                </div>
              ))
            ) : repos.length > 0 ? (
              repos.map(repo => {
                const ext = getFileExtensionForLanguage(repo.language);
                const filename = `${repo.name}.${ext}`;
                const { iconClass, color } = getCardIconAndColor(filename);

                return (
                  <div
                    key={repo.name}
                    className={styles.card}
                    onClick={() => onSelectFile(filename)}
                  >
                    <div className={styles.cardHeader}>
                      <i className={`${iconClass} ${styles.cardIcon}`} style={{ color }}></i>
                      <span className={styles.filename}>{filename}</span>
                      <span className={styles.visibilityBadge} title={repo.private ? "Private Repository" : "Public Repository"}>
                        <i className={repo.private ? "fa-solid fa-lock" : "fa-solid fa-earth-americas"}></i>
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{repo.name}</h3>
                    <p className={styles.cardDescription}>
                      {repo.description || 'No description provided.'}
                    </p>
                    <div className={styles.cardFooter}>
                      <span className={styles.langTag}>
                        {getCardLanguagesString(repo.languages)}
                      </span>
                      {repo.stargazers_count > 0 && (
                        <span className={styles.starTag}>
                          <i className="fa-solid fa-star" style={{ color: '#fe8019', marginRight: '4px' }}></i>
                          {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Fallback static projects */
              STATIC_PROJECTS.map(proj => {
                const { iconClass, color } = getCardIconAndColor(proj.filename);
                return (
                  <div
                    key={proj.filename}
                    className={styles.card}
                    onClick={() => onSelectFile(proj.filename)}
                  >
                    <div className={styles.cardHeader}>
                      <i className={`${iconClass} ${styles.cardIcon}`} style={{ color }}></i>
                      <span className={styles.filename}>{proj.filename}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{proj.title}</h3>
                    <p className={styles.cardDescription}>{proj.description}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.langTag}>{proj.language}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {section === 'experience' && (
          <div className={styles.grid}>
            {EXPERIENCES.map(exp => {
              const { iconClass, color } = getCardIconAndColor(exp.filename);
              let displayLabel = exp.filename;
              if (exp.filename === 'chrome-freelance.md') displayLabel = 'chrome.md';
              if (exp.filename === 'fullstack-freelance.md') displayLabel = 'fullstack.md';

              return (
                <div
                  key={exp.filename}
                  className={styles.card}
                  onClick={() => onSelectFile(exp.filename)}
                >
                  <div className={styles.cardHeader}>
                    <i className={`${iconClass} ${styles.cardIcon}`} style={{ color }}></i>
                    <span className={styles.filename}>{displayLabel}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{exp.title}</h3>
                  <div className={styles.companyName}>{exp.company}</div>
                  <div className={styles.periodText}>{exp.period}</div>
                  <p className={styles.cardDescription}>{exp.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {section === 'skills' && (
          <div className={styles.grid}>
            {SKILLS.map(sk => {
              const { iconClass, color } = getCardIconAndColor(sk.filename);
              return (
                <div
                  key={sk.filename}
                  className={styles.card}
                  onClick={() => onSelectFile(sk.filename)}
                >
                  <div className={styles.cardHeader}>
                    <i className={`${iconClass} ${styles.cardIcon}`} style={{ color }}></i>
                    <span className={styles.filename}>{sk.filename}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{sk.category}</h3>
                  <p className={styles.cardDescription}>{sk.description}</p>
                  <div className={styles.tagsContainer}>
                    {sk.skills.slice(0, 4).map(skill => (
                      <span key={skill} className={styles.skillPill}>{skill}</span>
                    ))}
                    {sk.skills.length > 4 && (
                      <span className={styles.morePill}>+{sk.skills.length - 4} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
