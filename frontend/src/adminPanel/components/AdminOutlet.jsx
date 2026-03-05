import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from '../assets/css/header.module.css';

import { useLocation } from "react-router-dom";

function AdminOutlet() {
    const location = useLocation();
	// don't show header/footer on login page
	const isLogin = location.pathname === "/admin";

	return (
		<div className={styles.container}>
			{!isLogin && <Header />}
			<main className={styles.content}>
				<Outlet />
			</main>
			{!isLogin && <Footer />}
		</div>
	);
}

export default AdminOutlet;