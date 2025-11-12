import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Roommates.css';

export default function Roommates() {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userApartmentId, setUserApartmentId] = useState(null);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUserApartmentAndRoommates();
  }, []);

  const fetchUserApartmentAndRoommates = async () => {
    try {
      // Get user's apartment
      const aptResponse = await axios.get(
        `http://localhost:8080/api/residence/user/${user.userId}`
      );
      const apartmentId = aptResponse.data;
      
      if (apartmentId) {
        setUserApartmentId(apartmentId);
        // Fetch roommates for that apartment
        const roommatesResponse = await axios.get(
          `http://localhost:8080/api/residence/${apartmentId}`
        );
        setRoommates(roommatesResponse.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roommates:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="roommates-container">
        <div className="loading">Loading roommates...</div>
      </div>
    );
  }

  if (!userApartmentId) {
    return (
      <div className="roommates-container">
        <nav className="roommates-nav">
          <div className="logo" onClick={() => navigate('/search')}>Roomy</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
        <div className="no-apartment-state">
          <div className="empty-icon">🏠</div>
          <h2>No Apartment Found</h2>
          <p>You need to join an apartment before you can see roommates.</p>
          <button 
            className="primary-btn"
            onClick={() => navigate('/apartments')}
          >
            Find an Apartment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="roommates-container">
      {/* Navigation Bar */}
      <nav className="roommates-nav">
        <div className="logo" onClick={() => navigate('/search')}>Roomy</div>
        <div className="nav-actions">
          <button className="back-btn" onClick={() => navigate('/search')}>
            ← Back to Dashboard
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="roommates-content">
        <div className="roommates-header">
          <h1>Your Roommates</h1>
          <p>People living in your apartment</p>
        </div>

        {/* Roommates Grid */}
        <div className="roommates-grid">
          {roommates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No roommates yet</h3>
              <p>Invite people to join your apartment!</p>
            </div>
          ) : (
            roommates.map((roommate) => (
              <div key={roommate.userId} className="roommate-card">
                <div className="roommate-avatar">
                  {roommate.firstName?.charAt(0)}{roommate.lastName?.charAt(0)}
                </div>
                <div className="roommate-info">
                  <h3>{roommate.firstName} {roommate.lastName}</h3>
                  <p className="roommate-username">@{roommate.username}</p>
                  <p className="roommate-email">{roommate.email}</p>
                  <p className="roommate-joined">
                    Joined {new Date(roommate.joinDate).toLocaleDateString()}
                  </p>
                  {roommate.userId === user.userId && (
                    <span className="you-badge">You</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Card */}
        <div className="info-card">
          <h3>💡 Want to invite roommates?</h3>
          <p>Share your apartment details with friends so they can join!</p>
          <div className="apartment-id-display">
            <strong>Apartment ID:</strong> {userApartmentId}
          </div>
        </div>
      </div>
    </div>
  );
}