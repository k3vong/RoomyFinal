import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function EmailSent() {
  const location = useLocation();
  const email = location.state?.email || "(unknown)";

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      textAlign: "center",
      padding: "0 20px"
    }}>
      <h2>Email Sent!</h2>
      <p>We sent the password reset link to:</p>
      <strong>{email}</strong>
      <p style={{ marginTop: "20px" }}>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
}
