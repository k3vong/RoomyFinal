import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrashCan } from "react-icons/fa6";
import './Apartments.css';

export default function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    complexName: '',
    roomNumber: '',
    rentAmount: '',
    rentDueDay: 1
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/apartments');
      setApartments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/apartments', {
        complexName: formData.complexName,
        roomNumber: formData.roomNumber,
        rentAmount: parseFloat(formData.rentAmount),
        rentDueDay: parseInt(formData.rentDueDay)
      });
      alert('Apartment created successfully!');
      setShowForm(false);
      setFormData({ complexName: '', roomNumber: '', rentAmount: '', rentDueDay: 1 });
      fetchApartments();
    } catch (error) {
      console.error('Error creating apartment:', error);
      alert('Failed to create apartment');
    }
  };

  const handleJoinApartment = async (apartmentId) => {
    // Debug: Check if user has userId
    console.log('User object:', user);
    console.log('User ID:', user.userId);
    
    if (!user || !user.userId) {
      alert('Error: User not logged in properly. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const url = `http://localhost:8080/api/residence/join?userId=${user.userId}&apartmentId=${apartmentId}`;
      console.log('Joining apartment with URL:', url);
      
      await axios.post(url);
      alert('Successfully joined apartment!');
      navigate('/search');
    } catch (error) {
      console.error('Error joining apartment:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to join apartment: ${error.response?.data || error.message}`);
    }
  };

  const handleDeleteApartment = async (apartmentId, e) => {
    e.stopPropagation(); // Prevent card click when deleting
    
    if (!window.confirm('Are you sure you want to delete this apartment? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/apartments/${apartmentId}`);
      alert('Apartment deleted successfully!');
      fetchApartments(); // Refresh list
    } catch (error) {
      console.error('Error deleting apartment:', error);
      alert('Failed to delete apartment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="apartments-container">
        <div className="loading">Loading apartments...</div>
      </div>
    );
  }

  return (
    <div className="apartments-container">
      {/* Navigation Bar */}
      <nav className="apartments-nav">
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
      <div className="apartments-content">
        <div className="apartments-header">
          <h1>Find Your Apartment</h1>
          <p>Join an existing apartment or create a new one</p>
        </div>

        <div className="apartments-actions">
          <button 
            className="create-apartment-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Create New Apartment'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="apartment-form-card">
            <h2>Create New Apartment</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Complex Name *</label>
                <input
                  type="text"
                  name="complexName"
                  placeholder="e.g., Sunset Apartments"
                  value={formData.complexName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  placeholder="e.g., 101"
                  value={formData.roomNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Rent *</label>
                  <input
                    type="number"
                    name="rentAmount"
                    placeholder="2000.00"
                    value={formData.rentAmount}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Due Day *</label>
                  <input
                    type="number"
                    name="rentDueDay"
                    placeholder="1-31"
                    value={formData.rentDueDay}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Create Apartment
              </button>
            </form>
          </div>
        )}

        {/* Apartments Grid */}
        <div className="apartments-grid">
          {apartments.length === 0 ? (
            <div className="empty-state">
              <h3>No apartments yet</h3>
              <p>Create the first apartment to get started!</p>
            </div>
          ) : (
            apartments.map((apt) => (
              <div key={apt.apartmentId} className="apartment-card">
                <button 
                  className="delete-apartment-btn"
                  onClick={(e) => handleDeleteApartment(apt.apartmentId, e)}
                  title="Delete apartment"
                >
                  <FaTrashCan />
                </button>
                <div className="apartment-icon">🏠</div>
                <h3>{apt.complexName}</h3>
                <div className="apartment-details">
                  {apt.roomNumber && (
                    <p><strong>Room:</strong> {apt.roomNumber}</p>
                  )}
                  <p><strong>Rent:</strong> ${apt.rentAmount?.toFixed(2) || '0.00'}/mo</p>
                  <p><strong>Due Day:</strong> Day {apt.rentDueDay} of month</p>
                </div>
                <button 
                  onClick={() => handleJoinApartment(apt.apartmentId)}
                  className="join-btn"
                >
                  Join This Apartment
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}