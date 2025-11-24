import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // clear old messages

        // Basic email validation BEFORE sending to backend
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                // Email exists → move to next page
                navigate("/emailsent", { state: { email } });
            } else {
                // Email does NOT exist → show backend message
                setMessage(data.message || "Email not found.");
            }
        } catch (error) {
            setMessage("Server error. Try again later.");
        }
    };

    return (
        <div className="forgot-page">
            <div className="wrapper">
                <h1>Forgot Password</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit">Send Reset Link</button>

                    {message && <p className="info-msg">{message}</p>}
                </form>
            </div>
        </div>
    );
}
