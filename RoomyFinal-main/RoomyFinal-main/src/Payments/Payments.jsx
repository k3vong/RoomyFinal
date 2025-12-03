import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../App';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input, { Select } from '../components/Input';
import './Payments.css';

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [apartmentData, setApartmentData] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [paymentQueue, setPaymentQueue] = useState([]);
  const [currentPayerId, setCurrentPayerId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    rentAmount: '',
    paymentType: 'SPLIT',
    rentDueDay: ''
  });
  
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      // Get user's apartment
      const aptResponse = await axios.get(
        `http://localhost:8080/api/residence/user/${user.userId}`
      );
      const apartmentId = aptResponse.data;
      
      if (apartmentId) {
        setUserApartmentId(apartmentId);
        
        // Get apartment details
        const apartmentResponse = await axios.get(
          `http://localhost:8080/api/apartments/${apartmentId}`
        );
        setApartmentData(apartmentResponse.data);
        
        // Get roommates
        const roommatesResponse = await axios.get(
          `http://localhost:8080/api/residence/apartment/${apartmentId}`
        );
        console.log('Roommates data:', roommatesResponse.data);
        setRoommates(roommatesResponse.data);
        
        // Get payment queue if it exists
        const queueResponse = await axios.get(
          `http://localhost:8080/api/payment-queue/${apartmentId}`
        );
        setPaymentQueue(queueResponse.data);
        
        // Get current payer for queue
        if (queueResponse.data.length > 0) {
          const currentPayerResponse = await axios.get(
            `http://localhost:8080/api/payment-queue/${apartmentId}/current-payer`
          );
          setCurrentPayerId(currentPayerResponse.data.userId);
        }
        
        // Set form data from apartment
        setFormData({
          rentAmount: apartmentResponse.data.rentAmount || '',
          paymentType: apartmentResponse.data.paymentType || 'SPLIT',
          rentDueDay: apartmentResponse.data.rentDueDay || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!userApartmentId) {
      showToast('You need to join an apartment first!', 'warning');
      return;
    }

    if (!formData.rentAmount || !formData.paymentType || !formData.rentDueDay) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    try {
      // Update apartment with payment info
      await axios.put(`http://localhost:8080/api/apartments/${userApartmentId}`, {
        ...apartmentData,
        rentAmount: parseFloat(formData.rentAmount),
        rentDueDay: parseInt(formData.rentDueDay),
        paymentType: formData.paymentType
      });

      // If payment type is QUEUE, initialize the queue
      if (formData.paymentType === 'QUEUE') {
        const allUserIds = roommates.map(r => r.userId);
        await axios.post('http://localhost:8080/api/payment-queue/initialize', {
          apartmentId: userApartmentId,
          userIds: allUserIds
        });
      }

      showToast('Payment settings saved!', 'success');
      setEditing(false);
      await fetchPaymentData();
    } catch (error) {
      console.error('Error saving payment settings:', error);
      showToast('Failed to save payment settings', 'error');
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
            <p>Loading payment information...</p>
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

  const totalParticipants = roommates.length;
  console.log('Total participants:', totalParticipants, 'Roommates:', roommates);
  
  // If no roommates, assume creator is the only participant (paying full amount)
  const effectiveParticipants = totalParticipants > 0 ? totalParticipants : 1;
  const amountPerPerson = formData.rentAmount
    ? (parseFloat(formData.rentAmount) / effectiveParticipants).toFixed(2)
    : '0.00';

  // If no roommates in queue, assume current user is the payer
  const currentPayer = currentPayerId 
    ? roommates.find(r => r.userId === currentPayerId)
    : (roommates.length === 0 ? { userId: user.userId, firstName: user.firstName, lastName: user.lastName } : null);

  const hasCompleteSettings = formData.rentAmount && formData.paymentType && formData.rentDueDay;

  // Handle case where user created apartment but isn't joined yet
  const handleJoinMyApartment = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/residence/join?userId=${user.userId}&apartmentId=${userApartmentId}`
      );
      showToast('Joined apartment successfully!', 'success');
      await fetchPaymentData();
    } catch (error) {
      console.error('Error joining apartment:', error);
      showToast('Failed to join apartment', 'error');
    }
  };

  return (
    <>
      <Navigation currentUser={user} onLogout={handleLogout} />
      <PageLayout
        title="💰 Rent Payments"
        subtitle="Configure and manage rent payment settings"
        actions={
          <div className="page-actions">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            {!editing && hasCompleteSettings && (
              <Button variant="primary" onClick={() => setEditing(true)}>
                ✏️ Edit Settings
              </Button>
            )}
          </div>
        }
      >
        {/* Payment Configuration Form */}
        {(!hasCompleteSettings || editing) && (
          <Card title="Payment Configuration" className="payment-config-card">
            <div className="config-form">
              <Input
                label="Total Rent Amount"
                type="number"
                name="rentAmount"
                placeholder="1200.00"
                value={formData.rentAmount}
                onChange={handleChange}
                step="0.01"
                required
                icon="💵"
                fullWidth
              />

              <Select
                label="Payment Type"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                fullWidth
              >
                <option value="SPLIT">Split Evenly</option>
                <option value="QUEUE">Rotating Queue</option>
              </Select>

              <Input
                label="Rent Due Day (1-31)"
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

              <div className="payment-type-info">
                {formData.paymentType === 'SPLIT' ? (
                  <div className="info-box split">
                    <div className="info-icon">👥</div>
                    <div className="info-text">
                      <strong>Split Payment</strong>
                      <p>Total rent is divided equally among all roommates. Each person pays their share.</p>
                    </div>
                  </div>
                ) : (
                  <div className="info-box queue">
                    <div className="info-icon">🔄</div>
                    <div className="info-text">
                      <strong>Rotating Queue</strong>
                      <p>Roommates take turns paying the full rent amount each month. The queue rotates automatically.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                {editing && (
                  <Button variant="outline" onClick={() => {
                    setEditing(false);
                    setFormData({
                      rentAmount: apartmentData.rentAmount || '',
                      paymentType: apartmentData.paymentType || 'SPLIT',
                      rentDueDay: apartmentData.rentDueDay || ''
                    });
                  }}>
                    Cancel
                  </Button>
                )}
                <Button variant="primary" onClick={handleSave} fullWidth={!editing}>
                  {editing ? 'Save Changes' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Payment Summary - Only show when settings are complete and not editing */}
        {hasCompleteSettings && !editing && (
          <>
            <Card className="payment-summary-card">
              <div className="summary-header">
                <div className="rent-amount-large">
                  <span className="currency">$</span>
                  {parseFloat(formData.rentAmount).toFixed(2)}
                </div>
                <div className="payment-type-badge">
                  {formData.paymentType === 'SPLIT' ? '👥 Split' : '🔄 Queue'}
                </div>
              </div>

              <div className="due-date-display">
                <span className="due-label">Due on the</span>
                <span className="due-day">{formData.rentDueDay}</span>
                <span className="due-suffix">
                  {formData.rentDueDay === '1' ? 'st' : 
                   formData.rentDueDay === '2' ? 'nd' : 
                   formData.rentDueDay === '3' ? 'rd' : 'th'} of each month
                </span>
              </div>
            </Card>

            {/* Split View */}
            {formData.paymentType === 'SPLIT' && (
              <Card className="payment-breakdown-card split-view">
                <h2 className="breakdown-title">💳 The Amount You Pay:</h2>
                <div className="your-amount">
                  <span className="currency">$</span>
                  {amountPerPerson}
                </div>
                <div className="breakdown-explanation">
                  Split evenly among {effectiveParticipants} {effectiveParticipants === 1 ? 'person' : 'roommates'}
                </div>

                {roommates.length > 0 ? (
                  <div className="roommates-breakdown">
                    <h3>All Participants:</h3>
                    <div className="roommate-list">
                      {roommates.map(roommate => (
                        <div key={roommate.userId} className="roommate-item">
                          <div className="roommate-info">
                            <div className="roommate-avatar">
                              {roommate.firstName?.[0]}{roommate.lastName?.[0]}
                            </div>
                            <div className="roommate-details">
                              <div className="roommate-name">
                                {roommate.firstName} {roommate.lastName}
                                {roommate.userId === user.userId && (
                                  <span className="you-badge">You</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="roommate-amount">${amountPerPerson}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="roommates-breakdown">
                    <h3>Participant:</h3>
                    <div className="roommate-list">
                      <div className="roommate-item">
                        <div className="roommate-info">
                          <div className="roommate-avatar">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div className="roommate-details">
                            <div className="roommate-name">
                              {user.firstName} {user.lastName}
                              <span className="you-badge">You</span>
                            </div>
                          </div>
                        </div>
                        <div className="roommate-amount">${amountPerPerson}</div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Queue View */}
            {formData.paymentType === 'QUEUE' && (
              <Card className="payment-breakdown-card queue-view">
                <h2 className="breakdown-title">🔔 Rent Due:</h2>
                {currentPayer ? (
                  <>
                    <div className="current-payer-display">
                      <div className="payer-avatar-large">
                        {currentPayer.firstName?.[0]}{currentPayer.lastName?.[0]}
                      </div>
                      <div className="payer-info">
                        <div className="payer-name">
                          {currentPayer.firstName} {currentPayer.lastName}
                          {currentPayer.userId === user.userId && (
                            <span className="you-badge-large">That's You!</span>
                          )}
                        </div>
                        <div className="payer-amount">
                          <span className="currency">$</span>
                          {parseFloat(formData.rentAmount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="queue-explanation">
                      {currentPayer.userId === user.userId 
                        ? roommates.length === 0 
                          ? "You're the only person in this apartment, so you pay the full rent"
                          : "It's your turn to pay the full rent this month"
                        : "This person is responsible for paying the full rent this month"}
                    </div>
                  </>
                ) : (
                  <div className="no-payer-message">
                    Queue not initialized. Please save your settings.
                  </div>
                )}

                {paymentQueue.length > 0 && (
                  <div className="queue-order">
                    <h3>Rotation Order:</h3>
                    <div className="queue-list">
                      {paymentQueue.map((queueItem, index) => {
                        const roommate = roommates.find(r => r.userId === queueItem.userId);
                        const isCurrent = queueItem.userId === currentPayerId;
                        return roommate ? (
                          <div 
                            key={queueItem.queueId} 
                            className={`queue-item ${isCurrent ? 'current' : ''}`}
                          >
                            <div className="queue-position">#{index + 1}</div>
                            <div className="roommate-avatar small">
                              {roommate.firstName?.[0]}{roommate.lastName?.[0]}
                            </div>
                            <div className="queue-item-name">
                              {roommate.firstName} {roommate.lastName}
                              {roommate.userId === user.userId && (
                                <span className="you-badge">You</span>
                              )}
                            </div>
                            {isCurrent && <div className="current-indicator">● Current</div>}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </>
        )}

        {/* Roommates Info */}
        {roommates.length > 0 && hasCompleteSettings && !editing && (
          <Card className="roommates-info-card">
            <h3>🏠 Apartment Roommates ({roommates.length})</h3>
            <div className="roommates-simple-list">
              {roommates.map(roommate => (
                <div key={roommate.userId} className="roommate-chip">
                  <div className="roommate-avatar-small">
                    {roommate.firstName?.[0]}{roommate.lastName?.[0]}
                  </div>
                  <span>
                    {roommate.firstName} {roommate.lastName}
                    {roommate.userId === user.userId && ' (You)'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </PageLayout>
    </>
  );
}