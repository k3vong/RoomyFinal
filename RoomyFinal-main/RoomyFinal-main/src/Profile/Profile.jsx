import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  
  const navigate = useNavigate();

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

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/users/${user.userId}`);
      localStorage.removeItem('user');
      alert('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
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
