import styles from '../assets/css/header.module.css';
function Footer() {
    return (
        <footer className={styles.footer}>
            <small>© {new Date().getFullYear()} eComForAll. All rights reserved.</small>
        </footer>
    );
}

export default Footer;