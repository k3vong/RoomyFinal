import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
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
      <>
        <Navigation currentUser={user} onLogout={handleLogout} />
        <PageLayout>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading roommates...</p>
          </div>
        </PageLayout>
      </>
    );
  }

  if (!userApartmentId) {
    return (
      <>
        <Navigation currentUser={user} onLogout={handleLogout} />
        <PageLayout title="No Apartment">
          <Card className="empty-state-card">
            <div className="empty-state-content">
              <div className="empty-state-icon">🏠</div>
              <h2>No Apartment Found</h2>
              <p>You need to join an apartment before you can see roommates.</p>
              <Button variant="primary" size="lg" onClick={() => navigate('/apartments')}>
                Find an Apartment
              </Button>
            </div>
          </Card>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Navigation currentUser={user} onLogout={handleLogout} />
      <PageLayout
        title="Your Roommates"
        subtitle={`${roommates.length} member${roommates.length !== 1 ? 's' : ''} in your apartment`}
        actions={
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        }
      >
        {roommates.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state-content">
              <div className="empty-state-icon">👥</div>
              <h3>No Roommates Yet</h3>
              <p>Invite people to join your apartment!</p>
            </div>
          </Card>
        ) : (
          <div className="roommates-grid">
            {roommates.map((roommate) => (
              <Card key={roommate.userId} className="roommate-card" hover>
                <div className="roommate-avatar">
                  {roommate.firstName?.charAt(0)}{roommate.lastName?.charAt(0)}
                </div>
                <div className="roommate-info">
                  <h3>{roommate.firstName} {roommate.lastName}</h3>
                  {roommate.userId === user.userId && (
                    <span className="you-badge">You</span>
                  )}
                  <p className="roommate-username">@{roommate.username}</p>
                  <p className="roommate-email">{roommate.email}</p>
                  <div className="roommate-status">
                    <span className={`status-badge status-${roommate.status?.toLowerCase() || 'available'}`}>
                      {roommate.status || 'AVAILABLE'}
                    </span>
                    {roommate.customStatus && (
                      <span className="custom-status-text">"{roommate.customStatus}"</span>
                    )}
                  </div>
                  {roommate.joinDate && (
                    <p className="roommate-joined">
                      Joined {new Date(roommate.joinDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="info-card">
          <h3>💡 Invite Roommates</h3>
          <p>Share your apartment details with friends so they can join!</p>
          {userApartmentId && (
            <div className="apartment-id-display">
              <strong>Apartment ID:</strong> <code>{userApartmentId}</code>
            </div>
          )}
        </Card>
      </PageLayout>
    </>
  );
}