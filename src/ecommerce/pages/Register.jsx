import { useState } from "react";
import instance from "../routes/axiosConfig";
import { Link, useNavigate } from "react-router-dom";

import "../../assets/css/register.css";

function Register() {
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
        try {
            setIsSubmitting(true);
            const response = await instance.post("/auth/register", data);
            if (
                response.status === 201 &&
                response.message === "Data added successfully"
            ) {
                navigate("/login?registered=1");
            }
        } catch (error) {
            console.log(error);
            setIsError(error.message);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="centre">
        <div className="form-container">
            {isError && <p>{isError}</p>}
            <h2>Register into Ecommerce</h2>
            <div className="form-wrapper">
                <form action="" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={handleChange}
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
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="text"
                            placeholder="Enter Phone"
                            name="phone"
                            id="phone"
                            value={data.phone}
                            onChange={handleChange}
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

                    <div className="form-group">
                        <button
                            type="submit"
                            className={isSubmitting ? "inProcess" : ""}
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
                <p>
                    Already Registered? <Link to="/login">Login Here</Link>
                </p>
            </div>
        </div>
        </div>
    );
}

export default Register;
