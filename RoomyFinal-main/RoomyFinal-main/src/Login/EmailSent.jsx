import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import "./ForgotPassword.css";

export default function EmailSent() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "(unknown)";

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <Card className="email-sent-card">
          <div className="email-sent-content">
            <div className="success-icon">✓</div>
            <h2>Email Sent!</h2>
            <p>We sent the password reset link to:</p>
            <div className="email-display">{email}</div>
            <p className="email-note">
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
