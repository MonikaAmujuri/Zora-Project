import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invalid credentials");
                return;
            }

            console.log("LOGIN RESPONSE:", data); // 🔍 DEBUG

            // 🔥 MUST exist
            if (!data.token) {
                console.error("Token missing from backend!");
                return;
            }

            // 🔥 STORE TOKEN
            localStorage.setItem("token", data.token);

            login(data);

            navigate("/", { replace: true });

        } catch (err) {
            console.error(err);
            setError("Server error. Please try again.");
        }
    };
    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="brand">ZORA</h1>
                <p className="subtitle">Welcome back 👋</p>

                <h2>Login</h2>

                {error && <p className="error">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p className="forgot-link">
                    <Link to="/forgot-password">Forgot password?</Link>
                </p>


                <button type="submit">Login</button>
                <p className="switch-auth">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>

            </form>
        </div>
    );
}

export default Login;  