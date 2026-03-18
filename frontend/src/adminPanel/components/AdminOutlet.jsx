import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from '../assets/css/header.module.css';
import useAdminAuthStore from "../stores/adminAuthStore";

function AdminOutlet() {
    const location = useLocation();
    const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
    const isLogin = normalizedPath === "/adminPanel";
    const { isLoggedIn } = useAdminAuthStore();

    if (isLogin && isLoggedIn) {
        return <Navigate to="/adminPanel/dashboard" replace />;
    }

    return (
        <div className={styles.container}>
            {isLogin ? null : <Header />}
            <main className={styles.content}>
                <Outlet />
            </main>
            {isLogin ? null : <Footer />}
        </div>
    );
}

export default AdminOutlet;