import { useState } from "react";
import instance from "../routes/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import "../../assets/css/login.css";

import { app } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);

function Login() {
    const signInUser = () => {
        signInWithEmailAndPassword(auth, "email", "password")
            .then((value) => {
                console.log(value);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [data, setData] = useState({
        username: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(null);
    const navigate = useNavigate();
    const { checkUserLoggedIn } = useAuth();

    function handleChange(e) {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            const userCredential = await signInWithEmailAndPassword(
                auth,
                data.username, // treat as email
                data.password
            );

            console.log("Firebase user:", userCredential);
            console.log("Firebase user object:", userCredential.user);

            const response = await instance.post("/auth/login", data, {
                withCredentials: true,
            });

            if (response.status === 200) {
                localStorage.setItem(
                    "userData",
                    JSON.stringify(response.data.user)
                );
                const result = await checkUserLoggedIn(response);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            setIsError(error.message);
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
					Welcome back! Login to continue shopping with exclusive offers.
				</p>

				<button
					type="button"
					className="btn google-btn"
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
							<label htmlFor="username">Email</label>
							<input
								type="text"
								placeholder="Enter email"
								name="username"
								id="username"
								value={data.username}
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
							className={`btn primary-btn ${isSubmitting ? "inProcess" : ""}`}
						>
							{isSubmitting ? "Logging in..." : "Login"}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
);


}

export default Login;
