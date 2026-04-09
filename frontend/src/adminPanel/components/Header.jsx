import { useNavigate } from "react-router-dom";
import useAdminAuthStore from "../stores/adminAuthStore";
import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';
import styles from '../assets/css/header.module.css';

const notifications = [
    {
        id: 1,
        title: "New partner order",
        message: "Order #A392 is waiting for confirmation.",
        time: "2m ago",
    },
    {
        id: 2,
        title: "Stock alert",
        message: "3 products are running low in inventory.",
        time: "18m ago",
    },
    {
        id: 3,
        title: "Payout processed",
        message: "Weekly settlement has been completed.",
        time: "1h ago",
    },
];

function Header({ onMobileMenuToggle }) {
    
    const navigate = useNavigate();
    const { user, setLoggedOut } = useAdminAuthStore();
    const userDetails = user?.client_id || {};

    const handleProfile = () => {
        navigate("/adminPanel/profile");
    };

    const handleLogout = () => {
        setLoggedOut();
        navigate("/adminPanel");
    };

    const handleSettings = () => {
        navigate("/adminPanel/dashboard");
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button type="button" className={styles.mobileMenuBtn} onClick={onMobileMenuToggle} aria-label="Toggle sidebar" >
                    <Menu size={20} />
                </button>
                <div className={styles.brand}>
                    <span className={styles.logo}>  {userDetails?.businessName?.charAt(0).toUpperCase()}</span>
                    
                    <span> {userDetails?.businessName}  (  {userDetails?.clientName} )</span>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.notificationWrapper}>
                    <button type="button" className={styles.notifications}>
                        <Bell size={20} />
                        <span className={styles.badge}>{notifications.length}</span>
                    </button>
                    <div className={styles.notificationDropdown}>
                        <div className={styles.notificationHeader}>Notifications</div>
                        {notifications.map((item) => (
                            <button key={item.id} type="button" className={styles.notificationItem}>
                                <span className={styles.notificationDot}></span>
                                <div className={styles.notificationContent}>
                                    <p className={styles.notificationTitle}>{item.title}</p>
                                    <p className={styles.notificationMessage}>{item.message}</p>
                                </div>
                                <span className={styles.notificationTime}>{item.time}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.profileWrapper}>
                    <button type="button" className={styles.profileButton}>
                        <User size={18} />
                        <span className={styles.welcome}>{userDetails?.clientName|| "Admin"}</span>
                    </button>
                    <div className={styles.profileDropdown}>
                        <button type="button" className={styles.dropdownItem} onClick={handleProfile}>
                            <User size={16} />
                            <span>Profile</span>
                        </button>
                        <button type="button" className={styles.dropdownItem} onClick={handleSettings}>
                            <Settings size={16} />
                            <span>Settings</span>
                        </button>
                        <button type="button" className={styles.dropdownItem} onClick={handleLogout}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;