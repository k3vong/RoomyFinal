import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/login', { 
        username, 
        password 
      });
      const user = response.data;

      if (!user || !user.userId) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo" onClick={() => navigate('/')}>
            <span className="login-logo-icon">🏠</span>
            <span className="login-logo-text">Roomy</span>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

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
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
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
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="login-footer">
            <p className="footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="signup-link">
                Sign up for free
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="login-visual">
        <div className="visual-content">
          <h2 className="visual-title">Simplify Shared Living</h2>
          <p className="visual-description">
            Manage rent, chores, groceries, and more with your roommates in one place.
          </p>
          <div className="visual-features">
            <div className="visual-feature">
              <span className="visual-feature-icon">✓</span>
              <span className="visual-feature-text">Track rent payments</span>
            </div>
            <div className="visual-feature">
              <span className="visual-feature-icon">✓</span>
              <span className="visual-feature-text">Organize chores</span>
            </div>
            <div className="visual-feature">
              <span className="visual-feature-icon">✓</span>
              <span className="visual-feature-text">Share grocery lists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
