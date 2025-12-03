import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ 
  currentUser,
  onLogout,
  hideNav = false
}) => {
  const navigate = useNavigate();

  if (hideNav) return null;

  return (
    <nav className="main-nav" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <div 
          className="nav-logo" 
          onClick={() => navigate(currentUser ? '/dashboard' : '/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(currentUser ? '/dashboard' : '/');
            }
          }}
          aria-label="Roomy home"
        >
          <span className="logo-icon" aria-hidden="true">🏠</span>
          <span className="logo-text">Roomy</span>
        </div>

        {currentUser ? (
          <div className="nav-menu" role="menubar">
            <button 
              className="nav-link"
              onClick={() => navigate('/dashboard')}
              aria-label="Go to Dashboard"
            >
              Dashboard
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/apartments')}
              aria-label="Go to Apartments"
            >
              Apartments
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/roommates')}
              aria-label="Go to Roommates"
            >
              Roommates
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/chores')}
              aria-label="Go to Chores"
            >
              Chores
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/payments')}
            >
              Payments
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/groceries')}
            >
              Groceries
            </button>
            <div className="nav-divider"></div>
            <button 
              className="nav-link nav-link-secondary"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
            <button 
              className="nav-button nav-button-logout"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-menu">
            <button 
              className="nav-button nav-button-secondary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="nav-button nav-button-primary"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
