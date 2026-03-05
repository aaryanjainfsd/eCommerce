import { Link, useNavigate } from "react-router-dom";
import styles from '../assets/css/header.module.css';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: clear auth tokens and redirect to login
        navigate("/admin/login");
    };

    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <span className={styles.logo}>E</span>
                <span>eComForAll Admin</span>
            </div>
            <nav className={styles.nav}>
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/orders">Orders</Link>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default Header;