import { useEffect, useState, useCallback, useRef } from "react";
import styles from '../assets/css/adminLogin.module.css';
import { useNavigate } from "react-router-dom";
import useAdminAuthStore from "../stores/adminAuthStore";
import { loginUserAPI, verifyUsernameAPI } from "../apis/services/adminAuth";

function AdminLogin() {
    // Form data state
    const [data, setData] = useState({ username: "", password: "" });
    
    // Username validation state
    const [usernameStatus, setUsernameStatus] = useState(null); // null, 'validating', 'verified', 'invalid'
    const [userInfo, setUserInfo] = useState(null); // Stores verified user info
    
    // Login submission state
    const [isError, setIsError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Debounce timer reference for username validation
    const debounceTimerRef = useRef(null);
    
    const navigate = useNavigate();
    const { setUser } = useAdminAuthStore();

    

    /**
     * Debounced username validation function
     * Validates username after user stops typing for 500ms
     * Shows real-time feedback: "Oops, not our partner" or "Hello [name], verified"
     */
    const validateUsername = useCallback(async (username) => {
        // Clear existing timer if any
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Don't validate empty username
        if (!username.trim()) {
            setUsernameStatus(null);
            setUserInfo(null);
            return;
        }

        // Set loading state
        setUsernameStatus('validating');
        setIsError(null);

        // Debounce the API call by 500ms
        debounceTimerRef.current = setTimeout(async () => {
            try {
                // Call API to verify username exists
                const response = await verifyUsernameAPI(username);
                
                // Username verified - store user info and show success state
                setUserInfo(response.data.user);
                setUsernameStatus('verified');
            }
            catch (error) {
                // Username not found or error occurred - show error state
                setUserInfo(null);
                setUsernameStatus('invalid');
                // Don't set general error yet, only show in feedback section
            }
        }, 500);
    }, []);

    /**
     * Handle username input change
     * Triggers real-time validation as user types
     */
    function handleChange(e) {
        const { name, value } = e.target;
        
        // Update form data
        setData({ ...data, [name]: value });

        // If username field changed, validate it
        if (name === 'username') {
            validateUsername(value);
        }
    } 

    /**
     * Handle login form submission
     * Only enabled after username is verified
     * Validates credentials and authenticates user
     */
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Prevent submission if username not verified
        if (usernameStatus !== 'verified') {
            setIsError('Please verify your username first');
            return;
        }

        setIsSubmitting(true);
        setIsError(null);

        try 
        {
            const response = await loginUserAPI(data);
            setUser({
                username: response.data.user.username,
                role: response.data.user.role
            });
            navigate("/admin/dashboard");
        }
        catch (error) {
            const msg = error?.response?.data?.message || "Login failed. Your secret credentials are incorrect.";
            setIsError(msg);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    /**
     * Determine if password field should be enabled
     * Only enabled after username is verified
     */
    const isPasswordEnabled = usernameStatus === 'verified';

    /**
     * Get feedback message and styling based on username validation state
     */
    const getFeedbackContent = () => {
        if (usernameStatus === 'validating') {
            return {
                type: 'validating',
                message: 'Verifying your identity...',
                icon: '⏳'
            };
        }
        
        if (usernameStatus === 'invalid') {
            return {
                type: 'error',
                message: 'Oops! You are not our partner yet. Please contact support.',
                icon: '❌'
            };
        }
        
        if (usernameStatus === 'verified' && userInfo) {
            return {
                type: 'success',
                message: `Hello ${userInfo.username}, username verified! Please enter your secret credentials to get in.`,
                icon: '✅'
            };
        }
        
        return null;
    };

    const feedbackContent = getFeedbackContent();

    return (
        <div className={styles.adminLoginPage}>
            {/* Top banner notification for username validation */}
            {feedbackContent && (
                <div className={`${styles.topBanner} ${styles[`banner_${feedbackContent.type}`]}`}>
                    <div className={styles.bannerContent}>
                        <span className={styles.bannerIcon}>{feedbackContent.icon}</span>
                        <p className={styles.bannerMessage}>{feedbackContent.message}</p>
                    </div>
                </div>
            )}

            {/* Decorative background elements */}
            <div className={styles.decorativeBlob} style={{ top: '10%', left: '-5%' }}></div>
            <div className={styles.decorativeBlob} style={{ bottom: '5%', right: '-8%' }}></div>

            <div className={styles.loginContainer}>
                {/* Left side - Brand and welcome message */}
                <div className={styles.welcomeSection}>
                    <div className={styles.brandLogo}>
                        <div className={styles.logo}>E</div>
                    </div>
                    <h1 className={styles.brandName}>eComForAll</h1>
                    <p className={styles.brandSubtitle}>Partner Admin Portal</p>
                    <div className={styles.brandDivider}></div>
                    <p className={styles.welcomeText}>
                        Welcome back! Secure access to your business management tools and partner dashboard.
                    </p>
                </div>

                {/* Right side - Login form card */}
                <div className={styles.loginCard}>
                    <h2 className={styles.cardTitle}>Sign In</h2>
                    <p className={styles.cardSubtitle}>Access your partner dashboard</p>

                   {/* Error message display */}
                    {isError && (
                        <div className={styles.errorAlert}>
                            <span className={styles.errorIcon}>⚠️</span>
                            <p>{isError}</p>
                        </div>
                    )} 

                    {/* Login form */}
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        {/* Username input field */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your partner username"
                                    required
                                    onChange={handleChange}
                                    name="username"
                                    value={data.username}
                                    className={`${styles.input} ${usernameStatus ? styles[`input_${usernameStatus}`] : ''}`}
                                />
                                {/* Status indicator icon */}
                                {usernameStatus && (
                                    <span className={`${styles.statusIndicator} ${styles[`indicator_${usernameStatus}`]}`}>
                                        {usernameStatus === 'validating' && '⟳'}
                                        {usernameStatus === 'verified' && '✓'}
                                        {usernameStatus === 'invalid' && '✕'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Password input field - only enabled after username verification */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={!isPasswordEnabled ? styles.labelDisabled : ''}>
                                Secret Credentials
                            </label>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder={isPasswordEnabled ? "Enter your password" : "Verify username first"}
                                    disabled={!isPasswordEnabled}
                                    onChange={handleChange}
                                    name="password"
                                    value={data.password}
                                    className={styles.input}
                                />
                            </div>
                            {!isPasswordEnabled && (
                                <p className={styles.helperText}>
                                    Verify your username to proceed
                                </p>
                            )}
                        </div>

                        

                        {/* Submit button */}
                        <button
                            className={styles.btnSubmit}
                            type="submit"
                            disabled={!isPasswordEnabled || isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Security note at bottom */}
                    <p className={styles.securityNote}>
                        🔒 Only authorized partner representatives may access this panel. All access is logged.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
