import { useEffect, useState } from "react";
import styles from '../assets/css/adminLogin.module.css';
import { useNavigate } from "react-router-dom";
import useAdminAuthStore from "../stores/adminAuthStore";
import { loginUserAPI } from "../apis/services/adminAuth";



function AdminLogin() {

    const [data, setData] = useState({ username: "" , password: "" });
    const [isError, setIsError] = useState(null);

    const navigate = useNavigate();
    const { isLoggedIn, setUser } = useAdminAuthStore();

    useEffect(() => {
        // If we are already logged in (state persisted) redirect to dashboard.
        if (isLoggedIn) {
            navigate("/admin/dashboard");
        }
    }, [isLoggedIn, navigate]);

    function handleChange(e)
    {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try
        {
            const response = await loginUserAPI(data);
            setUser({
                username: response.data.user.username,
                role: response.data.user.role
            });
            navigate("/admin/dashboard");
        }
        catch (error)
        {
            setIsError(error.response?.data?.message || "Login failed");
        }
    }


	return (
		<div className={styles.adminLoginPage}>
			<div className={styles.loginCard}>
				<div className={styles.brand}>
					<div className={styles.logo}>E</div>
					<h1>eComForAll</h1>
				</div>

				<h2 className={styles.cardTitle}>Admin Panel Sign In</h2>

				<form className={styles.loginForm} onSubmit={handleSubmit}>
				    <div className={styles.inputGroup}>
						<label htmlFor="username">Username</label>
						<input id="username" type="text" placeholder="Please enter your username." required onChange={handleChange} name="username" value={data.username} />
					</div>

				    <div className={styles.inputGroup}>
						<label htmlFor="password">Password</label>
						<input id="password" type="password" placeholder="Enter your password" required onChange={handleChange} name="password" value={data.password} />
					</div>

					<div className={styles.formRow}>
						<label className={styles.remember}>
							<input type="checkbox" /> Remember me
						</label>
						<a className={styles.forgot} href="#">Forgot?</a>
					</div>

					<button className={styles.btnSubmit} type="submit">
                        Sign In</button>
				</form>

				<p className={styles.note}>Only authorized personnel may access this panel.</p>
			</div>
		</div>
	);
}

export default AdminLogin;
