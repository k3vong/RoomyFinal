import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chores.css';

export default function Chores() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isRecurring: false,
    recurrenceType: '',
    dueDate: ''
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUserApartmentAndChores();
  }, []);

  const fetchUserApartmentAndChores = async () => {
    try {
      // Get user's apartment
      const aptResponse = await axios.get(
        `http://localhost:8080/api/residence/user/${user.userId}`
      );
      const apartmentId = aptResponse.data;
      
      if (apartmentId) {
        setUserApartmentId(apartmentId);
        // Fetch chores for that apartment
        const choresResponse = await axios.get(
          `http://localhost:8080/api/chores/${apartmentId}`
        );
        setChores(choresResponse.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chores:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userApartmentId) {
      alert('You need to join an apartment first!');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/chores', {
        apartmentId: userApartmentId,
        createdBy: user.userId,
        title: formData.title,
        description: formData.description,
        isRecurring: formData.isRecurring,
        recurrenceType: formData.isRecurring ? formData.recurrenceType : null,
        dueDate: formData.dueDate || null
      });
      alert('Chore created successfully!');
      setShowForm(false);
      setFormData({ 
        title: '', 
        description: '', 
        isRecurring: false, 
        recurrenceType: '', 
        dueDate: '' 
      });
      fetchUserApartmentAndChores();
    } catch (error) {
      console.error('Error creating chore:', error);
      alert('Failed to create chore');
    }
  };

  const handleCompleteChore = async (choreId) => {
    try {
      await axios.put(`http://localhost:8080/api/chores/${choreId}/complete`);
      alert('Chore marked as complete!');
      fetchUserApartmentAndChores();
    } catch (error) {
      console.error('Error completing chore:', error);
      alert('Failed to complete chore');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="chores-container">
        <div className="loading">Loading chores...</div>
      </div>
    );
  }

  if (!userApartmentId) {
    return (
      <div className="chores-container">
        <nav className="chores-nav">
          <div className="logo" onClick={() => navigate('/search')}>Roomy</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
        <div className="no-apartment-state">
          <div className="empty-icon">🏠</div>
          <h2>No Apartment Found</h2>
          <p>You need to join an apartment before you can manage chores.</p>
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
    <div className="chores-container">
      {/* Navigation Bar */}
      <nav className="chores-nav">
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
      <div className="chores-content">
        <div className="chores-header">
          <h1>Chores</h1>
          <p>Track and complete household tasks</p>
        </div>

        <div className="chores-actions">
          <button 
            className="create-chore-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add New Chore'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="chore-form-card">
            <h2>Create New Chore</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Chore Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Take out trash"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Add any details about this chore..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleChange}
                  />
                  <span>This is a recurring chore</span>
                </label>
              </div>

              {formData.isRecurring && (
                <div className="form-group">
                  <label>Frequency *</label>
                  <select
                    name="recurrenceType"
                    value={formData.recurrenceType}
                    onChange={handleChange}
                    required={formData.isRecurring}
                  >
                    <option value="">Select frequency</option>
                    <option value="DAILY">Daily</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              )}

              <button type="submit" className="submit-btn">
                Create Chore
              </button>
            </form>
          </div>
        )}

        {/* Chores List */}
        <div className="chores-grid">
          {chores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No chores yet</h3>
              <p>Add your first chore to get started!</p>
            </div>
          ) : (
            chores.map((chore) => (
              <div 
                key={chore.choreId} 
                className={`chore-card ${chore.isCompleted ? 'completed' : ''}`}
              >
                <div className="chore-header">
                  <h3>{chore.title}</h3>
                  {chore.isCompleted && (
                    <span className="completed-badge">✓ Done</span>
                  )}
                  {chore.isRecurring && !chore.isCompleted && (
                    <span className="recurring-badge">
                      🔁 {chore.recurrenceType}
                    </span>
                  )}
                </div>
                
                {chore.description && (
                  <p className="chore-description">{chore.description}</p>
                )}
                
                <div className="chore-footer">
                  {chore.dueDate && (
                    <span className="due-date">
                      📅 Due: {new Date(chore.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  
                  {!chore.isCompleted && (
                    <button 
                      onClick={() => handleCompleteChore(chore.choreId)}
                      className="complete-btn"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}