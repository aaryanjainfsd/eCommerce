
// IMPORTS
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

// CSS IMPORT 
import styles from "../assets/css/superAdminLogin.module.css";

// API IMPORT 
import { SuperAdminLoginAPI } from "../api/services/superAdminAuth.jsx";

// ZUSTAND STORE IMPORT 
import useSuperAdminAuthStore from "../stores/SuperAdminAuthStore.jsx";




function SuperAdminLogin()
{
    const [data, setData] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const { setUser } = useSuperAdminAuthStore();


    function handleChange(event)
    {
        const { name, value } = event.target;
        setData((previousValue) => ({ ...previousValue, [name]: value }));
    }

    async function handleSubmit(event)
    {
        event.preventDefault();
        setErrorMessage("");
        try
        {
            const response = await SuperAdminLoginAPI(data);
            setUser({
                name: response.data.user.name,
                username: response.data.user.username,
                role: response.data.user.role
            })
            navigate("/superAdminPanel/clients");
        }
        catch (error)
        {
            const msg = error?.message || "Login failed. Please try again.";
            setErrorMessage(msg);
        }
    }

    return (
        <section className={styles.pageWrap}>
            <div className={styles.contentGrid}>
                <article className={styles.infoPanel}>
                    <p className={styles.eyebrow}>Super Admin Access</p>
                    <h1 className={styles.mainTitle}>Client Operations Control Desk</h1>
                    

                    <div className={styles.highlights}>
                        <div className={styles.highlightCard}>
                            <ShieldCheck size={18} />
                            <div>
                                <p className={styles.highlightTitle}>Restricted Access</p>
                                <p className={styles.highlightText}>This login is reserved for super admin operations only.</p>
                            </div>
                        </div>

                        
                    </div>
                </article>

                <article className={styles.formCard}>
                    <div className={styles.brandRow}>
                        <span className={styles.brandBadge}>SA</span>
                        <div>
                            <h2 className={styles.formTitle}>Sign In</h2>
                            <p className={styles.formSubtitle}>Authenticate to continue to the super admin dashboard</p>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className={styles.warningBanner}>
                            {errorMessage}
                        </div>
                    )}

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <label className={styles.inputGroup} htmlFor="username">
                            Username
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter your admin username"
                                value={data.username}
                                onChange={handleChange}
                                autoComplete="username"
                                required
                            />
                        </label>

                        <label className={styles.inputGroup} htmlFor="password">
                            Password
                            <input id="password" name="password" type="password" placeholder="Enter your secure password" value={data.password} onChange={handleChange} autoComplete="current-password" required />
                        </label>

                        <div className={styles.formMeta}>
                            <label className={styles.rememberWrap}>
                                <input type="checkbox" />
                                Remember this device
                            </label>
                            <button type="button" className={styles.linkButton}>Need help?</button>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            <LockKeyhole size={16} />
                            Secure Login
                        </button>
                    </form>

                    <p className={styles.footerNote}>
                        Protected environment • Super admin only • All actions are monitored
                    </p>
                </article>
            </div>
        </section>
    );
}

export default SuperAdminLogin;