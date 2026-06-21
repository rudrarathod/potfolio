import { useState, useEffect, useRef } from 'react'
import './App.css'
import Home from './pages/home'
import Info from './pages/info'
import Project from './pages/project'
import Experience from './pages/experience'
import Skills from './pages/skills'

function App() {
  const [activeSection, setActiveSection] = useState<'projects' | 'experience' | 'skills'>('projects');
  const [activeFile, setActiveFile] = useState<string>('home.tsx');
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showScrollExitOption, setShowScrollExitOption] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  const [leftWidth, setLeftWidth] = useState<number>(() => {
    const saved = localStorage.getItem('leftWidth');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [rightWidth, setRightWidth] = useState<number>(() => {
    const saved = localStorage.getItem('rightWidth');
    return saved ? parseInt(saved, 10) : 250;
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
    // If at the bottom and user continues to scroll down (deltaY > 15)
    if (atBottom && e.deltaY > 15) {
      setIsFullScreen(false);
      setShowScrollExitOption(false);
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
      // If user swipes up at the bottom (scrolling down further)
      if (deltaY > 30) {
        setIsFullScreen(false);
        setShowScrollExitOption(false);
      }
    }
  };

  const getFilesForSection = (section: 'projects' | 'experience' | 'skills') => {
    switch (section) {
      case 'experience':
        return ['home.tsx', 'bot-intern.md', 'chrome-freelance.md', 'fullstack-freelance.md'];
      case 'skills':
        return ['home.tsx', 'languages.json', 'frontend.json', 'backend.json', 'databases.json', 'ai-ml.json'];
      case 'projects':
      default:
        return ['home.tsx', 'yt-play.js', 'nitro.js', 'expenses.tsx', 'bulk-img.tsx'];
    }
  };

  const files = getFilesForSection(activeSection);

  const goPrevFile = () => {
    const idx = files.indexOf(activeFile);
    const prevIdx = (idx - 1 + files.length) % files.length;
    setActiveFile(files[prevIdx]);
  };

  const goNextFile = () => {
    const idx = files.indexOf(activeFile);
    const nextIdx = (idx + 1) % files.length;
    setActiveFile(files[nextIdx]);
  };

  const handleSectionChange = (section: 'projects' | 'experience' | 'skills') => {
    setActiveSection(section);
    setActiveFile('home.tsx');
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsFullScreen(checked);
    if (checked) {
      setActiveFile('home.tsx');
    }
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
          <p>
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
              <h1>{activeFile}</h1>
            </div>
          </p>
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
              <button
                className={`explorer-item ${activeFile === 'home.tsx' ? 'active' : ''}`}
                onClick={() => setActiveFile('home.tsx')}
                title="Open home.tsx"
              >
                <i className="fa-solid fa-file-code" style={{ color: '#fabd2f' }}></i>
                <span>home.tsx</span>
              </button>

              {activeSection === 'projects' && (
                <>
                  <button
                    className={`explorer-item ${activeFile === 'yt-play.js' ? 'active' : ''}`}
                    onClick={() => setActiveFile('yt-play.js')}
                    title="Open yt-play.js"
                  >
                    <i className="fa-solid fa-file-code" style={{ color: '#fabd2f' }}></i>
                    <span>yt-play.js</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'nitro.js' ? 'active' : ''}`}
                    onClick={() => setActiveFile('nitro.js')}
                    title="Open nitro.js"
                  >
                    <i className="fa-solid fa-file-code" style={{ color: '#fabd2f' }}></i>
                    <span>nitro.js</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'expenses.tsx' ? 'active' : ''}`}
                    onClick={() => setActiveFile('expenses.tsx')}
                    title="Open expenses.tsx"
                  >
                    <i className="fa-solid fa-file-code" style={{ color: '#fabd2f' }}></i>
                    <span>expenses.tsx</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'bulk-img.tsx' ? 'active' : ''}`}
                    onClick={() => setActiveFile('bulk-img.tsx')}
                    title="Open bulk-img.tsx"
                  >
                    <i className="fa-solid fa-file-code" style={{ color: '#fabd2f' }}></i>
                    <span>bulk-img.tsx</span>
                  </button>
                </>
              )}

              {activeSection === 'experience' && (
                <>
                  <button
                    className={`explorer-item ${activeFile === 'bot-intern.md' ? 'active' : ''}`}
                    onClick={() => setActiveFile('bot-intern.md')}
                    title="Open bot-intern.md"
                  >
                    <i className="fa-solid fa-file-lines" style={{ color: '#b8bb26' }}></i>
                    <span>bot-intern.md</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'chrome-freelance.md' ? 'active' : ''}`}
                    onClick={() => setActiveFile('chrome-freelance.md')}
                    title="Open chrome-freelance.md"
                  >
                    <i className="fa-solid fa-file-lines" style={{ color: '#b8bb26' }}></i>
                    <span>chrome.md</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'fullstack-freelance.md' ? 'active' : ''}`}
                    onClick={() => setActiveFile('fullstack-freelance.md')}
                    title="Open fullstack-freelance.md"
                  >
                    <i className="fa-solid fa-file-lines" style={{ color: '#b8bb26' }}></i>
                    <span>fullstack.md</span>
                  </button>
                </>
              )}

              {activeSection === 'skills' && (
                <>
                  <button
                    className={`explorer-item ${activeFile === 'languages.json' ? 'active' : ''}`}
                    onClick={() => setActiveFile('languages.json')}
                    title="Open languages.json"
                  >
                    <i className="fa-solid fa-gears" style={{ color: '#83a598' }}></i>
                    <span>languages.json</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'frontend.json' ? 'active' : ''}`}
                    onClick={() => setActiveFile('frontend.json')}
                    title="Open frontend.json"
                  >
                    <i className="fa-solid fa-gears" style={{ color: '#83a598' }}></i>
                    <span>frontend.json</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'backend.json' ? 'active' : ''}`}
                    onClick={() => setActiveFile('backend.json')}
                    title="Open backend.json"
                  >
                    <i className="fa-solid fa-gears" style={{ color: '#83a598' }}></i>
                    <span>backend.json</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'databases.json' ? 'active' : ''}`}
                    onClick={() => setActiveFile('databases.json')}
                    title="Open databases.json"
                  >
                    <i className="fa-solid fa-gears" style={{ color: '#83a598' }}></i>
                    <span>databases.json</span>
                  </button>
                  <button
                    className={`explorer-item ${activeFile === 'ai-ml.json' ? 'active' : ''}`}
                    onClick={() => setActiveFile('ai-ml.json')}
                    title="Open ai-ml.json"
                  >
                    <i className="fa-solid fa-gears" style={{ color: '#83a598' }}></i>
                    <span>ai-ml.json</span>
                  </button>
                </>
              )}
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
              {activeFile === 'home.tsx' && <Home onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'yt-play.js' && <Project id="yt-enhancer" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'nitro.js' && <Project id="nitro-input" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'expenses.tsx' && <Project id="expense-tracker" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'bulk-img.tsx' && <Project id="bulk-editor" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}

              {activeFile === 'bot-intern.md' && <Experience id="bot-intern" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'chrome-freelance.md' && <Experience id="chrome-freelance" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'fullstack-freelance.md' && <Experience id="fullstack-freelance" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}

              {activeFile === 'languages.json' && <Skills id="languages" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'frontend.json' && <Skills id="frontend" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'backend.json' && <Skills id="backend" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'databases.json' && <Skills id="databases" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}
              {activeFile === 'ai-ml.json' && <Skills id="ai-ml" onToggleFullScreen={() => setIsFullScreen(prev => !prev)} isFullScreen={isFullScreen} />}

              {isFullScreen && showScrollExitOption && (
                <div className="scroll-exit-container">
                  <button
                    onClick={() => {
                      setIsFullScreen(false);
                      setShowScrollExitOption(false);
                    }}
                    className="scroll-exit-btn"
                  >
                    <i className="fa-solid fa-compress" style={{ marginRight: '8px' }}></i>
                    Exit Fullscreen (Scroll down further or click to exit)
                  </button>
                </div>
              )}
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
          <p>
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
          </p>
        </div>
      </div>
    </section>
  )
}

export default App


