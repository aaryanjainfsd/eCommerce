import { Link, useNavigate } from "react-router-dom";
import useAdminAuthStore from "../stores/adminAuthStore";
import { Home, Package, ShoppingCart, Search, Bell, User } from 'lucide-react';
import styles from '../assets/css/header.module.css';

function Header() {
    const navigate = useNavigate();
    const { user, setLoggedOut } = useAdminAuthStore();

    const handleLogout = () => {
        // Clear stored auth state and send user to login page
        setLoggedOut();
        navigate("/admin");
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.brand}>
                    <span className={styles.logo}>E</span>
                    <span>eComForAll Admin</span>
                </div>
            </div>
            <div className={styles.center}>
                <div className={styles.search}>
                    <Search size={20} />
                    <input type="text" placeholder="Search products, orders..." />
                </div>
            </div>
            <div className={styles.right}>
                <nav className={styles.nav}>
                    <Link to="/admin/dashboard" className={styles.navLink}>
                        <Home size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className={styles.navLink}>
                        <Package size={20} />
                        <span>Products</span>
                    </Link>
                    <Link to="/admin/orders" className={styles.navLink}>
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </Link>
                </nav>
                <div className={styles.notifications}>
                    <Bell size={20} />
                    <span className={styles.badge}>3</span>
                </div>
                <div className={styles.userSection}>
                    {user?.username && (
                        <div className={styles.userInfo}>
                            <User size={20} />
                            <span className={styles.welcome}>
                                Welcome, {user.username}
                            </span>
                        </div>
                    )}
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;