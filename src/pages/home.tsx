import styles from './home.module.css';
import educationImg from '../assets/education.jpeg';
import interestImg from '../assets/intrest.png';

interface HomeProps {
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

function Home({ onToggleFullScreen, isFullScreen }: HomeProps) {

    return (
        <>

            <div className={styles.section}>


                <h4 className={styles.name}>Rudra Rathod
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
                        Motivated and creative Full-Stack Developer, AI Integration Specialist, and Chrome Extension Developer at ISB & M School of Technology. Eager to build production-grade software and integrate advanced AI models (like Gemini API) into web and browser ecosystems. Experienced in developing scalable, low-latency applications, hosting workshops, and scaling open-source solutions to thousands of active users.
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
                            <div>
                                <b className={styles.bold}>STUDENT (B.E. AI & ML)</b>
                                <br />
                                ISB & M School of Technology, Pune
                            </div>
                            <div>
                                <b className={styles.bold}>BRANCH & PERIOD</b>
                                <br />
                                Artificial Intelligence & Machine Learning (Sep 2024 – Present)
                            </div>
                            <div>
                                <b className={styles.bold}>PREVIOUS EDUCATION</b>
                                <br />
                                Diploma in Computer Engineering · GP Yavatmal
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.cardImg} style={{ backgroundImage: `url(${interestImg})` }}>
                            <div className={styles.infoCardDiv}>interests</div>
                        </div>
                        <div className={styles.infoCardDiv}><b className={styles.bold}>AI & WORKFLOW AUTOMATION</b><br />
                            Gemini API, Gemini Vision, NLP, Computer Vision, OCR
                        </div>
                        <div className={styles.infoCardDiv}>
                            <b className={styles.bold}>FULL-STACK & BROWSER EXTENSIONS</b><br />
                            React, Next.js, Node.js, Express, Manifest V3 Extensions
                        </div>
                        <div className={styles.infoCardDiv}>
                            <b className={styles.bold}>DATABASES & ELECTRONICS</b>
                            <br />
                            MySQL, MongoDB, ESP32, IoT devices, and Arduino
                        </div>
                    </div>
                </div>

                {/* Experience section */}
                <div style={{ padding: '10px', marginTop: '24px' }}>
                    <div>
                        <b style={{ fontSize: '1.2rem', color: '#FBF1C7', borderBottom: '1px solid #3c3836', display: 'block', paddingBottom: '6px', marginBottom: '12px' }}>Experience</b>
                        
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <b className={styles.bold}>SOFTWARE DEVELOPMENT & TRAINING INTERN</b>
                                <span style={{ color: '#867C6B' }}>Aug 2025 – Present</span>
                            </div>
                            <div style={{ color: '#b8bb26', fontWeight: 'bold' }}>Black Orange Talent-India, Pune</div>
                            <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
                                <li>Developed STEM-focused EdTech software and IoT learning modules using ESP32.</li>
                                <li>Conducted hands-on technical workshops for 50+ students in electronics and programming.</li>
                                <li>Created curriculum documentation, project proposals, and training material.</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <b className={styles.bold}>CHROME EXTENSION DEVELOPER (FREELANCE)</b>
                                <span style={{ color: '#867C6B' }}>Sep 2023 – Present</span>
                            </div>
                            <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
                                <li>Built production-grade Chrome extensions using Manifest V3, service workers, and content scripts.</li>
                                <li>Integrated Google Gemini API for AI text generation and computer vision features.</li>
                                <li>Optimized extensions to under 50MB RAM usage with 30% performance improvement.</li>
                                <li>Published and maintained extensions on Chrome Web Store and Edge Add-ons.</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <b className={styles.bold}>FULL-STACK DEVELOPER (FREELANCE)</b>
                                <span style={{ color: '#867C6B' }}>Jan 2023 – Present</span>
                            </div>
                            <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
                                <li>Developed full-stack web applications using React, TypeScript, Node.js, and PHP.</li>
                                <li>Designed RESTful APIs and database schemas using MySQL and MongoDB.</li>
                                <li>Integrated AI services including Gemini API and OCR with 90% data accuracy.</li>
                            </ul>
                        </div>
                    </div>
                </div>




                {/* Certifications & Languages section */}
                <div style={{ padding: '10px', marginTop: '24px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <b style={{ fontSize: '1.2rem', color: '#FBF1C7', borderBottom: '1px solid #3c3836', display: 'block', paddingBottom: '6px', marginBottom: '12px' }}>Certifications & Achievements</b>
                        <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
                            <li>Google AI Studio Certified – Gemini API</li>
                            <li>GitHub Student Developer Pack Member</li>
                            <li>Open-source contributor with 10,000+ active users</li>
                        </ul>
                    </div>

                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <b style={{ fontSize: '1.2rem', color: '#FBF1C7', borderBottom: '1px solid #3c3836', display: 'block', paddingBottom: '6px', marginBottom: '12px' }}>Languages</b>
                        <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#fbf1c7', opacity: 0.9, lineHeight: '1.6' }}>
                            <li>English (Professional)</li>
                            <li>Hindi (Native)</li>
                            <li>Marathi (Native)</li>
                        </ul>
                    </div>
                </div>

                <br /><br /><br />
            </div>

        </>
    );
}

export default Home;

