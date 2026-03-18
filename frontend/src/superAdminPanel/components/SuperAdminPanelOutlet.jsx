import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import styles from "../assets/css/layout.module.css";
import useSuperAdminAuthStore from "../stores/SuperAdminAuthStore";

function SuperAdminPanelOutlet()
{
    const location = useLocation();
    const urlAddress = location.pathname;
    const normalizedPath = urlAddress.replace(/\/+$/, "") || "/";
    const isLoginPage = normalizedPath === "/superAdminPanel";
    const { isLoggedIn } = useSuperAdminAuthStore();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    function handleToggleSidebar() {
        if (window.innerWidth <= 900) {
            setIsMobileSidebarOpen((previousValue) => !previousValue);
            return;
        }

        setIsSidebarCollapsed((previousValue) => !previousValue);
    }

    function handleCloseMobileSidebar() {
        setIsMobileSidebarOpen(false);
    }

    if (isLoginPage && isLoggedIn) {
        return <Navigate to="/superAdminPanel/clients" replace />;
    }

    return (
        isLoginPage ? ( <Outlet /> ) : (
            <div className={styles.shell}>
                <Sidebar isCollapsed={isSidebarCollapsed} isMobileOpen={isMobileSidebarOpen} onToggleCollapse={handleToggleSidebar} onCloseMobile={handleCloseMobileSidebar} />

                <div className={`${styles.mainPanel} ${isSidebarCollapsed ? styles.withCollapsedSidebar : ''}`}>
                    <Header />
                    <main className={styles.outletWrap}>
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        )
    )
}
export default SuperAdminPanelOutlet;