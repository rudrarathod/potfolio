import { useState, useEffect, useRef } from 'react'
import './App.css'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Info from './pages/info'
import Project from './pages/project'
import Experience from './pages/experience'
import Skills from './pages/skills'
import GithubProject from './pages/github-project'


export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  license: { name: string } | null;
  default_branch: string;
  resume_url?: string;
  languages?: { [key: string]: number };
  private?: boolean;
  resume_content?: string;
}

export const getFileExtensionForLanguage = (lang: string | null): string => {
  if (!lang) return 'md';
  const l = lang.toLowerCase();
  if (l === 'typescript') return 'tsx';
  if (l === 'javascript') return 'js';
  if (l === 'python') return 'py';
  if (l === 'html') return 'html';
  if (l === 'css') return 'css';
  if (l === 'c++') return 'cpp';
  if (l === 'c') return 'c';
  if (l === 'shell') return 'sh';
  return 'md';
};

const getFileIconAndColor = (filename: string) => {
  if (filename === 'dashboard') {
    return { iconClass: 'fa-solid fa-table-cells-large', color: '#fabd2f' };
  }
  if (filename === 'home.tsx') {
    return { iconClass: 'fa-solid fa-file-code', color: '#fabd2f' };
  }
  const ext = filename.split('.').pop() || '';
  switch (ext) {
    case 'json':
      return { iconClass: 'fa-solid fa-gears', color: '#83a598' };
    case 'md':
      return { iconClass: 'fa-solid fa-file-lines', color: '#b8bb26' };
    default:
      return { iconClass: 'fa-solid fa-file-code', color: '#fabd2f' };
  }
};


