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
  const [apartmentIdInput, setApartmentIdInput] = useState('');
  const [joiningWithId, setJoiningWithId] = useState(false);
  const [roommatesCount, setRoommatesCount] = useState({});
  const [formData, setFormData] = useState({
    complexName: '',
    roomNumber: '',
    rentAmount: '',
    rentDueDay: 1
  });
  
  const navigate = useNavigate();
  const showToast = useContext(ToastContext) || ((msg) => alert(msg));
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apartmentsResponse = await axios.get('http://localhost:8080/api/apartments');
      const apartmentsData = apartmentsResponse.data || [];
      setApartments(apartmentsData);

      // Fetch roommate counts for all apartments
      const counts = {};
      for (const apt of apartmentsData) {
        try {
          const residentsResponse = await axios.get(
            `http://localhost:8080/api/residence/apartment/${apt.apartmentId}`
          );
          counts[apt.apartmentId] = residentsResponse.data.length;
        } catch (err) {
          counts[apt.apartmentId] = 0;
        }
      }
      setRoommatesCount(counts);

      if (user?.userId) {
        try {
          const residenceResponse = await axios.get(`http://localhost:8080/api/residence/user/${user.userId}`);
          if (residenceResponse.data) {
            setUserApartmentId(residenceResponse.data);
          }
        } catch (err) {
          console.log('User has no apartment yet');
        }
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
      showToast('Failed to load apartments');
    } finally {
      setLoading(false);
    }
  };

  const refreshApartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/apartments');
      setApartments(response.data || []);
    } catch (error) {
      console.error('Error refreshing apartments:', error);
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
      const apartmentData = {
        complexName: formData.complexName,
        roomNumber: formData.roomNumber,
        rentAmount: parseFloat(formData.rentAmount),
        rentDueDay: parseInt(formData.rentDueDay)
      };

      if (editingApartment) {
        await axios.put(
          `http://localhost:8080/api/apartments/${editingApartment.apartmentId}`,
          apartmentData
        );
        showToast('Apartment updated successfully!');
      } else {
        // Create apartment
        const createResponse = await axios.post('http://localhost:8080/api/apartments', {
          ...apartmentData,
          createdBy: user.userId
        });
        const newApartmentId = createResponse.data;
        
        // Automatically join the creator to the apartment
        await axios.post(
          `http://localhost:8080/api/residence/join?userId=${user.userId}&apartmentId=${newApartmentId}`
        );
        
        showToast('Apartment created successfully!');
      }
      
      setShowForm(false);
      setEditingApartment(null);
      setFormData({ complexName: '', roomNumber: '', rentAmount: '', rentDueDay: 1 });
      await refreshApartments();
    } catch (error) {
      console.error('Error saving apartment:', error);
      showToast('Failed to save apartment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (apt, e) => {
    e?.stopPropagation();
    setEditingApartment(apt);
    setFormData({
      complexName: apt.complexName,
      roomNumber: apt.roomNumber || '',
      rentAmount: apt.rentAmount?.toString() || '',
      rentDueDay: apt.rentDueDay || 1
    });
    setShowForm(true);
  };

  const handleJoinById = async (e) => {
    e.preventDefault();
    
    if (!apartmentIdInput || apartmentIdInput.trim() === '') {
      showToast('Please enter an Apartment ID');
      return;
    }

    const aptId = parseInt(apartmentIdInput.trim());
    if (isNaN(aptId)) {
      showToast('Please enter a valid Apartment ID (numbers only)');
      return;
    }

    setJoiningWithId(true);
    try {
      const apartmentResponse = await axios.get(`http://localhost:8080/api/apartments/${aptId}`);
      
      if (!apartmentResponse.data) {
        showToast('This apartment does not exist');
        return;
      }

      await axios.post(
        `http://localhost:8080/api/residence/join?userId=${user.userId}&apartmentId=${aptId}`
      );
      showToast(`Successfully joined ${apartmentResponse.data.complexName}!`);
      setApartmentIdInput('');
      await fetchData();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error joining apartment by ID:', error);
      if (error.response?.status === 404) {
        showToast('This apartment does not exist');
      } else {
        showToast('Failed to join apartment');
      }
    } finally {
      setJoiningWithId(false);
    }
  };

  const handleDelete = async (apartmentId, e) => {
    e?.stopPropagation();
    
    if (!window.confirm('Delete this apartment? This cannot be undone.')) {
      return;
    }

    setDeletingId(apartmentId);
    try {
      await axios.delete(`http://localhost:8080/api/apartments/${apartmentId}`);
      showToast('Apartment deleted successfully!');
      await refreshApartments();
    } catch (error) {
      console.error('Error deleting apartment:', error);
      showToast('Failed to delete apartment');
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
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        }
      >
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

        {!userApartmentId && (
          <Card title="Join an Apartment" className="join-apartment-card">
            <p className="join-instructions">
              Enter the Apartment ID provided by your roommate to join their apartment.
              You can find your Apartment ID in your Profile after creating an apartment.
            </p>
            <form onSubmit={handleJoinById} className="join-form">
              <div className="join-input-group">
                <Input
                  label="Apartment ID"
                  type="text"
                  placeholder="e.g., 12345"
                  value={apartmentIdInput}
                  onChange={(e) => setApartmentIdInput(e.target.value)}
                  fullWidth
                />
              </div>
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth
                disabled={joiningWithId}
              >
                {joiningWithId ? 'Joining...' : 'Join Apartment'}
              </Button>
            </form>
          </Card>
        )}

        {userApartmentId && (
          <Card title="Your Current Apartment" className="current-apartment-display">
            <p className="apartment-id-display">
              <strong>Your Apartment ID:</strong> {userApartmentId}
            </p>
            <p className="share-instructions">
              Share this ID with friends so they can join your apartment!
            </p>
            <Button 
              variant="secondary"
              onClick={() => navigate('/profile')}
              fullWidth
            >
              Manage Apartment in Profile
            </Button>
          </Card>
        )}

        <div className="apartments-section">
          <h2>Your Apartments</h2>
          
          {apartments.filter(apt => apt.createdBy === user?.userId).length === 0 ? (
            <Card className="empty-state">
              <div className="empty-content">
                <div className="empty-icon">🏠</div>
                <h3>No Apartments Yet</h3>
                <p>Create an apartment and share the ID with your roommates!</p>
              </div>
            </Card>
          ) : (
            <div className="apartments-grid">
              {apartments.map((apt) => {
                const isCreator = apt.createdBy === user?.userId;
                const isUserApartment = apt.apartmentId === userApartmentId;
                
                if (!isCreator) return null;
                
                return (
                  <Card 
                    key={apt.apartmentId} 
                    className={`apartment-card ${isUserApartment ? 'current-apartment' : ''}`} 
                    hover
                  >
                    <div className="apartment-card-header">
                      <div className="apartment-icon-large">🏠</div>
                      {isCreator && (
                        <div className="apartment-actions-top">
                          <button 
                            className="icon-btn edit-btn"
                            onClick={(e) => handleEdit(apt, e)}
                            title="Edit apartment"
                            type="button"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="icon-btn delete-btn"
                            onClick={(e) => handleDelete(apt.apartmentId, e)}
                            title="Delete apartment"
                            disabled={deletingId === apt.apartmentId}
                            type="button"
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
                      <p><strong>Apartment ID:</strong> {apt.apartmentId}</p>
                      {apt.roomNumber && <p>📍 Room {apt.roomNumber}</p>}
                      <p>💰 ${apt.rentAmount?.toFixed(2) || '0.00'}/month</p>
                      <p>📅 Due day {apt.rentDueDay || 1}</p>
                      <p>👥 {roommatesCount[apt.apartmentId] || 0} {(roommatesCount[apt.apartmentId] || 0) === 1 ? 'roommate' : 'roommates'}</p>
                    </div>
                    
                    <div className="apartment-actions">
                      <Button 
                        onClick={() => {
                          navigator.clipboard.writeText(apt.apartmentId.toString());
                          showToast('Apartment ID copied to clipboard!');
                        }}
                        variant="secondary"
                        fullWidth
                      >
                        📋 Copy ID to Share
                      </Button>
                    </div>
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
