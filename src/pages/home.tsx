import styles from './home.module.css';
import educationImg from '../assets/education.jpeg';
import interestImg from '../assets/intrest.png';
import resumeData from '../data/resume.json';

interface HomeProps {
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

function Home({ onToggleFullScreen, isFullScreen }: HomeProps) {
  return (
    <>
      <div className={styles.section}>
        <h4 className={styles.name}>
          {resumeData.name}
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
        <br />

        <div className={styles.pfp}></div>

        <div className={styles.objective}>
          <div className={styles.objectivetext}>
            <b>Objective</b><br />
            {resumeData.objective}
          </div>
        </div>

        <div className={styles.details}>
          <div
            className={styles.infoCard}
            style={{ backgroundImage: `url(${educationImg})` }}
          >
            <div className={`${styles.cardImg} ${styles.infoCardDiv}`}>
              <div>about my education</div>
            </div>

            <div className={styles.infoCardDiv}>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: idx < resumeData.education.length - 1 ? '10px' : '0' }}>
                  <b className={styles.bold}>{edu.degree}</b>
                  <br />
                  {edu.school}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardImg} style={{ backgroundImage: `url(${interestImg})` }}>
              <div className={styles.infoCardDiv}>interests</div>
            </div>
            {resumeData.interests.map((interest, idx) => (
              <div key={idx} className={styles.infoCardDiv}>
                <b className={styles.bold}>{interest.topic}</b>
                <br />
                {interest.details}
              </div>
            ))}
          </div>
        </div>

        {/* Experience section */}
        <div style={{ padding: '10px', marginTop: '24px' }}>
          <div>
            <b style={{ fontSize: '1.2rem', color: '#FBF1C7', borderBottom: '1px solid #3c3836', display: 'block', paddingBottom: '6px', marginBottom: '12px' }}>Experience</b>
            
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ marginTop: idx === 0 ? '16px' : '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <b className={styles.bold}>{exp.role}</b>
                  <span style={{ color: '#867C6B' }}>{exp.period}</span>
                </div>
                <div style={{ color: '#b8bb26', fontWeight: 'bold' }}>{exp.company}</div>
                <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Languages section */}
        <div style={{ padding: '10px', marginTop: '24px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <b style={{ fontSize: '1.2rem', color: '#FBF1C7', borderBottom: '1px solid #3c3836', display: 'block', paddingBottom: '6px', marginBottom: '12px' }}>Certifications & Achievements</b>
            <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
              {resumeData.certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </div>

          <div style={{ flex: 1, minWidth: '250px' }}>
            <b style={{ fontSize: '1.2rem', color: '#FBF1C7', borderBottom: '1px solid #3c3836', display: 'block', paddingBottom: '6px', marginBottom: '12px' }}>Languages</b>
            <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
              {resumeData.languages.map((lang, idx) => (
                <li key={idx}>{lang}</li>
              ))}
            </ul>
          </div>
        </div>

        <br /><br /><br />
      </div>
    </>
  );
}

export default Home;
