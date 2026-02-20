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
    const [error, setError] = useState("");
    const { user, setUser } = useAdmin();
    const [loginMode] = useState("otp");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);

    const navigate = useNavigate();

    const location = useLocation();
    const { login } = useAdmin();
    
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
            <form className="login-card">
                <h1 className="brand">ZORA</h1>
                <p className="subtitle">Welcome back 👋</p>

                <h2>Login</h2>
                
                {error && <p className="error">{error}</p>}

                {/* OTP LOGIN */}
                    <>
                        <input
                            type="text"
                            placeholder="+91XXXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        <button type="button" onClick={sendOTP}>
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

                                <button type="button" onClick={verifyOTP}>
                                    Verify OTP
                                </button>
                            </>
                        )}

                        <div id="recaptcha-container"></div>
                    </>

            </form>
        </div>
    );
}

export default Login;
