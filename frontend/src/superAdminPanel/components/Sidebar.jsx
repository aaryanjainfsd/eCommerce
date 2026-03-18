import {
    ChevronLeft,
    ChevronRight,
    UserPlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "../assets/css/sidebar.module.css";

function Sidebar({ isCollapsed, isMobileOpen, onToggleCollapse, onCloseMobile }) {
    const sidebarClasses = [styles.sidebar, isCollapsed ? styles.collapsed : "", isMobileOpen ? styles.mobileOpen : ""]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            <button
                type="button"
                className={`${styles.backdrop} ${isMobileOpen ? styles.backdropVisible : ""}`}
                onClick={onCloseMobile}
                aria-label="Close sidebar"
            />

            <aside className={sidebarClasses}>
                <div className={styles.sidebarTop}>
                    <div className={styles.identityRow}>
                        <div className={styles.identityBadge}>SA</div>
                        {!isCollapsed && (
                            <div className={styles.identityText}>
                                <p className={styles.identityLabel}>Control Center</p>
                                <strong className={styles.identityTitle}>Super Admin</strong>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className={styles.collapseButton}
                        onClick={onToggleCollapse}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                <nav className={styles.nav}>
                    <div className={styles.group}>
                        <div className={styles.linkList}>
                            <NavLink
                                to="/superAdminPanel/clients"
                                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`.trim()}
                                onClick={onCloseMobile}
                                title={isCollapsed ? "Add Client" : undefined}
                            >
                                <span className={styles.navIcon}>
                                    <UserPlus size={18} />
                                </span>
                                {!isCollapsed && <span className={styles.navText}>Add Client</span>}
                            </NavLink>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;