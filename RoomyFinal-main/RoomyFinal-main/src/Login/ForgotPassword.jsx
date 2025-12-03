import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Input } from "../components/Input";
import Card from "../components/Card";
import "./ForgotPassword.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        // Basic email validation BEFORE sending to backend
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            setLoading(false);
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
        } catch {
            setMessage("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">
            <div className="forgot-container">
                <Card className="forgot-card">
                    <div className="forgot-header">
                        <div className="forgot-icon">🔑</div>
                        <h1>Forgot Password</h1>
                        <p>Enter your email address and we'll send you a link to reset your password.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="forgot-form">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            icon="📧"
                        />

                        <Button type="submit" variant="primary" fullWidth disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        {message && <div className="info-msg">{message}</div>}
                    </form>

                    <div className="forgot-footer">
                        <Button variant="ghost" onClick={() => navigate('/login')}>
                            ← Back to Login
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
