import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrashCan, FaEdit } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import './Apartments.css';

export default function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
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
      if (editingApartment) {
        // Update existing apartment
        await axios.put(`http://localhost:8080/api/apartments/${editingApartment.apartmentId}`, {
          complexName: formData.complexName,
          roomNumber: formData.roomNumber,
          rentAmount: parseFloat(formData.rentAmount),
          rentDueDay: parseInt(formData.rentDueDay)
        });
        alert('Apartment updated successfully!');
      } else {
        // Create new apartment
        await axios.post('http://localhost:8080/api/apartments', {
          complexName: formData.complexName,
          roomNumber: formData.roomNumber,
          rentAmount: parseFloat(formData.rentAmount),
          rentDueDay: parseInt(formData.rentDueDay)
        });
        alert('Apartment created successfully!');
      }
      setShowForm(false);
      setEditingApartment(null);
      setFormData({ complexName: '', roomNumber: '', rentAmount: '', rentDueDay: 1 });
      fetchApartments();
    } catch (error) {
      console.error('Error saving apartment:', error);
      alert('Failed to save apartment');
    }
  };

  const handleEditApartment = (apt, e) => {
    e.stopPropagation();
    setEditingApartment(apt);
    setFormData({
      complexName: apt.complexName,
      roomNumber: apt.roomNumber || '',
      rentAmount: apt.rentAmount.toString(),
      rentDueDay: apt.rentDueDay
    });
    setShowForm(true);
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
      navigate('/dashboard');
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
      <>
        <Navigation currentUser={user} onLogout={handleLogout} />
        <PageLayout>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading apartments...</p>
          </div>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Navigation currentUser={user} onLogout={handleLogout} />
      <PageLayout
        title="Apartments"
        subtitle="Find and manage your apartment"
        actions={
          <Button 
            variant="primary"
            onClick={() => navigate('/dashboard')}>
            onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        }
      >
        {/* Create/Edit Form */}
        {showForm && (
          <Card 
            title={editingApartment ? 'Edit Apartment' : 'Create New Apartment'}
            className="apartment-form-card"
          >
            <form onSubmit={handleSubmit} className="apartment-form">
              <Input
                label="Complex Name"
                type="text"
                name="complexName"
                placeholder="e.g., Sunset Apartments"
                value={formData.complexName}
                onChange={handleChange}
                required
                fullWidth
              />

              <Input
                label="Room Number"
                type="text"
                name="roomNumber"
                placeholder="e.g., 101"
                value={formData.roomNumber}
                onChange={handleChange}
                fullWidth
              />

              <div className="form-row">
                <Input
                  label="Monthly Rent"
                  type="number"
                  name="rentAmount"
                  placeholder="2000.00"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  step="0.01"
                  required
                  fullWidth
                />

                <Input
                  label="Due Day (1-31)"
                  type="number"
                  name="rentDueDay"
                  placeholder="1"
                  value={formData.rentDueDay}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  required
                  fullWidth
                />
              </div>

              <div className="form-actions">
                <Button type="submit" variant="primary">
                  {editingApartment ? 'Update Apartment' : 'Create Apartment'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingApartment(null);
                    setFormData({ complexName: '', roomNumber: '', rentAmount: '', rentDueDay: 1 });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {!showForm && (
          <Button 
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              setShowForm(true);
              setEditingApartment(null);
              setFormData({ complexName: '', roomNumber: '', rentAmount: '', rentDueDay: 1 });
            }}
          >
            + Create New Apartment
          </Button>
        )}

        {/* Apartments Grid */}
        <div className="apartments-section">
          <h2>Available Apartments</h2>
          {apartments.length === 0 ? (
            <Card className="empty-state">
              <div className="empty-content">
                <div className="empty-icon">🏠</div>
                <h3>No Apartments Yet</h3>
                <p>Be the first to create an apartment!</p>
              </div>
            </Card>
          ) : (
            <div className="apartments-grid">
              {apartments.map((apt) => (
                <Card key={apt.apartmentId} className="apartment-card" hover>
                  <div className="apartment-card-header">
                    <div className="apartment-icon-large">🏠</div>
                    <div className="apartment-actions-top">
                      <button 
                        className="icon-btn edit-btn"
                        onClick={(e) => handleEditApartment(apt, e)}
                        title="Edit apartment"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="icon-btn delete-btn"
                        onClick={(e) => handleDeleteApartment(apt.apartmentId, e)}
                        title="Delete apartment"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </div>
                  <h3 className="apartment-name">{apt.complexName}</h3>
                  <div className="apartment-info">
                    {apt.roomNumber && <p>📍 Room {apt.roomNumber}</p>}
                    <p>💰 ${apt.rentAmount?.toFixed(2) || '0.00'}/month</p>
                    <p>📅 Due day {apt.rentDueDay}</p>
                  </div>
                  <Button 
                    onClick={() => handleJoinApartment(apt.apartmentId)}
                    variant="primary"
                    fullWidth
                  >
                    Join This Apartment
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}