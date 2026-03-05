import styles from '../assets/css/adminLogin.module.css';

function AdminLogin() {
	return (
		<div className={styles.adminLoginPage}>
			<div className={styles.loginCard}>
				<div className={styles.brand}>
					<div className={styles.logo}>E</div>
					<h1>eComForAll</h1>
				</div>

				<h2 className={styles.cardTitle}>Admin Panel Sign In</h2>

				<form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
				<div className={styles.inputGroup}>
						<label htmlFor="email">Email</label>
						<input id="email" type="email" placeholder="admin@yourecom.com" required />
					</div>

				<div className={styles.inputGroup}>
						<label htmlFor="password">Password</label>
						<input id="password" type="password" placeholder="Enter your password" required />
					</div>

					<div className={styles.formRow}>
						<label className={styles.remember}>
							<input type="checkbox" /> Remember me
						</label>
						<a className={styles.forgot} href="#">Forgot?</a>
					</div>

					<button className={styles.btnSubmit} type="submit">Sign In</button>
				</form>

				<p className={styles.note}>Only authorized personnel may access this panel.</p>
			</div>
		</div>
	);
}

export default AdminLogin;
