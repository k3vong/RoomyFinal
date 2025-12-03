import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomyLanding.css';

export default function RoomyLanding() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🏠',
      title: 'Apartment Management',
      description: 'Create or join apartments and manage your shared living space effortlessly.'
    },
    {
      icon: '💰',
      title: 'Rent Tracking',
      description: 'Track rent payments, split costs, and never miss a due date again.'
    },
    {
      icon: '✅',
      title: 'Chore Management',
      description: 'Organize household tasks and keep everyone accountable with recurring chores.'
    },
    {
      icon: '🛒',
      title: 'Shared Grocery Lists',
      description: 'Coordinate shopping with your roommates using shared grocery lists.'
    },
    {
      icon: '👥',
      title: 'Roommate Directory',
      description: 'Stay connected with your roommates and see everyone\'s availability status.'
    },
    {
      icon: '📊',
      title: 'Expense Calculator',
      description: 'Calculate and split expenses fairly among all roommates.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <nav className="hero-nav">
          <div className="hero-logo">
            <span className="hero-logo-icon">🏠</span>
            <span className="hero-logo-text">Roomy</span>
          </div>
          <div className="hero-nav-buttons">
            <button className="hero-btn-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="hero-btn-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon">✨</span>
            Simplify Roommate Living
          </div>
          <h1 className="hero-title">
            Manage Your Shared Living Space with Ease
          </h1>
          <p className="hero-description">
            Roomy is the all-in-one platform for roommates to coordinate rent, chores, 
            groceries, and more. Say goodbye to awkward money conversations and messy shared spaces.
          </p>
          <div className="hero-cta-buttons">
            <button 
              className="hero-cta-primary" 
              onClick={() => navigate('/register')}
            >
              Create Free Account
            </button>
            <button 
              className="hero-cta-secondary" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <div className="hero-card-icon">💰</div>
            <div className="hero-card-text">Rent Due: $1,200</div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="hero-card-icon">✅</div>
            <div className="hero-card-text">3 Chores Completed</div>
          </div>
          <div className="hero-card hero-card-3">
            <div className="hero-card-icon">🛒</div>
            <div className="hero-card-text">5 Items on List</div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Everything You Need to Live Together</h2>
          <p className="features-subtitle">
            Powerful features designed to make shared living harmonious and stress-free
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Get started in three simple steps</p>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Create or Join</h3>
            <p className="step-description">
              Set up a new apartment or join an existing one using an apartment code.
            </p>
          </div>

          <div className="step-divider">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Add Roommates</h3>
            <p className="step-description">
              Invite your roommates to join and start collaborating on household tasks.
            </p>
          </div>

          <div className="step-divider">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Stay Organized</h3>
            <p className="step-description">
              Track rent, assign chores, share groceries, and keep everyone in sync.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Shared Living?</h2>
          <p className="cta-description">
            Join thousands of roommates already using Roomy to simplify their lives.
          </p>
          <button 
            className="cta-button" 
            onClick={() => navigate('/register')}
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo-icon">🏠</span>
            <span className="footer-logo-text">Roomy</span>
          </div>
          <p className="footer-text">
            © 2025 Roomy. Making shared living simple and stress-free.
          </p>
        </div>
      </footer>
    </div>
  );
}