import { useState } from "react";
import { app } from "../firebase";
import "../../assets/css/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../contexts/FirebaseProvider";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { loginUserService } from "../apis/services/auth.service";

const auth = getAuth(app);

function Login() {
    const firebaseContext = useFirebase();
    const [data, setData] = useState({ email: "" , password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(null);
    const navigate = useNavigate();

    function handleChange(e) 
    {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    // Login from  mongoose database
    async function handleSubmit(e) {
        e.preventDefault();
        setIsError(null);
        try {
            setIsSubmitting(true);
            const payload = {
                email: data.email,
                password: data.password,
            };
            const response = await loginUserService(payload);
            console.log("Login success:", response);
            navigate("/");
        } catch (error) {
            console.log("Login error:", error);
            setIsError(error.message || "Login failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    // FIreBASE NORMAL LOGIN
    // async function handleSubmit(e) {
    //     e.preventDefault();

    //     try {
    //         setIsSubmitting(true);
    //         setIsError(null);

    //         const userCredential = await signInWithEmailAndPassword(
    //             auth,
    //             data.email,
    //             data.password
    //         );

    //         console.log("Firebase user:", userCredential.user);
    //         navigate("/");
    //     } catch (error) {
    //         console.log(error);

    //         if (error.code === "auth/invalid-credential") {
    //             setIsError("Invalid email or password.");
    //         } else if (error.code === "auth/user-not-found") {
    //             setIsError("No account found with this email.");
    //         } else if (error.code === "auth/wrong-password") {
    //             setIsError("Incorrect password.");
    //         } else {
    //             setIsError("Something went wrong. Try again.");
    //         }
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // }

    async function handleGoogleLogIn() {
        setIsError(null);
        try {
            setIsSubmitting(true);

            const result = await firebaseContext.signUpWithGoogle();
            // Store Google user in DB
            const user = result.user;
            // console.log(user);
            await firebaseContext.putData("users/" + user.uid, {
                name: user.displayName,
                email: user.email,
            });
            navigate("/");
        } catch (error) {
            console.log("Google Login error:", error);
            setIsError(error.message || "Google Login failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card auth-card--login">
                {/* LEFT SIDE */}
                <div className="auth-left">
                    <h1 className="brand-title">ReactEcom</h1>
                    <p className="brand-tagline">
                        Welcome back! Login to continue shopping with exclusive
                        offers.
                    </p>

                    <button
                        type="button"
                        className="btn google-btn"
                        onClick={handleGoogleLogIn}
                    >
                        <img
                            src="https://developers.google.com/identity/images/g-logo.png"
                            alt="Google Logo"
                            className="google-img"
                        />
                        <span>Sign in with Google</span>
                    </button>

                    <p className="auth-note">
                        New here?{" "}
                        <Link to="/register" className="link-primary">
                            Register here
                        </Link>
                    </p>
                </div>

                {/* CENTER VERTICAL OR */}
                <div className="auth-or-center">
                    <div className="auth-or-line" />
                    <span className="auth-or-text">OR</span>
                    <div className="auth-or-line" />
                </div>

                {/* RIGHT SIDE */}
                <div className="auth-right">
                    <h2 className="form-title">Login to your account</h2>
                    <p className="form-subtitle">
                        Fill in your credentials to access your account.
                    </p>

                    {isError && <p className="error-text">{isError}</p>}

                    <div className="form-wrapper">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    placeholder="Enter email"
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn primary-btn ${
                                    isSubmitting ? "inProcess" : ""
                                }`}
                            >
                                {" "}
                                {isSubmitting ? "Logging in..." : "Login"}{" "}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
