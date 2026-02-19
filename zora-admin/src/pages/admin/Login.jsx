import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate, Link} from "react-router-dom";
import { auth } from "../../firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

import "./Login.css";
import { useAdmin } from "../../context/AdminContext.jsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user, setUser } = useAdmin();
    const [loginMode, setLoginMode] = useState("password");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);

    const navigate = useNavigate();

    const location = useLocation();
    const { login } = useAdmin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
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

            if (data.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again.");
        }
    };
    
    const sendOTP = async () => {
            try {
                const recaptcha = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    { size: "invisible" }
                );
    
                const result = await signInWithPhoneNumber(
                    auth,
                    phone,
                    recaptcha
                );
    
                setConfirmationResult(result);
                alert("OTP sent successfully!");
            } catch (err) {
                console.error(err);
                alert("Failed to send OTP");
            }
        };
    const verifyOTP = async () => {
        try {
            const result = await confirmationResult.confirm(otp);
            const firebaseUser = result.user;

            const idToken = await firebaseUser.getIdToken();

            const res = await fetch("http://localhost:5000/api/auth/firebase-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Backend login failed");
                return;
            }

            if (data.role !== "admin") {
                alert("Not authorized as admin");
                return;
            }

            localStorage.setItem("adminInfo", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            login(data);

            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            console.error(err);
            alert("Invalid OTP");
        }
    };
    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="brand">ZORA</h1>
                <p className="subtitle">Welcome back 👋</p>

                <h2>Login</h2>
                {/* 🔄 Login Mode Toggle */}
                <div className="login-toggle">
                    <button
                        type="button"
                        className={loginMode === "password" ? "active" : ""}
                        onClick={() => setLoginMode("password")}
                    >
                        Password
                    </button>

                    <button
                        type="button"
                        className={loginMode === "otp" ? "active" : ""}
                        onClick={() => setLoginMode("otp")}
                    >
                        OTP
                    </button>
                </div>

                {error && <p className="error">{error}</p>}

                {/* PASSWORD LOGIN */}
                {loginMode === "password" && (
                    <>
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

                    </>
                )}
                {/* OTP LOGIN */}
                {loginMode === "otp" && (
                    <>
                        <input
                            type="text"
                            placeholder="+91XXXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            onClick={sendOTP}
                        >
                            Send OTP
                        </button>

                        {confirmationResult && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={verifyOTP}
                                >
                                    Verify OTP
                                </button>
                            </>
                        )}

                        <div id="recaptcha-container"></div>
                    </>
                )}

                <p className="switch-auth">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>

            </form>
        </div>
    );
}

export default Login;
