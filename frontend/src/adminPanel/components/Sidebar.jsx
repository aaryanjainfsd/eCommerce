import { NavLink } from "react-router-dom";
import {
    ChevronsLeft,
    ChevronsRight,
    Home,
    Package,
    ShoppingCart,
    X,
} from "lucide-react";
import styles from "../assets/css/header.module.css";

const navItems = [
    { to: "/adminPanel/dashboard", label: "Dashboard", icon: Home },
    { to: "/adminPanel/products", label: "Products", icon: Package },
    { to: "/adminPanel/orders", label: "Orders", icon: ShoppingCart },
];

function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }) {
    return (
        <>
            <aside
                className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""} ${mobileOpen ? styles.sidebarOpen : ""}`}
            >
                <div className={styles.sidebarHeader}>
                    <button
                        type="button"
                        className={styles.sidebarToggle}
                        onClick={onToggleCollapsed}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
                    </button>
                    <button
                        type="button"
                        className={styles.sidebarCloseMobile}
                        onClick={onCloseMobile}
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={label}
                            to={to}
                            className={({ isActive }) =>
                                `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
                            }
                        >
                            <Icon size={18} />
                            <span className={styles.sidebarLabel}>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {mobileOpen ? (
                <button
                    type="button"
                    className={styles.sidebarBackdrop}
                    onClick={onCloseMobile}
                    aria-label="Close sidebar backdrop"
                />
            ) : null}
        </>
    );
}

export default Sidebar;