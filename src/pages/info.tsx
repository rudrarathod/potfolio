

import styles from './info.module.css';

function Info() {

    return (
        <>
            <h4>Rudra Rathod</h4>
            <div className={styles.pfp}></div>

            <div>
                <h4>intern at BOT</h4>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.cardImg} style={{ backgroundImage: "url('src/assets/education.jpeg')" }}>
                    <div className={styles.infoCardDiv}>about my education</div>
                </div>
                <div className={styles.infoCardDiv}><b className={styles.bold}>STUDENT</b><br />
                    isbm college of engineering
                </div>
                <div className={styles.infoCardDiv}>
                    <b className={styles.bold}>BRANCH</b><br />
                    artificial intelligence and machine learning
                </div>
                <div className={styles.infoCardDiv}>
                    <b className={styles.bold}>PREVIOUS EDUCATION</b>
                    <br />
                    diploma in computer engineering
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
        </>
    )
}

export default Info