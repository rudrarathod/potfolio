import styles from './home.module.css';

function Home() {

    return (
        <>

            <div className={styles.section}>


                <h4 className={styles.name}>Rudra Rathod <i className="fa-solid fa-down-left-and-up-right-to-center"></i></h4>
                <br /><br /><br />
                <br />

                <div className={styles.pfp}></div>

                <div className={styles.objective}>
                    <b>Objective</b><br />
                    Motivated and creative AI & ML student at ISBM College of Engineering with a solid foundation
                    in programming, web development, and AI tools. Experienced in developing dynamic projects
                    using HTML, CSS, JavaScript, PHP, Python, and Java. Passionate about Robotics, the Internet of
                    Things (IoT), Artificial Intelligence, and mentoring others. Committed to hands-on learning and
                    eager to contribute to product development and technology education at scale.
                </div>

                <div className={styles.details}>
                    <div
                        className={styles.infoCard}
                        style={{ backgroundImage: "url('src/assets/education.jpeg')" }}
                    >
                        <div className={`${styles.cardImg} ${styles.infoCardDiv}`}>
                            <div>about my education</div>
                        </div>

                        <div className={styles.infoCardDiv}>
                            <div>
                                <b className={styles.bold}>STUDENT</b>
                                <br />
                                isbm college of engineering
                            </div>
                            <div>
                                <b className={styles.bold}>BRANCH</b>
                                <br />
                                artificial intelligence and machine learning
                            </div>
                            <div>
                                <b className={styles.bold}>PREVIOUS EDUCATION</b>
                                <br />
                                diploma in computer engineering
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.cardImg} style={{ backgroundImage: "url('src/assets/intrest.png')" }}>
                            <div className={styles.infoCardDiv}>intrest</div>
                        </div>
                        <div className={styles.infoCardDiv}><b className={styles.bold}>AI & WORKFLOW AUTOMATION</b><br />
                            python, n8n, genrative ai, and other tools
                        </div>
                        <div className={styles.infoCardDiv}>
                            <b className={styles.bold}>WEB & ANDROID DEVOLOPMENT</b><br />
                            react, react native, tailwind, bootstrap, and more
                        </div>
                        <div className={styles.infoCardDiv}>
                            <b className={styles.bold}>IOT & ELECTRONICS</b>
                            <br />
                            iot devices, arduino, and raspberry pi
                        </div>
                    </div>
                </div>

                <br /><br /><br />
            </div>

        </>
    );
}

export default Home;
