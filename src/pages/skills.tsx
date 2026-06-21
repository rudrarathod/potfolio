import styles from './project.module.css';

interface SkillsProps {
  id: string;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

const SKILLS_DATA: Record<string, {
  category: string;
  skills: string[];
  filename: string;
  description: string;
}> = {
  'languages': {
    category: 'Programming Languages',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'PHP', 'SQL', 'HTML', 'CSS'],
    filename: 'languages.json',
    description: 'Core languages used for building web client interfaces, scripting AI tools, writing service workers, and managing database queries.'
  },
  'frontend': {
    category: 'Frontend Frameworks & Design',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'SCSS', 'Responsive Design'],
    filename: 'frontend.json',
    description: 'Frameworks and styling systems used for building responsive, high-performance user interfaces and interactive dashboards.'
  },
  'backend': {
    category: 'Backend Technologies',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'PHP'],
    filename: 'backend.json',
    description: 'Server runtime environments and frameworks used for creating robust APIs, writing backend service modules, and logic processing.'
  },
  'databases': {
    category: 'Database Systems',
    skills: ['MySQL', 'MongoDB', 'IndexedDB'],
    filename: 'databases.json',
    description: 'Scalable data storage engines, query languages, and client-side database modules used to persist application states.'
  },
  'ai-ml': {
    category: 'AI, ML & Automation Integration',
    skills: ['Google Gemini API', 'Gemini Vision', 'OCR', 'NLP', 'Computer Vision'],
    filename: 'ai-ml.json',
    description: 'AI model integrations and computer vision services used to automate content workflows, extract receipt text, and process images.'
  }
};

export default function Skills({ id, onToggleFullScreen, isFullScreen }: SkillsProps) {
  const sk = SKILLS_DATA[id];

  if (!sk) {
    return <div style={{ padding: 20 }}>Skill category not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>
        <span>skills/{sk.filename}</span>
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
        <h1 className={styles.title}>{sk.category}</h1>
        <div className={styles.role}>Technical Profile</div>
        <p className={styles.description}>{sk.description}</p>

        <div className={styles.sectionHeader}>Technologies & Competencies</div>
        <div className={styles.tags} style={{ marginTop: '15px', marginBottom: '35px' }}>
          {sk.skills.map(skill => (
            <span key={skill} className={styles.tag} style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
              {skill}
            </span>
          ))}
        </div>

        <div className={styles.codeBlockHeader}>Source Array</div>
        <pre className={styles.codeBlock}>
{`{
  "category": "${sk.category}",
  "filename": "${sk.filename}",
  "skills": ${JSON.stringify(sk.skills, null, 2)}
}`}
        </pre>
      </div>
    </div>
  );
}