const extractDescriptionFromMarkdown = (text: string): string => {
  const lines = text.split('\n');
  for (let line of lines) {
    line = line.trim();
    // Skip empty lines, headers, images, HRs, and markdown link/image wrappers
    if (!line || line.startsWith('#') || line.startsWith('!') || line.startsWith('-') || line.startsWith('[')) {
      continue;
    }
    // Clean up quotes, links, and styling brackets
    let cleanLine = line
      .replace(/^>\s*/, '') // strip blockquote characters
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // strip links [text](url) -> text
      .replace(/[\*_`~]/g, '') // strip markdown bold/italic/code block symbols
      .trim();
    
    if (cleanLine.length > 10) {
      if (cleanLine.length > 140) {
        return cleanLine.substring(0, 137) + '...';
      }
      return cleanLine;
    }
  }
  return '';
};

const extractLanguagesFromMarkdown = (text: string): { [key: string]: number } => {
  const languages: { [key: string]: number } = {};
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
};

const decodeBase64 = (str: string): string => {
  const cleaned = str.replace(/\s/g, '');
  try {
    return decodeURIComponent(
      atob(cleaned)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return atob(cleaned);
  }
};



function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'projects' | 'experience' | 'skills'>('projects');
  const [activeFile, setActiveFile] = useState<string | null>('home.tsx');
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showScrollExitOption, setShowScrollExitOption] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const reachedBottomTimeRef = useRef<number | null>(null);

  // Track when the scroll exit banner first appears to serve as a scroll stopper
  useEffect(() => {
    if (showScrollExitOption) {
      if (reachedBottomTimeRef.current === null) {
        reachedBottomTimeRef.current = Date.now();
      }
    } else {
      reachedBottomTimeRef.current = null;
    }
  }, [showScrollExitOption]);

  const [leftWidth, setLeftWidth] = useState<number>(() => {
    const saved = localStorage.getItem('leftWidth');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [rightWidth, setRightWidth] = useState<number>(() => {
    const saved = localStorage.getItem('rightWidth');
    return saved ? parseInt(saved, 10) : 250;
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [errorRepos, setErrorRepos] = useState<boolean>(false);
  const [isCachedData, setIsCachedData] = useState<boolean>(false);

  useEffect(() => {
    setLoadingRepos(true);
    
    const token = import.meta.env.VITE_GITHUB_TOKEN || '';
    const headers: HeadersInit = token ? { 'Authorization': `token ${token}` } : {};

    fetch('https://api.github.com/users/rudrarathod/repos?sort=updated', { headers })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403 || res.status === 429) {
            throw new Error('RATE_LIMIT');
          }
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(async (data: GitHubRepo[]) => {
        const checkedRepos = await Promise.all(
          data.map(async (repo): Promise<GitHubRepo[] | GitHubRepo | null> => {
            try {
              const isResumesRepo = repo.name.toLowerCase() === 'resumes' || repo.name.toLowerCase() === 'resume';
              if (isResumesRepo) {
                const contentsRes = await fetch(`https://api.github.com/repos/rudrarathod/${repo.name}/contents/`, { headers });
                if (contentsRes.ok) {
                  const files = await contentsRes.json();
                  if (Array.isArray(files)) {
                    const mdFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.md') && f.name.toLowerCase() !== 'readme.md');
                    
                    const virtualRepos = await Promise.all(
                      mdFiles.map(async (file): Promise<GitHubRepo> => {
                        let text = '';
                        try {
                          const fileRes = await fetch(file.download_url);
                          if (fileRes.ok) {
                            text = await fileRes.text();
                          }
                        } catch (e) {
                          console.error('Failed to fetch virtual repo content', file.name, e);
                        }
                        
                        const displayName = file.name.replace(/\.md$/, '');
                        const desc = extractDescriptionFromMarkdown(text) || 'Private project documentation.';
                        const virtualLanguages = extractLanguagesFromMarkdown(text);
                        
                        return {
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
                          private: true
                        };
                      })
                    );
                    return virtualRepos;
                  }
                }
              }

              let resumeUrl = '';
              let text = '';
              
              const res1 = await fetch(`https://api.github.com/repos/rudrarathod/${repo.name}/contents/RESUME.md`, { headers });
              if (res1.ok) {
                const data1 = await res1.json();
                if (data1.content) {
                  text = decodeBase64(data1.content);
                  resumeUrl = data1.download_url || `https://api.github.com/repos/rudrarathod/${repo.name}/contents/RESUME.md`;
                }
              } else {
                const res2 = await fetch(`https://api.github.com/repos/rudrarathod/${repo.name}/contents/resume.md`, { headers });
                if (res2.ok) {
                  const data2 = await res2.json();
                  if (data2.content) {
                    text = decodeBase64(data2.content);
                    resumeUrl = data2.download_url || `https://api.github.com/repos/rudrarathod/${repo.name}/contents/resume.md`;
                  }
                }
              }

              if (resumeUrl) {
                let languages: { [key: string]: number } = {};
                try {
                  const langRes = await fetch(`https://api.github.com/repos/rudrarathod/${repo.name}/languages`, { headers });
                  if (langRes.ok) {
                    languages = await langRes.json();
                  }
                } catch (e) {
                  console.error('Failed to fetch languages for repo', repo.name, e);
                }

                const desc = repo.description || extractDescriptionFromMarkdown(text) || 'A GitHub repository.';
                return { ...repo, resume_url: resumeUrl, description: desc, languages, resume_content: text };
              }
              return null;
            } catch {
              return null;
            }
          })
        );

        const flattened: GitHubRepo[] = [];
        checkedRepos.forEach(item => {
          if (item === null) return;
          if (Array.isArray(item)) {
            flattened.push(...item);
          } else {
            flattened.push(item);
          }
        });

        setRepos(flattened);
        setIsCachedData(false);
        try {
          localStorage.setItem('cached_github_repos', JSON.stringify(flattened));
        } catch (e) {
          console.error('Failed to save repos to localStorage', e);
        }
        setLoadingRepos(false);
      })
      .catch((err) => {
        console.warn('GitHub fetch error, checking localStorage cache...', err);
        const cached = localStorage.getItem('cached_github_repos');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRepos(parsed);
              setIsCachedData(true);
              setErrorRepos(false);
              setLoadingRepos(false);
              return;
            }
          } catch (e) {
            console.error('Failed to parse cached repositories', e);
          }
        }
        setErrorRepos(true);
        setLoadingRepos(false);
      });
  }, []);

  const leftWidthRef = useRef(leftWidth);
  const rightWidthRef = useRef(rightWidth);

  useEffect(() => {
    leftWidthRef.current = leftWidth;
  }, [leftWidth]);

  useEffect(() => {
    rightWidthRef.current = rightWidth;
  }, [rightWidth]);

  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(70, Math.min(250, startWidth + deltaX));
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem('leftWidth', leftWidthRef.current.toString());
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = rightWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(150, Math.min(450, startWidth - deltaX));
      setRightWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem('rightWidth', rightWidthRef.current.toString());
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };


  // Reset scroll and option states on active file change
  useEffect(() => {
    setShowScrollExitOption(false);
    const mainInner = document.querySelector('.main-bar .inner');
    if (mainInner) {
      mainInner.scrollTop = 0;
    }
  }, [activeFile]);

  // Exiting resume fullscreen reverts the main pane to the Dashboard (unless on Home section)
  useEffect(() => {
    if (!isFullScreen && activeFile === 'home.tsx' && activeSection !== 'home') {
      setActiveFile(null);
    }
  }, [isFullScreen, activeFile, activeSection]);

  // Press Escape key to exit full screen mode properly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isFullScreen) return;
    const target = e.currentTarget;
    // Check if scrolled near the bottom (with 15px buffer)
    const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 15;
    setShowScrollExitOption(atBottom);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isFullScreen) return;
    const target = e.currentTarget;
    const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 8;
    // If at the bottom, user continues to scroll down, and the exit option has been visible for at least 800ms
    if (atBottom && e.deltaY > 15) {
      if (reachedBottomTimeRef.current && Date.now() - reachedBottomTimeRef.current > 800) {
        setIsFullScreen(false);
        setShowScrollExitOption(false);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isFullScreen) return;
    const target = e.currentTarget;
    const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 8;
    if (atBottom) {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      // If user swipes up at the bottom, and the exit option has been visible for at least 800ms
      if (deltaY > 30) {
        if (reachedBottomTimeRef.current && Date.now() - reachedBottomTimeRef.current > 800) {
          setIsFullScreen(false);
          setShowScrollExitOption(false);
        }
      }
    }
  };

  const getFilesForSection = (section: 'home' | 'projects' | 'experience' | 'skills') => {
    switch (section) {
      case 'home':
        return ['home.tsx'];
      case 'experience':
        return ['dashboard', 'bot-intern.md', 'chrome-freelance.md', 'fullstack-freelance.md'];
      case 'skills':
        return ['dashboard', 'languages.json', 'frontend.json', 'backend.json', 'databases.json', 'ai-ml.json'];
      case 'projects':
      default: {
        if (loadingRepos || errorRepos || repos.length === 0) {
          return ['dashboard', 'yt-play.js', 'nitro.js', 'expenses.tsx', 'bulk-img.tsx'];
        }
        const repoFiles = repos.map(repo => `${repo.name}.${getFileExtensionForLanguage(repo.language)}`);
        return ['dashboard', ...repoFiles];
      }
    }
  };

  const files = getFilesForSection(activeSection);

  const goPrevFile = () => {
    if (files.length <= 1) return;
    if (activeFile === null) {
      setActiveFile(files[files.length - 1]);
    } else {
      const idx = files.indexOf(activeFile);
      if (idx === 0 || idx === -1) {
        setActiveFile(null);
      } else {
        setActiveFile(files[idx - 1]);
      }
    }
  };

  const goNextFile = () => {
    if (files.length <= 1) return;
    if (activeFile === null) {
      setActiveFile(files[0]);
    } else {
      const idx = files.indexOf(activeFile);
      if (idx === files.length - 1 || idx === -1) {
        setActiveFile(null);
      } else {
        setActiveFile(files[idx + 1]);
      }
    }
  };

  const handleSectionChange = (section: 'home' | 'projects' | 'experience' | 'skills') => {
    setActiveSection(section);
    if (section === 'home') {
      setActiveFile('home.tsx');
    } else {
      setActiveFile(null);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsFullScreen(checked);
  };

  const maximizeMainInfo = () => {
    setActiveFile('home.tsx');
    setIsFullScreen(true);
  };

  const sidebarTitle = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);

  return (
    <section className={`${isFullScreen ? 'fullscreen' : ''} ${isDragging ? 'dragging' : ''}`.trim()}>
      <input
        type="checkbox"
        name="mini-main"
        id="mini-main"
        checked={isFullScreen}
        onChange={(e) => handleCheckboxChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      <div className="top-bar border-container">
        <div className="inner">
          <div className="top-bar-content">
            <div className="navigation">
              <i
                className="fa-solid fa-angle-left"
                style={{ cursor: 'pointer' }}
                onClick={goPrevFile}
                title="Go to Previous File"
                aria-label="Previous File"
              ></i>
              <i
                className="fa-solid fa-angle-right"
                style={{ cursor: 'pointer' }}
                onClick={goNextFile}
                title="Go to Next File"
                aria-label="Next File"
              ></i>
            </div>

            <div className="section-selector">
              <button
                className={`section-tab ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => handleSectionChange('home')}
              >
                Home
              </button>
              <button
                className={`section-tab ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={() => handleSectionChange('projects')}
              >
                Projects
              </button>
              <button
                className={`section-tab ${activeSection === 'experience' ? 'active' : ''}`}
                onClick={() => handleSectionChange('experience')}
              >
                Experience
              </button>
              <button
                className={`section-tab ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={() => handleSectionChange('skills')}
              >
                Skills
              </button>
            </div>

            <div className="page-title">
              <h1>{activeFile || 'dashboard'}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <div 
          className="left-side-bar border-container" 
          data-title={sidebarTitle}
          style={{ width: isFullScreen ? 0 : leftWidth }}
        >
          <div className="inner">
            <div className="projects-explorer">
              {getFilesForSection(activeSection).map(file => {
                const { iconClass, color } = getFileIconAndColor(file);
                let displayLabel = file;
                if (file === 'chrome-freelance.md') displayLabel = 'chrome.md';
                if (file === 'fullstack-freelance.md') displayLabel = 'fullstack.md';
                
                const isDashboard = file === 'dashboard';
                const isActive = isDashboard ? (activeFile === null) : (activeFile === file);
                const clickHandler = isDashboard ? () => setActiveFile(null) : () => setActiveFile(file);

                return (
                  <button
                    key={file}
                    className={`explorer-item ${isActive ? 'active' : ''}`}
                    onClick={clickHandler}
                    title={isDashboard ? "Open Dashboard" : `Open ${file}`}
                  >
                    <i className={iconClass} style={{ color }}></i>
                    <span>{displayLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {!isFullScreen && (
            <div 
              className="resize-handle left-handle" 
              onMouseDown={handleLeftMouseDown}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          )}
        </div>

        <div className="main-bar border-container">
          <div
            className="inner"
            onScroll={handleScroll}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="home">
              {activeFile === null && (
                <Dashboard 
                  section={activeSection}
                  repos={repos}
                  loadingRepos={loadingRepos}
                  onSelectFile={setActiveFile}
                  onToggleFullScreen={() => setIsFullScreen(prev => !prev)}
                  isFullScreen={isFullScreen}
                  isCachedData={isCachedData}
                />
              )}
              {activeFile === 'home.tsx' && (
                <Home 
                  onToggleFullScreen={() => setIsFullScreen(prev => !prev)} 
                  isFullScreen={isFullScreen} 
                />
              )}
              
              {/* Dynamic GitHub projects */}
              {activeSection === 'projects' && activeFile !== null && activeFile !== 'home.tsx' && (() => {
                const activeRepo = repos.find(repo => {
                  const ext = getFileExtensionForLanguage(repo.language);
                  return `${repo.name}.${ext}` === activeFile;
                });
                if (activeRepo) {
                  return (
                    <GithubProject 
                      repo={activeRepo} 
                      onToggleFullScreen={() => setIsFullScreen(prev => !prev)} 
                      isFullScreen={isFullScreen} 
                    />
                  );
                }
                // Static fallbacks
                if (activeFile === 'yt-play.js') return <Project id="yt-enhancer" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />;
                if (activeFile === 'nitro.js') return <Project id="nitro-input" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />;
                if (activeFile === 'expenses.tsx') return <Project id="expense-tracker" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />;
                if (activeFile === 'bulk-img.tsx') return <Project id="bulk-editor" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />;
                return null;
              })()}

              {activeFile === 'bot-intern.md' && <Experience id="bot-intern" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'chrome-freelance.md' && <Experience id="chrome-freelance" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'fullstack-freelance.md' && <Experience id="fullstack-freelance" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}

              {activeFile === 'languages.json' && <Skills id="languages" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'frontend.json' && <Skills id="frontend" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'backend.json' && <Skills id="backend" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'databases.json' && <Skills id="databases" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'ai-ml.json' && <Skills id="ai-ml" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}


            </div>
          </div>
        </div>


        <div 
          className="right-side-bar border-container" 
          onClick={maximizeMainInfo}
          style={{ width: isFullScreen ? 0 : rightWidth }}
        >
          <div className="inner">
            <Info onToggleFullScreen={maximizeMainInfo} isFullScreen={isFullScreen}></Info>
          </div>
          {!isFullScreen && (
            <div 
              className="resize-handle right-handle" 
              onMouseDown={handleRightMouseDown}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          )}
        </div>
      </div>

      <div className="bottom-bar border-container">
        <div className="inner">
          <div>© 2025 Rudra Rathod · Built with ❤️ using React.</div>
          <div className="bottom-bar-links">
            <a
              href="mailto:rudrarathod738@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email Rudra"
            >
              <i className="fa-solid fa-envelope"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/rudra-rathod"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a
              href="https://github.com/rudrarathod"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
        </div>
      </div>
      {isFullScreen && showScrollExitOption && (
        <div
          className="scroll-exit-toast"
          onClick={() => {
            setIsFullScreen(false);
            setShowScrollExitOption(false);
          }}
        >
          <i className="fa-solid fa-compress"></i>
          <span>Scroll down further or click here to exit fullscreen</span>
        </div>
      )}
    </section>
  )
}

export default App


