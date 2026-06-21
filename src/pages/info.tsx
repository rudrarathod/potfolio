import styles from './info.module.css';
import educationImg from '../assets/education.jpeg';
import interestImg from '../assets/intrest.png';

interface InfoProps {
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

function Info({ onToggleFullScreen, isFullScreen }: InfoProps) {

    return (
        <>
            <h4 className={styles.name}>Rudra Rathod
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleFullScreen) onToggleFullScreen();
                    }}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                    title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    <i className={isFullScreen ? "fa-solid fa-down-left-and-up-right-to-center" : "fa-solid fa-up-right-and-down-left-from-center"}></i>
                </button>
            </h4>
            <div className={styles.pfp}></div>


            <div>
                <h4>Software Dev Intern & Freelancer</h4>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.cardImg} style={{ backgroundImage: `url(${educationImg})` }}>
                    <div className={styles.infoCardDiv}>about my education</div>
                </div>
                <div className={styles.infoCardDiv}><b className={styles.bold}>STUDENT</b><br />
                    ISB & M School of Technology, Pune
                </div>
                <div className={styles.infoCardDiv}>
                    <b className={styles.bold}>BRANCH</b><br />
                    Artificial Intelligence & Machine Learning
                </div>
                <div className={styles.infoCardDiv}>
                    <b className={styles.bold}>PREVIOUS EDUCATION</b>
                    <br />
                    Diploma in Computer Engineering
                </div>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.cardImg} style={{ backgroundImage: `url(${interestImg})` }}>
                    <div className={styles.infoCardDiv}>interests</div>
                </div>
                <div className={styles.infoCardDiv}><b className={styles.bold}>AI & WORKFLOW AUTOMATION</b><br />
                    Google Gemini API, NLP, Computer Vision, OCR
                </div>
                <div className={styles.infoCardDiv}>
                    <b className={styles.bold}>WEB & BROWSER EXTENSIONS</b><br />
                    React, Next.js, Node.js, Manifest V3
                </div>
                <div className={styles.infoCardDiv}>
                    <b className={styles.bold}>TOOLS & ELECTRONICS</b>
                    <br />
                    Git, GitHub, ESP32, IoT, Arduino
                </div>
            </div>
        </>
    )
}

export default Info