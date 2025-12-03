import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../App';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import './Payments.css';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [payingRentId, setPayingRentId] = useState(null);
  const [formData, setFormData] = useState({
    dueDate: '',
    totalAmount: '',
    paymentType: 'QUEUE'
  });
  
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUserApartmentAndPayments();
  }, []);

  const fetchUserApartmentAndPayments = async () => {
    try {
      // Get user's apartment
      const aptResponse = await axios.get(
        `http://localhost:8080/api/residence/user/${user.userId}`
      );
      const apartmentId = aptResponse.data;
      
      if (apartmentId) {
        setUserApartmentId(apartmentId);
        
        // Get roommates
        const roommatesResponse = await axios.get(
          `http://localhost:8080/api/residence/apartment/${apartmentId}`
        );
        setRoommates(roommatesResponse.data);
        
        // Fetch payments for that apartment
        const paymentsResponse = await axios.get(
          `http://localhost:8080/api/rent/${apartmentId}`
        );
        setPayments(paymentsResponse.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
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
    
    if (!userApartmentId) {
      showToast('You need to join an apartment first!', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/rent', {
        apartmentId: userApartmentId,
        dueDate: formData.dueDate,
        totalAmount: parseFloat(formData.totalAmount),
        paymentType: formData.paymentType,
        paidBy: null,
        isPaid: false
      });
      showToast('Payment added successfully!', 'success');
      setShowForm(false);
      setFormData({ dueDate: '', totalAmount: '', paymentType: 'QUEUE' });
      await fetchUserApartmentAndPayments();
    } catch (error) {
      console.error('Error adding payment:', error);
      showToast('Failed to add payment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (rentId) => {
    setPayingRentId(rentId);
    try {
      await axios.put(
        `http://localhost:8080/api/rent/${rentId}/pay?userId=${user.userId}`
      );
      showToast('Payment marked as paid!', 'success');
      await fetchUserApartmentAndPayments();
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      showToast('Failed to mark payment as paid', 'error');
    } finally {
      setPayingRentId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const togglePaymentDetails = (rentId) => {
    setExpandedPayment(expandedPayment === rentId ? null : rentId);
  };

  const getPaymentStatus = (payment) => {
    if (payment.isPaid) return { text: 'Paid', class: 'status-paid', icon: '✓' };
    
    const dueDate = new Date(payment.dueDate);
    const today = new Date();
    const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { text: 'Overdue', class: 'status-overdue', icon: '!' };
    if (daysUntil === 0) return { text: 'Due Today', class: 'status-due-today', icon: '⚠' };
    if (daysUntil <= 3) return { text: `Due in ${daysUntil}d`, class: 'status-due-soon', icon: '⏰' };
    return { text: 'Upcoming', class: 'status-upcoming', icon: '📅' };
  };

  if (loading) {
    return (
      <>
        <Navigation currentUser={user} onLogout={handleLogout} />
        <PageLayout>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading payments...</p>
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
              <p>You need to join an apartment before you can manage payments.</p>
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
        title="💰 Rent Payments"
        subtitle="Manage and track all rent payments for your apartment"
        actions={
          <div className="page-actions">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <Button 
              variant="primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ New Payment'}
            </Button>
          </div>
        }
      >

        {/* Create Form */}
        {showForm && (
          <Card title="Create New Payment" className="payment-form-card">
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-row">
                <Input
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <Input
                  label="Total Amount"
                  type="number"
                  name="totalAmount"
                  placeholder="0.00"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  step="0.01"
                  required
                  icon="💵"
                  fullWidth
                />
              </div>

              <div className="payment-type-selector">
                <label className="payment-type-label">Payment Type</label>
                <div className="payment-type-options">
                  <label className={`type-option ${formData.paymentType === 'SPLIT' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="SPLIT"
                      checked={formData.paymentType === 'SPLIT'}
                      onChange={handleChange}
                    />
                    <div className="type-content">
                      <div className="type-icon">👥</div>
                      <div>
                        <div className="type-title">Split Evenly</div>
                        <div className="type-description">Everyone pays equal share</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`type-option ${formData.paymentType === 'QUEUE' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="QUEUE"
                      checked={formData.paymentType === 'QUEUE'}
                      onChange={handleChange}
                    />
                    <div className="type-content">
                      <div className="type-icon">🔄</div>
                      <div>
                        <div className="type-title">Rotating</div>
                        <div className="type-description">Take turns paying full amount</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Payment'}
              </Button>
            </form>
          </Card>
        )}

        {/* Payments Summary */}
        {payments.length > 0 && (
          <div className="payments-summary">
            <Card className="summary-card">
              <div className="summary-label">Total Payments</div>
              <div className="summary-value">{payments.length}</div>
            </Card>
            <Card className="summary-card">
              <div className="summary-label">Paid</div>
              <div className="summary-value paid">{payments.filter(p => p.isPaid).length}</div>
            </Card>
            <Card className="summary-card">
              <div className="summary-label">Pending</div>
              <div className="summary-value pending">{payments.filter(p => !p.isPaid).length}</div>
            </Card>
            <Card className="summary-card">
              <div className="summary-label">Total Amount</div>
              <div className="summary-value amount">
                ${payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toFixed(2)}
              </div>
            </Card>
          </div>
        )}

        {/* Payments List */}
        {payments.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state-content">
              <div className="empty-state-icon">💸</div>
              <h3>No Payments Yet</h3>
              <p>Create your first rent payment to get started tracking!</p>
              <Button variant="primary" size="lg" onClick={() => setShowForm(true)}>
                Create First Payment
              </Button>
            </div>
          </Card>
        ) : (
          <div className="payments-list">
            {payments.map((payment) => {
              const status = getPaymentStatus(payment);
              const isExpanded = expandedPayment === payment.rentId;
              
              return (
                <Card
                  key={payment.rentId} 
                  className={`payment-card ${payment.isPaid ? 'paid' : ''}`}
                  hover
                >
                  <div className="payment-main">
                    <div className="payment-info">
                      <div className="payment-amount-section">
                        <div className="payment-amount">${payment.totalAmount?.toFixed(2)}</div>
                        <div className="payment-type-badge">
                          {payment.paymentType === 'SPLIT' ? '👥 Split' : '🔄 Rotating'}
                        </div>
                      </div>
                      
                      <div className="payment-meta">
                        <div className="meta-item">
                          <span className="meta-label">Due Date</span>
                          <span className="meta-value">
                            {new Date(payment.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        {payment.paymentType === 'SPLIT' && roommates.length > 0 && (
                          <div className="meta-item">
                            <span className="meta-label">Per Person</span>
                            <span className="meta-value highlight">
                              ${(payment.totalAmount / roommates.length).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="payment-actions">
                      <div className={`payment-status ${status.class}`}>
                        <span className="status-icon">{status.icon}</span>
                        <span className="status-text">{status.text}</span>
                      </div>
                      
                      <div className="action-buttons">
                        {!payment.isPaid && (
                          <Button 
                            variant="success"
                            size="sm"
                            onClick={() => handleMarkPaid(payment.rentId)}
                            disabled={payingRentId === payment.rentId}
                          >
                            {payingRentId === payment.rentId ? 'Paying...' : '✓ Pay'}
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePaymentDetails(payment.rentId)}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="payment-details-expanded">
                      <div className="details-header">Payment Breakdown</div>
                      
                      {payment.paymentType === 'SPLIT' && roommates.length > 0 ? (
                        <div className="split-breakdown">
                          <div className="breakdown-intro">
                            Split evenly among {roommates.length} roommate{roommates.length !== 1 ? 's' : ''}
                          </div>
                          <div className="roommate-list">
                            {roommates.map(roommate => (
                              <div key={roommate.userId} className="roommate-row">
                                <div className="roommate-info">
                                  <div className="roommate-avatar">
                                    {roommate.firstName?.[0]}{roommate.lastName?.[0]}
                                  </div>
                                  <div className="roommate-name">
                                    {roommate.firstName} {roommate.lastName}
                                  </div>
                                </div>
                                <div className="roommate-share">
                                  ${(payment.totalAmount / roommates.length).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="queue-breakdown">
                          <div className="breakdown-intro">
                            Rotating payment - one person pays the full amount
                          </div>
                          {roommates.length > 0 && (
                            <div className="roommate-list">
                              {roommates.map(roommate => (
                                <div key={roommate.userId} className="roommate-tag">
                                  <div className="roommate-avatar small">
                                    {roommate.firstName?.[0]}{roommate.lastName?.[0]}
                                  </div>
                                  {roommate.firstName} {roommate.lastName}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {payment.isPaid && payment.paidBy && (
                        <div className="paid-info">
                          <span className="paid-icon">✓</span>
                          Marked as paid by User #{payment.paidBy}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </PageLayout>
    </>
  );
}