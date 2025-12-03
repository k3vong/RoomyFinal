import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../App';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import './Dashboard.css';

export default function Dashboard() {
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [chores, setChores] = useState([]);
  const [showChores, setShowChores] = useState(false);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [statusForm, setStatusForm] = useState({
    status: 'AVAILABLE',
    customStatus: ''
  });
  
  const user = JSON.parse(localStorage.getItem('user'));
  const showToast = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserApartment();
  }, []);

  const fetchUserApartment = async () => {
    try {
      const aptResponse = await axios.get(
        `http://localhost:8080/api/residence/user/${user.userId}`
      );
      const apartmentId = aptResponse.data;
      
      if (apartmentId) {
        setUserApartmentId(apartmentId);

        const detailsResponse = await axios.get(
          `http://localhost:8080/api/apartments/${apartmentId}`
        );
        setApartment(detailsResponse.data);
        
        // Fetch upcoming payments
        const paymentsResponse = await axios.get(
          `http://localhost:8080/api/rent/${apartmentId}`
        );
        
        // Filter for unpaid payments in the next 7 days
        const today = new Date();
        const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcoming = paymentsResponse.data.filter(payment => {
          if (payment.isPaid) return false;
          const dueDate = new Date(payment.dueDate);
          return dueDate >= today && dueDate <= sevenDaysFromNow;
        });
        
        setUpcomingPayments(upcoming);
        
        // Fetch chores
        const choresResponse = await axios.get(
          `http://localhost:8080/api/chores/${apartmentId}`
        );
        setChores(choresResponse.data);
        
        // Fetch roommates
        const roommatesResponse = await axios.get(
          `http://localhost:8080/api/residence/apartment/${apartmentId}`
        );
        console.log('Roommates data:', roommatesResponse.data);
        setRoommates(roommatesResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching apartment:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleStatusChange = (e) => {
    setStatusForm({
      ...statusForm,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/users/${user.userId}/status`, {
        status: statusForm.status,
        customStatus: statusForm.status === 'CUSTOM' ? statusForm.customStatus : null
      });
      
      // Update local storage
      const updatedUser = {
        ...user,
        status: statusForm.status,
        customStatus: statusForm.status === 'CUSTOM' ? statusForm.customStatus : null
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      showToast('Status updated successfully!', 'success');
      setShowStatusUpdate(false);
      // Reload the page to refresh user data in all components
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navigation currentUser={user} onLogout={handleLogout} />
      <PageLayout
        title={`Welcome back, ${user.firstName}! 👋`}
        subtitle="Here's what's happening with your apartment"
        maxWidth="xl"
      >
        {/* User Status Card */}
        <Card className="user-status-card">
          <div className="status-info">
            <div className="status-avatar">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="status-details">
              <h3>{user.firstName} {user.lastName}</h3>
              <p className="status-email">{user.email}</p>
              <div className="status-badge-container">
                <span className={`status-badge status-${user.status?.toLowerCase() || 'available'}`}>
                  {user.status || 'AVAILABLE'}
                </span>
                {user.customStatus && (
                  <span className="custom-status">"{user.customStatus}"</span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusUpdate(!showStatusUpdate)}
            >
              Update Status
            </Button>
          </div>
        </Card>

        {/* Status Update Form */}
        {showStatusUpdate && (
          <Card title="Update Your Status" className="status-update-form">
            <form onSubmit={handleStatusUpdate}>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={statusForm.status}
                  onChange={handleStatusChange}
                  className="status-select"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="WORKING">Working</option>
                  <option value="CLEANING">Cleaning</option>
                  <option value="AWAY">Away</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              {statusForm.status === 'CUSTOM' && (
                <div className="form-group">
                  <label>Custom Status Message</label>
                  <input 
                    type="text"
                    name="customStatus"
                    value={statusForm.customStatus}
                    onChange={handleStatusChange}
                    placeholder="e.g., Studying for exams"
                    maxLength="100"
                    className="status-input"
                  />
                </div>
              )}
              <div className="form-actions">
                <Button type="submit" variant="primary">Save Status</Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowStatusUpdate(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : !userApartmentId ? (
          <Card className="empty-state-card">
            <div className="empty-state-content">
              <div className="empty-state-icon">🏠</div>
              <h2>No Apartment Yet</h2>
              <p>You haven't joined an apartment yet. Create one or join an existing apartment to get started!</p>
              <Button variant="primary" size="lg" onClick={() => navigate('/apartments')}>
                Find or Create Apartment
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Apartment Quick Info */}
            {apartment && (
              <Card className="apartment-info-card">
                <div className="apartment-quick-info">
                  <div className="apartment-icon">🏠</div>
                  <div className="apartment-details">
                    <h3>{apartment.complexName}</h3>
                    {apartment.roomNumber && <p>Room {apartment.roomNumber}</p>}
                    <div className="apartment-meta">
                      <span>💰 ${apartment.rentAmount?.toFixed(2)}/month</span>
                      <span>📅 Due day {apartment.rentDueDay}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/apartments')}>
                    Manage
                  </Button>
                </div>
              </Card>
            )}

            {/* Upcoming Payments */}
            {upcomingPayments.length > 0 && (
              <Card 
                title="🔔 Upcoming Payments" 
                subtitle={`${upcomingPayments.length} payment${upcomingPayments.length !== 1 ? 's' : ''} due soon`}
              >
                <div className="payments-list">
                  {upcomingPayments.map(payment => {
                    const daysUntil = Math.ceil((new Date(payment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                    const isExpanded = expandedPayment === payment.rentId;
                    return (
                      <div key={payment.rentId} className={`payment-item ${daysUntil <= 3 ? 'urgent' : ''}`}>
                        <div className="payment-icon">
                          {daysUntil <= 3 ? '🚨' : '📅'}
                        </div>
                        <div className="payment-content">
                          <h4>${payment.totalAmount?.toFixed(2)} due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}</h4>
                          <p>Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                          <p className="payment-type">{payment.paymentType === 'QUEUE' ? 'Rotating' : 'Split Evenly'}</p>
                          
                          {isExpanded && roommates && roommates.length > 0 && (
                            <div className="payment-breakdown">
                              {payment.paymentType === 'SPLIT' ? (
                                <div className="split-details">
                                  <p className="breakdown-title">Split among {roommates.length} roommate{roommates.length !== 1 ? 's' : ''}:</p>
                                  {roommates.map(roommate => (
                                    <div key={roommate.userId} className="roommate-share">
                                      <span>{roommate.firstName} {roommate.lastName}</span>
                                      <span className="amount">${(payment.totalAmount / roommates.length).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="queue-details">
                                  <p className="breakdown-title">Rotating payment</p>
                                  <div className="roommates-tags">
                                    {roommates.map(roommate => (
                                      <span key={roommate.userId} className="roommate-tag">
                                        {roommate.firstName}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPayment(isExpanded ? null : payment.rentId)}
                        >
                          {isExpanded ? 'Hide' : 'Details'}
                        </Button>
                      </div>
                    );
                  })}
                  <Button variant="outline" fullWidth onClick={() => navigate('/payments')}>
                    View All Payments
                  </Button>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card title="Quick Actions" subtitle="Manage your apartment">
              <div className="quick-actions-grid">
                <div 
                  className="action-card" 
                  onClick={() => navigate('/chores')}
                  onKeyPress={(e) => e.key === 'Enter' && navigate('/chores')}
                  role="button"
                  tabIndex={0}
                  aria-label="Manage chores"
                >
                  <div className="action-icon">✅</div>
                  <h4>Chores</h4>
                  <p>Manage tasks</p>
                </div>
                <div 
                  className="action-card" 
                  onClick={() => navigate('/payments')}
                  onKeyPress={(e) => e.key === 'Enter' && navigate('/payments')}
                  role="button"
                  tabIndex={0}
                  aria-label="Track rent payments"
                >
                  <div className="action-icon">💰</div>
                  <h4>Payments</h4>
                  <p>Track rent</p>
                </div>
                <div 
                  className="action-card" 
                  onClick={() => navigate('/groceries')}
                  onKeyPress={(e) => e.key === 'Enter' && navigate('/groceries')}
                  role="button"
                  tabIndex={0}
                  aria-label="Manage grocery shopping list"
                >
                  <div className="action-icon">🛒</div>
                  <h4>Groceries</h4>
                  <p>Shopping list</p>
                </div>
                <div 
                  className="action-card" 
                  onClick={() => navigate('/roommates')}
                  onKeyPress={(e) => e.key === 'Enter' && navigate('/roommates')}
                  role="button"
                  tabIndex={0}
                  aria-label="View roommates"
                >
                  <div className="action-icon">👥</div>
                  <h4>Roommates</h4>
                  <p>View members</p>
                </div>
                <div 
                  className="action-card" 
                  onClick={() => navigate('/calculator')}
                  onKeyPress={(e) => e.key === 'Enter' && navigate('/calculator')}
                  role="button"
                  tabIndex={0}
                  aria-label="Split bills with calculator"
                >
                  <div className="action-icon">🧮</div>
                  <h4>Calculator</h4>
                  <p>Split bills</p>
                </div>
                <div 
                  className="action-card" 
                  onClick={() => navigate('/profile')}
                  onKeyPress={(e) => e.key === 'Enter' && navigate('/profile')}
                  role="button"
                  tabIndex={0}
                  aria-label="Edit profile settings"
                >
                  <div className="action-icon">⚙️</div>
                  <h4>Profile</h4>
                  <p>Settings</p>
                </div>
              </div>
            </Card>
            
            {/* Pending Chores */}
            {chores.length > 0 && (
              <Card 
                title="✓ Pending Chores" 
                subtitle={`${chores.filter(c => !c.isCompleted).length} task${chores.filter(c => !c.isCompleted).length !== 1 ? 's' : ''} to complete`}
              >
                <div className="chores-list">
                  {chores.filter(c => !c.isCompleted).slice(0, 3).map(chore => (
                    <div key={chore.choreId} className="chore-item">
                      <div className="chore-icon">📝</div>
                      <div className="chore-content">
                        <h4>{chore.title}</h4>
                        {chore.description && <p>{chore.description}</p>}
                        {chore.dueDate && (
                          <span className="chore-due">
                            Due: {new Date(chore.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {chores.filter(c => !c.isCompleted).length === 0 && (
                    <div className="empty-chores">
                      <p>🎉 All chores completed!</p>
                    </div>
                  )}
                  <Button variant="outline" fullWidth onClick={() => navigate('/chores')}>
                    View All Chores
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </PageLayout>
    </>
  );
}


