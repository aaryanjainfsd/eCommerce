import styles from "../assets/css/footer.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div>
                <p className={styles.title}>eComForAll Super Admin Workspace</p>
                <span className={styles.caption}>Secure client data handling and operational monitoring.</span>
            </div>

            <nav className={styles.nav}>
                <a href="/terms" className={styles.navLink}>Terms of Service</a>
                <a href="/privacy" className={styles.navLink}>Privacy Policy</a>
                <a href="/contact" className={styles.navLink}>Contact</a>
            </nav>
        </footer>
    );
}

export default Footer;