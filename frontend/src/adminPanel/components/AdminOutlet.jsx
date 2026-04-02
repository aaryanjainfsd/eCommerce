import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from '../assets/css/header.module.css';
import useAdminAuthStore from "../stores/adminAuthStore";

function AdminOutlet() {
    const location = useLocation();
    const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
    const isLogin = normalizedPath === "/adminPanel";
    const { isLoggedIn } = useAdminAuthStore();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    if (isLogin && isLoggedIn) {
        return <Navigate to="/adminPanel/dashboard" replace />;
    }

    return (
        <div className={styles.container}>
            {isLogin ? null : (
                <Header onMobileMenuToggle={() => setIsMobileSidebarOpen((prev) => !prev)} />
            )}

            {isLogin ? null : (
                <Sidebar
                    collapsed={isSidebarCollapsed}
                    onToggleCollapsed={() => setIsSidebarCollapsed((prev) => !prev)}
                    mobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />
            )}

            <main className={`${styles.content} ${ isLogin ? styles.contentLogin : isSidebarCollapsed ? styles.contentWithCollapsedSidebar : styles.contentWithSidebar }`} >
                <Outlet />
            </main>
        </div>
    );
}

export default AdminOutlet;