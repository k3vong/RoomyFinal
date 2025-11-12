import React from 'react';
import './Roomy-landing.css';
import { useNavigate } from 'react-router-dom';

export default function RoomyLanding() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          Roomy
        </div>
        <div className="nav-buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="signup-btn" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            ROOMY
          </h1>
          <p className="hero-subtitle">
            Prototype
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn chores-btn" onClick={() => navigate('/login')}>
            JOIN APARTMENT
          </button>
          <button className="action-btn payments-btn" onClick={() => navigate('/register')}>
            CREATE APARTMENT
          </button>
        </div>

        {/* Feature Cards */}
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <span>🚪</span>
            </div>
            <h3 className="feature-title">Join Apartment</h3>
            <p className="feature-description">
              Connect with your roommates
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <span>🏠</span>
            </div>
            <h3 className="feature-title">Create Apartment</h3>
            <p className="feature-description">
              Set up your new space
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}