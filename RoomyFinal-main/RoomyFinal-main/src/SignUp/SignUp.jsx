import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      console.log('Sign up successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="signup-logo" onClick={() => navigate('/')}>
            <span className="signup-logo-icon">🏠</span>
            <span className="signup-logo-text">Roomy</span>
          </div>
          <h1 className="signup-title">Create Your Account</h1>
          <p className="signup-subtitle">Start managing your shared living space today</p>
        </div>

        <form onSubmit={handleSignUp} className="signup-form">
          {error && (
            <div className="signup-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaUser />
                </span>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  className="form-input"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaUser />
                </span>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                id="username"
                type="text"
                name="username"
                className="form-input"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <FaEnvelope />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                minLength="6"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="signup-footer">
            <p className="footer-text">
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="signup-visual">
        <div className="visual-content">
          <h2 className="visual-title">Join Roomy Today</h2>
          <p className="visual-description">
            Experience hassle-free roommate management with our comprehensive platform.
          </p>
          <div className="visual-stats">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Apartments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Free to Use</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;