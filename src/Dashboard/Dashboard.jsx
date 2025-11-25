import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserApartment();
  }, []);

  const fetchUserApartment = async () => {
    try {
      const aptResponse = await axios.get(
        `http://localhost:8080/api/residence/user/${user.userId}`
      );
      const apartmentId = aptResponse.data;
      
      if (apartmentId) {
        setUserApartmentId(apartmentId);

        const detailsResponse = await axios.get(
          `http://localhost:8080/api/apartments/${apartmentId}`
        );
        setApartment(detailsResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching apartment:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="logo">Roomy</div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome, {user.firstName} {user.lastName}! 👋</h1>

        <div className="user-info">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.status || 'N/A'}</p>
          {user.customStatus && <p><strong>Custom Status:</strong> {user.customStatus}</p>}
        </div>

        <div className="dashboard-main">
          {loading ? (
            <p>Loading...</p>
          ) : !userApartmentId ? (
            <div className="no-apartment-message">
              <h2>You haven't joined an apartment yet</h2>
              <button className="primary-btn" onClick={() => navigate('/apartments')}>
                Find or Create an Apartment
              </button>
            </div>
          ) : (
            <div className="apartment-main-card">
              <div className="apartment-header" onClick={() => setShowOptions(!showOptions)}>
                <div className="apartment-info">
                  <h2>🏠 My Apartment</h2>
                  {apartment && (
                    <div className="apartment-details-inline">
                      <p>{apartment.complexName}</p>
                      {apartment.roomNumber && <p>Room {apartment.roomNumber}</p>}
                    </div>
                  )}
                </div>
                <button className="expand-btn">{showOptions ? '▼' : '▶'}</button>
              </div>

              {showOptions && (
                <div className="apartment-options">
                  <div className="option-card" onClick={() => navigate('/chores')}>
                    <div className="option-icon">✓</div>
                    <h3>Chores</h3>
                    <p>Track and assign household chores</p>
                  </div>

                  <div className="option-card" onClick={() => navigate('/payments')}>
                    <div className="option-icon">💰</div>
                    <h3>Payments</h3>
                    <p>Manage rent and bill splitting</p>
                  </div>

                  <div className="option-card" onClick={() => navigate('/roommates')}>
                    <div className="option-icon">👥</div>
                    <h3>Roommates</h3>
                    <p>View and invite roommates</p>
                  </div>

                  <div className="option-card" onClick={() => navigate('/apartments')}>
                    <div className="option-icon">⚙️</div>
                    <h3>Settings</h3>
                    <p>Manage apartment details</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


