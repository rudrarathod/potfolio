import styles from './project.module.css';

interface ProjectProps {
  id: string;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

const PROJECTS_DATA: Record<string, {
  title: string;
  role: string;
  tags: string[];
  description: string;
  bullets: string[];
  filename: string;
}> = {
  'yt-enhancer': {
    title: 'YouTube Experience Enhancer',
    role: 'Chrome Extension Developer',
    tags: ['JavaScript', 'Manifest V3', 'Service Workers'],
    description: 'A production-grade Chrome extension published on the Chrome Web Store that improves the desktop viewing experience on YouTube.',
    bullets: [
      'Implemented picture-in-picture miniplayer with gesture controls and video extraction.',
      'Built drag-and-drop positioning, keyboard shortcuts, and resize controls.',
      'Achieved 30% efficiency improvement and successfully published to Chrome Web Store.'
    ],
    filename: 'yt-play.js'
  },
  'nitro-input': {
    title: 'Nitro-Input-AI',
    role: 'Chrome Extension Developer',
    tags: ['JavaScript', 'Google Gemini API', 'NLP'],
    description: 'An AI-powered writing assistant compatible with all websites, offering context-aware text generation and summarization.',
    bullets: [
      'Developed AI-powered writing assistant compatible with all websites.',
      'Implemented secure API handling, rate limiting, and privacy-first architecture.',
      'Designed customizable prompts, shortcuts, and command history.'
    ],
    filename: 'nitro.js'
  },
  'expense-tracker': {
    title: 'Finance Expense Tracker',
    role: 'Full-Stack Developer',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'OCR', 'Gemini API'],
    description: 'An AI-powered expense tracking and budgeting dashboard featuring automatic receipt scanning and financial analytics.',
    bullets: [
      'Built AI-powered receipt scanning system with 90% extraction accuracy.',
      'Developed interactive dashboards for budgeting, analytics, and CSV data export.',
      'Integrated Google Gemini Vision API and OCR services for document text extraction.'
    ],
    filename: 'expenses.tsx'
  },
  'bulk-editor': {
    title: 'Gemini Bulk Image Editor',
    role: 'Full-Stack Developer',
    tags: ['React', 'TypeScript', 'Gemini Vision API'],
    description: 'A web-based batch image editing platform that leverages Gemini Vision API for high-speed parallel image modifications.',
    bullets: [
      'Created batch image editor handling up to 50 images per request.',
      'Achieved 40% faster processing via parallel API execution.',
      'Designed responsive UI/UX for image uploads, settings, and progress tracking.'
    ],
    filename: 'bulk-img.tsx'
  }
};

export default function Project({ id, onToggleFullScreen, isFullScreen }: ProjectProps) {
  const project = PROJECTS_DATA[id];

  if (!project) {
    return <div style={{ padding: 20 }}>Project not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>
        <span>projects/{project.filename}</span>
        <button
          onClick={onToggleFullScreen}
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
          title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <i className={isFullScreen ? "fa-solid fa-down-left-and-up-right-to-center" : "fa-solid fa-up-right-and-down-left-from-center"}></i>
        </button>
      </h4>
      <br /><br /><br />
      
      <div className={styles.content}>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.role}>{project.role}</div>
        
        <div className={styles.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <p className={styles.description}>{project.description}</p>

        <div className={styles.sectionHeader}>Key Contributions</div>
        <ul className={styles.bullets}>
          {project.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>

        <div className={styles.codeBlockHeader}>Source Metadata</div>
        <pre className={styles.codeBlock}>
{`{
  "projectName": "${project.title}",
  "technologyStack": ${JSON.stringify(project.tags)},
  "developerRole": "${project.role}",
  "status": "Production / Published"
}`}
        </pre>
      </div>
    </div>
  );
}
