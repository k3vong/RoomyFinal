import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../App';
import { FaTimes } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Input, Textarea, Select } from '../components/Input';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    status: user?.status || 'AVAILABLE',
    customStatus: user?.customStatus || '',
    bio: user?.bio || '',
    profilePic: null
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [saving, setSaving] = useState(false);
  const [createdApartments, setCreatedApartments] = useState([]);
  const [currentApartment, setCurrentApartment] = useState(null);
  const [loadingApartments, setLoadingApartments] = useState(true);
  
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchApartmentData();
  }, []);

  const fetchApartmentData = async () => {
    setLoadingApartments(true);
    try {
      // Fetch apartments created by this user
      const createdResponse = await axios.get(`http://localhost:8080/api/apartments/creator/${user.userId}`);
      setCreatedApartments(createdResponse.data || []);

      // Fetch user's current apartment
      try {
        const apartmentIdResponse = await axios.get(`http://localhost:8080/api/residence/user/${user.userId}`);
        if (apartmentIdResponse.data) {
          const apartmentResponse = await axios.get(`http://localhost:8080/api/apartments/${apartmentIdResponse.data}`);
          setCurrentApartment(apartmentResponse.data);
        }
      } catch (err) {
        console.log('User has no current apartment');
      }
    } catch (error) {
      console.error('Error fetching apartment data:', error);
      showToast('Failed to load apartment information');
    } finally {
      setLoadingApartments(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profilePic: e.target.files[0]
      });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update user info
      await axios.put(`http://localhost:8080/api/users/${user.userId}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        status: formData.status,
        customStatus: formData.status === 'CUSTOM' ? formData.customStatus : null,
        bio: formData.bio
      });

      // Update local storage
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        status: formData.status,
        customStatus: formData.status === 'CUSTOM' ? formData.customStatus : null,
        bio: formData.bio
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      showToast('Please type DELETE to confirm', 'warning');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/users/${user.userId}`);
      localStorage.removeItem('user');
      showToast('Account deleted successfully', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      showToast('Failed to delete account', 'error');
    }
  };

  const handleDeleteApartment = async (apartmentId) => {
    if (!window.confirm('Delete this apartment? All associated data will be removed. This cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/apartments/${apartmentId}`);
      showToast('Apartment deleted successfully!');
      await fetchApartmentData();
    } catch (error) {
      console.error('Error deleting apartment:', error);
      showToast('Failed to delete apartment');
    }
  };

  const handleLeaveApartment = async () => {
    if (!window.confirm('Leave your current apartment? You will need to join another apartment to access shared features.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/residence/leave/${user.userId}`);
      showToast('You have left the apartment');
      setCurrentApartment(null);
      await fetchApartmentData();
    } catch (error) {
      console.error('Error leaving apartment:', error);
      showToast('Failed to leave apartment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Navigation currentUser={user} onLogout={handleLogout} />
      <PageLayout
        title="Profile Settings"
        subtitle="Manage your account information and preferences"
        actions={
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        }
      >
        <div className="profile-main">
          {/* Profile Picture Section */}
          <Card className="profile-pic-card">
            <div className="profile-pic-section">
              <div className="profile-pic-container">
                {formData.profilePic ? (
                  <img 
                    src={URL.createObjectURL(formData.profilePic)} 
                    alt="Profile Preview" 
                    className="profile-pic"
                  />
                ) : (
                  <div className="profile-pic-placeholder">
                    <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>
                  </div>
                )}
              </div>
              <div className="profile-pic-info">
                <label className="upload-btn-wrapper">
                  <Button variant="secondary" as="span">
                    Change Photo
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="upload-note">Profile pictures will be available in a future update</p>
              </div>
            </div>
          </Card>

          {/* Profile Form */}
          <Card title="Personal Information">
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-row">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                fullWidth
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />

              <Textarea
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell your roommates about yourself..."
                rows={4}
                maxLength={500}
                helperText={`${formData.bio.length}/500 characters`}
                fullWidth
              />

              <Select 
                label="Current Status"
                name="status" 
                value={formData.status}
                onChange={handleChange}
                fullWidth
              >
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy</option>
                <option value="WORKING">Working</option>
                <option value="CLEANING">Cleaning</option>
                <option value="AWAY">Away</option>
                <option value="CUSTOM">Custom</option>
              </Select>

              {formData.status === 'CUSTOM' && (
                <Input
                  label="Custom Status Message"
                  type="text"
                  name="customStatus"
                  value={formData.customStatus}
                  onChange={handleChange}
                  placeholder="e.g., Studying for midterms"
                  maxLength={100}
                  fullWidth
                />
              )}

              <Button type="submit" variant="primary" fullWidth disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>

          {/* Current Apartment Section */}
          <Card title="Current Apartment">
            {loadingApartments ? (
              <p>Loading apartment information...</p>
            ) : currentApartment ? (
              <div className="current-apartment-info">
                <div className="apartment-details">
                  <h3>{currentApartment.complexName}</h3>
                  {currentApartment.roomNumber && <p>Room: {currentApartment.roomNumber}</p>}
                  <p>Rent: ${currentApartment.rentAmount?.toFixed(2)}/month</p>
                  <p>Due: Day {currentApartment.rentDueDay} of each month</p>
                </div>
                <Button 
                  variant="danger" 
                  onClick={handleLeaveApartment}
                >
                  Leave Apartment
                </Button>
              </div>
            ) : (
              <div className="no-apartment">
                <p>You are not currently in an apartment.</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/apartments')}
                >
                  Find an Apartment
                </Button>
              </div>
            )}
          </Card>

          {/* Created Apartments Section */}
          <Card title="Apartments You Created">
            {loadingApartments ? (
              <p>Loading your apartments...</p>
            ) : createdApartments.length > 0 ? (
              <div className="created-apartments-list">
                {createdApartments.map((apt) => (
                  <div key={apt.apartmentId} className="created-apartment-item">
                    <div className="apartment-info">
                      <h4>{apt.complexName}</h4>
                      {apt.roomNumber && <span className="room-number">Room {apt.roomNumber}</span>}
                    </div>
                    <button 
                      className="delete-apartment-btn"
                      onClick={() => handleDeleteApartment(apt.apartmentId)}
                      title="Delete apartment"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-apartments-created">
                <p>You haven't created any apartments yet.</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/apartments')}
                >
                  Create an Apartment
                </Button>
              </div>
            )}
          </Card>

          {/* Danger Zone */}
          <Card className="danger-zone-card">
            <h2 className="danger-zone-title">Danger Zone</h2>
            <p className="danger-zone-text">Once you delete your account, there is no going back. Please be certain.</p>
            
            {!showDeleteConfirm ? (
              <Button 
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            ) : (
              <div className="delete-confirm">
                <p className="confirm-warning">
                  ⚠️ This action cannot be undone. Type <strong>DELETE</strong> to confirm:
                </p>
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  fullWidth
                />
                <div className="confirm-actions">
                  <Button 
                    variant="danger"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE'}
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </PageLayout>
    </>
  );
}
