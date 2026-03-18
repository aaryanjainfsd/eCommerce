import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../assets/css/header.module.css";
import { useNavigate } from "react-router-dom";
import useSuperAdminAuthStore from "../stores/SuperAdminAuthStore";
import { SuperAdminLogoutAPI } from "../api/services/superAdminAuth.jsx";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { user, setLoggedOut } = useSuperAdminAuthStore();

    useEffect(() => {
        function handleOutsideClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    async function handleLogout() {
        try {
            await SuperAdminLogoutAPI();
        } catch (_) {
            // proceed with local logout even if server call fails
        }
        setLoggedOut();
        navigate("/superAdminPanel");
    }

    return (
        <header className={styles.header}>
            <div className={styles.compactRow}>
                <div className={styles.brandInline}>
                    <div className={styles.logoWrap}>
                        <span className={styles.logo}>SA</span>
                    </div>
                    <div>
                        <p className={styles.kicker}>Executive workspace</p>
                        <h1 className={styles.title}>Super Admin Panel</h1>
                    </div>
                </div>

                <div className={styles.utilityArea}>
                    <div className={styles.ownerMenuWrap} ref={menuRef}>
                        <button type="button" className={styles.ownerButton} onClick={() => setIsMenuOpen((previousValue) => !previousValue)} aria-expanded={isMenuOpen} aria-haspopup="menu" >
                            <span className={styles.ownerMeta}>
                                <span className={styles.ownerWelcome}>Welcome, {user.role}</span>
                                <strong className={styles.ownerName}>{user.name}</strong>
                            </span>
                            <span className={styles.ownerChevron}>
                                <ChevronDown size={16} />
                            </span>
                        </button>

                        {isMenuOpen && (
                            <div className={styles.dropdown} role="menu">
                                <button type="button" className={styles.dropdownItem} role="menuitem">
                                    <Settings size={16} />
                                    Settings
                                </button>
                                <button type="button" onClick={handleLogout}  className={styles.dropdownItem} role="menuitem">
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;