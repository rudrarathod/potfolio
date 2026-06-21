import styles from './project.module.css';

interface ExperienceProps {
  id: string;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

const EXPERIENCE_DATA: Record<string, {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  filename: string;
}> = {
  'bot-intern': {
    title: 'Software Development & Training Intern',
    company: 'Black Orange Talent-India, Pune',
    period: 'Aug 2025 – Present',
    bullets: [
      'Developed STEM-focused EdTech software and IoT learning modules using ESP32.',
      'Conducted hands-on technical workshops for 50+ students in electronics and programming.',
      'Created curriculum documentation, project proposals, and training material.',
      'Coordinated with cross-functional teams to enhance student engagement.'
    ],
    filename: 'bot-intern.md'
  },
  'chrome-freelance': {
    title: 'Chrome Extension Developer',
    company: 'Freelance Contracts',
    period: 'Sep 2023 – Present',
    bullets: [
      'Built production-grade Chrome extensions using Manifest V3, service workers, and content scripts.',
      'Integrated Google Gemini API for AI text generation and computer vision features.',
      'Optimized extensions to under 50MB RAM usage with 30% performance improvement.',
      'Published and maintained extensions on Chrome Web Store and Edge Add-ons.'
    ],
    filename: 'chrome-freelance.md'
  },
  'fullstack-freelance': {
    title: 'Full-Stack Developer',
    company: 'Freelance Projects',
    period: 'Jan 2023 – Present',
    bullets: [
      'Developed full-stack web applications using React, TypeScript, Node.js, and PHP.',
      'Designed RESTful APIs and scalable database systems using MySQL and MongoDB.',
      'Integrated AI services including Gemini API and OCR with 90% data accuracy.',
      'Built responsive dashboards and authentication systems following security best practices.'
    ],
    filename: 'fullstack-freelance.md'
  }
};

export default function Experience({ id, onToggleFullScreen, isFullScreen }: ExperienceProps) {
  const exp = EXPERIENCE_DATA[id];

  if (!exp) {
    return <div style={{ padding: 20 }}>Experience record not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>
        <span>experience/{exp.filename}</span>
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
        <h1 className={styles.title}>{exp.title}</h1>
        <div className={styles.role}>{exp.company}</div>
        <div style={{ color: '#867c6b', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 'bold' }}>{exp.period}</div>

        <div className={styles.sectionHeader}>Key Achievements & Responsibilities</div>
        <ul className={styles.bullets}>
          {exp.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>

        <div className={styles.codeBlockHeader}>File Metadata</div>
        <pre className={styles.codeBlock}>
{`---
title: "${exp.title}"
company: "${exp.company}"
period: "${exp.period}"
status: "Completed / Active"
---`}
        </pre>
      </div>
    </div>
  );
}
