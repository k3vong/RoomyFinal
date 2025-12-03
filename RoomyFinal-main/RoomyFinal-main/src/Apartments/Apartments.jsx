import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../App';
import { FaTrash, FaEdit } from 'react-icons/fa';
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
  const [submitting, setSubmitting] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [formData, setFormData] = useState({
    complexName: '',
    roomNumber: '',
    rentAmount: '',
    rentDueDay: 1
  });
  
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Add error boundary for debugging
  useEffect(() => {
    console.log('Apartments component mounted');
    console.log('User:', user);
    console.log('showToast:', typeof showToast);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all apartments
      const apartmentsResponse = await axios.get('http://localhost:8080/api/apartments');
      setApartments(apartmentsResponse.data);

      // Fetch user's current apartment if any
      if (user?.userId) {
        try {
          const residenceResponse = await axios.get(`http://localhost:8080/api/residence/user/${user.userId}`);
          if (residenceResponse.data && residenceResponse.data.apartmentId) {
            setUserApartmentId(residenceResponse.data.apartmentId);
          }
        } catch (err) {
          // User might not have an apartment yet, that's okay
          console.log('User has no apartment yet');
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (showToast) showToast('Failed to load apartments', 'error');
      setLoading(false);
    }
  };

  const fetchApartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/apartments');
      setApartments(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      showToast('Failed to refresh apartments', 'error');
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
    setSubmitting(true);
    try {
      if (editingApartment) {
        // Update existing apartment
        await axios.put(`http://localhost:8080/api/apartments/${editingApartment.apartmentId}`, {
          complexName: formData.complexName,
          roomNumber: formData.roomNumber,
          rentAmount: parseFloat(formData.rentAmount),
          rentDueDay: parseInt(formData.rentDueDay)
        });
        showToast('Apartment updated successfully!', 'success');
      } else {
        // Create new apartment
        await axios.post('http://localhost:8080/api/apartments', {
          complexName: formData.complexName,
          roomNumber: formData.roomNumber,
          rentAmount: parseFloat(formData.rentAmount),
          rentDueDay: parseInt(formData.rentDueDay),
          createdBy: user.userId
        });
        showToast('Apartment created successfully!', 'success');
      }
      setShowForm(false);
      setEditingApartment(null);
      setFormData({ complexName: '', roomNumber: '', rentAmount: '', rentDueDay: 1 });
      await fetchApartments();
    } catch (error) {
      console.error('Error saving apartment:', error);
      showToast('Failed to save apartment', 'error');
    } finally {
      setSubmitting(false);
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
      showToast('Error: User not logged in properly. Please login again.', 'error');
      navigate('/login');
      return;
    }

    setJoiningId(apartmentId);
    try {
      const url = `http://localhost:8080/api/residence/join?userId=${user.userId}&apartmentId=${apartmentId}`;
      console.log('Joining apartment with URL:', url);
      
      await axios.post(url);
      showToast('Successfully joined apartment!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error joining apartment:', error);
      console.error('Error response:', error.response?.data);
      showToast(`Failed to join apartment: ${error.response?.data || error.message}`, 'error');
    } finally {
      setJoiningId(null);
    }
  };

  const handleDeleteApartment = async (apartmentId, e) => {
    e.stopPropagation(); // Prevent card click when deleting
    
    if (!window.confirm('Are you sure you want to delete this apartment? This action cannot be undone.')) {
      return;
    }

    setDeletingId(apartmentId);
    try {
      await axios.delete(`http://localhost:8080/api/apartments/${apartmentId}`);
      showToast('Apartment deleted successfully!', 'success');
      await fetchApartments(); // Refresh list
    } catch (error) {
      console.error('Error deleting apartment:', error);
      showToast('Failed to delete apartment', 'error');
    } finally {
      setDeletingId(null);
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
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingApartment ? 'Update Apartment' : 'Create Apartment'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingApartment(null);
                    setFormData({ complexName: '', roomNumber: '', rentAmount: '', rentDueDay: 1 });
                  }}
                  disabled={submitting}
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
              {apartments.map((apt) => {
                const isCreator = apt.createdBy === user?.userId;
                const isUserApartment = apt.apartmentId === userApartmentId;
                
                return (
                  <Card key={apt.apartmentId} className={`apartment-card ${isUserApartment ? 'current-apartment' : ''}`} hover>
                    <div className="apartment-card-header">
                      <div className="apartment-icon-large">🏠</div>
                      {isCreator && (
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
                            disabled={deletingId === apt.apartmentId || joiningId === apt.apartmentId}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    {isUserApartment && (
                      <div className="current-badge">Current Apartment</div>
                    )}
                    {isCreator && (
                      <div className="creator-badge">Created by You</div>
                    )}
                    <h3 className="apartment-name">{apt.complexName}</h3>
                    <div className="apartment-info">
                      {apt.roomNumber && <p>📍 Room {apt.roomNumber}</p>}
                      <p>💰 ${apt.rentAmount?.toFixed(2) || '0.00'}/month</p>
                      <p>📅 Due day {apt.rentDueDay}</p>
                    </div>
                    {!isUserApartment ? (
                      <Button 
                        onClick={() => handleJoinApartment(apt.apartmentId)}
                        variant="primary"
                        fullWidth
                        disabled={joiningId === apt.apartmentId || deletingId === apt.apartmentId}
                      >
                        {joiningId === apt.apartmentId ? 'Joining...' : 'Join This Apartment'}
                      </Button>
                    ) : (
                      <Button 
                        variant="secondary"
                        fullWidth
                        disabled
                      >
                        ✓ Your Current Apartment
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}