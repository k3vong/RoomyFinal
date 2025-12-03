import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input, { Textarea, Select } from '../components/Input';
import './Chores.css';

export default function Chores() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChore, setEditingChore] = useState(null);
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
      if (editingChore) {
        // Update existing chore
        await axios.put(`http://localhost:8080/api/chores/${editingChore.choreId}`, {
          apartmentId: userApartmentId,
          createdBy: user.userId,
          title: formData.title,
          description: formData.description,
          isRecurring: formData.isRecurring,
          recurrenceType: formData.isRecurring ? formData.recurrenceType : null,
          dueDate: formData.dueDate || null,
          isCompleted: editingChore.isCompleted
        });
        alert('Chore updated successfully!');
      } else {
        // Create new chore
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
      }
      setShowForm(false);
      setEditingChore(null);
      setFormData({ 
        title: '', 
        description: '', 
        isRecurring: false, 
        recurrenceType: '', 
        dueDate: '' 
      });
      fetchUserApartmentAndChores();
    } catch (error) {
      console.error('Error saving chore:', error);
      alert('Failed to save chore');
    }
  };

  const handleEditChore = (chore) => {
    setEditingChore(chore);
    setFormData({
      title: chore.title,
      description: chore.description || '',
      isRecurring: chore.isRecurring,
      recurrenceType: chore.recurrenceType || '',
      dueDate: chore.dueDate ? chore.dueDate.split('T')[0] : ''
    });
    setShowForm(true);
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

  const handleDeleteChore = async (choreId) => {
    if (!window.confirm('Are you sure you want to delete this chore?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/api/chores/${choreId}`);
      fetchUserApartmentAndChores();
    } catch (error) {
      console.error('Error deleting chore:', error);
      alert('Failed to delete chore');
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
            <p>Loading chores...</p>
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
              <p>You need to join an apartment before you can manage chores.</p>
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
        title="Chores"
        subtitle="Track and complete household tasks"
        actions={
          <div className="page-actions">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <Button 
              variant="primary"
              onClick={() => {
                setShowForm(!showForm);
                setEditingChore(null);
                setFormData({ 
                  title: '', 
                  description: '', 
                  isRecurring: false, 
                  recurrenceType: '', 
                  dueDate: '' 
                });
              }}
            >
              {showForm ? 'Cancel' : '+ Add New Chore'}
            </Button>
          </div>
        }
      >
        {/* Create/Edit Form */}
        {showForm && (
          <Card title={editingChore ? 'Edit Chore' : 'Create New Chore'} className="chore-form-card">
            <form onSubmit={handleSubmit} className="chore-form">
              <Input
                label="Chore Title"
                type="text"
                name="title"
                placeholder="e.g., Take out trash"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
              />

              <Textarea
                label="Description"
                name="description"
                placeholder="Add any details about this chore..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                fullWidth
              />

              <Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
              />

              <div className="checkbox-group">
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
                <Select
                  label="Frequency"
                  name="recurrenceType"
                  value={formData.recurrenceType}
                  onChange={handleChange}
                  required={formData.isRecurring}
                  fullWidth
                >
                  <option value="">Select frequency</option>
                  <option value="DAILY">Daily</option>
                  <option value="MONTHLY">Monthly</option>
                </Select>
              )}

              <Button type="submit" variant="primary" fullWidth>
                {editingChore ? 'Update Chore' : 'Create Chore'}
              </Button>
            </form>
          </Card>
        )}

        {/* Chores List */}
        {chores.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state-content">
              <div className="empty-state-icon">✓</div>
              <h3>No Chores Yet</h3>
              <p>Add your first chore to get started!</p>
            </div>
          </Card>
        ) : (
          <div className="chores-grid">
            {chores.map((chore) => (
              <Card 
                key={chore.choreId} 
                className={`chore-card ${chore.isCompleted ? 'completed' : ''}`}
                hover
              >
                <div className="chore-header">
                  <h3>{chore.title}</h3>
                  <div className="chore-badges">
                    {chore.isCompleted && (
                      <span className="badge badge-success">✓ Done</span>
                    )}
                    {chore.isRecurring && !chore.isCompleted && (
                      <span className="badge badge-info">
                        🔁 {chore.recurrenceType}
                      </span>
                    )}
                  </div>
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
                  
                  <div className="chore-actions">
                    {!chore.isCompleted && (
                      <>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditChore(chore)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="success"
                          size="sm"
                          onClick={() => handleCompleteChore(chore.choreId)}
                        >
                          Mark Complete
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteChore(chore.choreId)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageLayout>
    </>
  );
}