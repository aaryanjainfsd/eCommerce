import { useState } from "react";
import "../../assets/css/register.css";
import { Link, useNavigate } from "react-router-dom";

import { useFirebase } from "../contexts/FirebaseProvider";

function Register() {
    const firebaseContext = useFirebase();

    const [data, setData] = useState({
        name: "",
        username: "",
        phone: "",
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(null);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try 
        {
            setIsSubmitting(true);

            const cred = await firebaseContext.createUserInFirebase( data.email, data.password );
            const uid = cred.user.uid;
            const profile = {
                name: data.name,
                username: data.username,
                phone: data.phone,
                email: data.email,
            };
            await firebaseContext.insert_db_fireStore_userData( uid, profile );
            navigate("/");
        } catch (error) 
        {
            console.log("Registration error:", error);
            setIsError(error.message || "Registration failed");
        }
        finally 
        {
            setIsSubmitting(false);
        }
    }

    async function handleGoogleSignUp() {
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
                phone: data.phone,
            });

            navigate("/"); // user is already logged in
        } catch (error) {
            console.log(error);
            setIsError(error.message || "Google signup failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* LEFT SIDE */}
                <div className="auth-left">
                    <h1 className="brand-title">Sign Up</h1>
                    <p className="brand-tagline">
                        Create your account and start shopping with exclusive
                        offers.
                    </p>

                    <button
                        type="button"
                        className="btn google-btn"
                        onClick={handleGoogleSignUp}
                        disabled={isSubmitting}
                    >
                        <img
                            src="https://developers.google.com/identity/images/g-logo.png"
                            alt="Google Logo"
                            className="google-img"
                        />
                        <span>Sign up with Google</span>
                    </button>

                    <p className="auth-note">
                        Already registered?{" "}
                        <Link to="/login" className="link-primary">
                            Login here
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
                    <h2 className="form-title">Create your account</h2>
                    <p className="form-subtitle">
                        Fill in the details below to get started.
                    </p>

                    {isError && <p className="error-text">{isError}</p>}

                    <div className="form-wrapper">
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        name="name"
                                        id="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Username"
                                        name="username"
                                        id="username"
                                        value={data.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter Phone"
                                        name="phone"
                                        id="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        name="email"
                                        id="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn primary-btn ${
                                    isSubmitting ? "inProcess" : ""
                                }`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registering..." : "Register"}
                            </button>
                        </form>

                        <p className="terms-text">
                            By continuing, you agree to our{" "}
                            <span>Terms of Service</span> and{" "}
                            <span>Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
