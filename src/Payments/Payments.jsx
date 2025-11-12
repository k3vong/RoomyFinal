import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payments.css';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [formData, setFormData] = useState({
    dueDate: '',
    totalAmount: '',
    paymentType: 'QUEUE'
  });
  
  const navigate = useNavigate();
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
      alert('You need to join an apartment first!');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/rent', {
        apartmentId: userApartmentId,
        dueDate: formData.dueDate,
        totalAmount: parseFloat(formData.totalAmount),
        paymentType: formData.paymentType,
        paidBy: null,
        isPaid: false
      });
      alert('Payment added successfully!');
      setShowForm(false);
      setFormData({ dueDate: '', totalAmount: '', paymentType: 'QUEUE' });
      fetchUserApartmentAndPayments();
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Failed to add payment');
    }
  };

  const handleMarkPaid = async (rentId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/rent/${rentId}/pay?userId=${user.userId}`
      );
      alert('Payment marked as paid!');
      fetchUserApartmentAndPayments();
    } catch (error) {
      console.error('Error marking payment:', error);
      alert('Failed to mark payment as paid');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="payments-container">
        <div className="loading">Loading payments...</div>
      </div>
    );
  }

  if (!userApartmentId) {
    return (
      <div className="payments-container">
        <nav className="payments-nav">
          <div className="logo" onClick={() => navigate('/search')}>Roomy</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
        <div className="no-apartment-state">
          <div className="empty-icon">🏠</div>
          <h2>No Apartment Found</h2>
          <p>You need to join an apartment before you can manage payments.</p>
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
    <div className="payments-container">
      {/* Navigation Bar */}
      <nav className="payments-nav">
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
      <div className="payments-content">
        <div className="payments-header">
          <h1>Rent Payments</h1>
          <p>Track and manage rent payments</p>
        </div>

        <div className="payments-actions">
          <button 
            className="create-payment-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Payment'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="payment-form-card">
            <h2>Add New Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Amount *</label>
                <input
                  type="number"
                  name="totalAmount"
                  placeholder="2000.00"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Type *</label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  required
                >
                  <option value="QUEUE">Rotating (Queue)</option>
                  <option value="SPLIT">Split Evenly</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">
                Add Payment
              </button>
            </form>
          </div>
        )}

        {/* Payments List */}
        <div className="payments-grid">
          {payments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <h3>No payments yet</h3>
              <p>Add your first payment to get started!</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div 
                key={payment.rentId} 
                className={`payment-card ${payment.isPaid ? 'paid' : ''}`}
              >
                <div className="payment-header">
                  <h3>${payment.totalAmount?.toFixed(2)}</h3>
                  {payment.isPaid ? (
                    <span className="paid-badge">✓ Paid</span>
                  ) : (
                    <span className="unpaid-badge">Unpaid</span>
                  )}
                </div>
                
                <div className="payment-details">
                  <p><strong>Due Date:</strong> {new Date(payment.dueDate).toLocaleDateString()}</p>
                  <p><strong>Type:</strong> {payment.paymentType === 'QUEUE' ? 'Rotating' : 'Split Evenly'}</p>
                  {payment.isPaid && payment.paidBy && (
                    <p><strong>Paid By:</strong> User #{payment.paidBy}</p>
                  )}
                </div>
                
                {!payment.isPaid && (
                  <button 
                    onClick={() => handleMarkPaid(payment.rentId)}
                    className="mark-paid-btn"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}