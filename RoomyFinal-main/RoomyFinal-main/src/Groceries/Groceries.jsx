import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../App';
import Navigation from '../components/Navigation';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input, { Select } from '../components/Input';
import './Groceries.css';

export default function Groceries() {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userApartmentId, setUserApartmentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [purchasingId, setPurchasingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: ''
  });
  
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUserApartmentAndGroceries();
  }, []);

  const fetchUserApartmentAndGroceries = async () => {
    try {
      // Get user's apartment
      const aptResponse = await axios.get(
        `http://localhost:8080/api/residence/user/${user.userId}`
      );
      const apartmentId = aptResponse.data;
      
      if (apartmentId) {
        setUserApartmentId(apartmentId);
        // Fetch groceries for that apartment
        const groceriesResponse = await axios.get(
          `http://localhost:8080/api/groceries/${apartmentId}`
        );
        setGroceries(groceriesResponse.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groceries:', error);
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
      await axios.post('http://localhost:8080/api/groceries', {
        apartmentId: userApartmentId,
        addedBy: user.userId,
        name: formData.name,
        quantity: formData.quantity,
        category: formData.category,
        purchased: false
      });
      showToast('Grocery item added!', 'success');
      setShowForm(false);
      setFormData({ name: '', quantity: '', category: '' });
      await fetchUserApartmentAndGroceries();
    } catch (error) {
      console.error('Error adding grocery:', error);
      showToast('Failed to add grocery item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPurchased = async (itemId) => {
    setPurchasingId(itemId);
    try {
      await axios.put(`http://localhost:8080/api/groceries/${itemId}/purchase`);
      await fetchUserApartmentAndGroceries();
    } catch (error) {
      console.error('Error marking purchased:', error);
      showToast('Failed to mark item as purchased', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    setDeletingId(itemId);
    try {
      await axios.delete(`http://localhost:8080/api/groceries/${itemId}`);
      await fetchUserApartmentAndGroceries();
    } catch (error) {
      console.error('Error deleting grocery:', error);
      showToast('Failed to delete item', 'error');
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
            <p>Loading groceries...</p>
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
              <p>You need to join an apartment before you can manage groceries.</p>
              <Button variant="primary" size="lg" onClick={() => navigate('/apartments')}>
                Find an Apartment
              </Button>
            </div>
          </Card>
        </PageLayout>
      </>
    );
  }

  const unpurchasedItems = groceries.filter(g => !g.purchased);
  const purchasedItems = groceries.filter(g => g.purchased);

  return (
    <>
      <Navigation currentUser={user} onLogout={handleLogout} />
      <PageLayout
        title="🛒 Grocery List"
        subtitle="Shared shopping list for your apartment"
        actions={
          <div className="page-actions">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <Button 
              variant="primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Item'}
            </Button>
          </div>
        }
      >
        {/* Add Item Form */}
        {showForm && (
          <Card title="Add Grocery Item" className="grocery-form-card">
            <form onSubmit={handleSubmit} className="grocery-form">
              <Input
                label="Item Name"
                type="text"
                name="name"
                placeholder="Milk, Eggs, Bread..."
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <Input
                label="Quantity"
                type="text"
                name="quantity"
                placeholder="1 gallon, 2 lbs, etc."
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
              />

              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
              >
                <option value="">Select Category</option>
                <option value="Dairy">Dairy</option>
                <option value="Produce">Produce</option>
                <option value="Meat">Meat</option>
                <option value="Grains">Grains</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Other">Other</option>
              </Select>

              <Button type="submit" variant="primary" fullWidth disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Item'}
              </Button>
            </form>
          </Card>
        )}

        {/* Needed Items */}
        <Card className="grocery-section">
          <h2>📝 Shopping List ({unpurchasedItems.length} items)</h2>
          <div className="groceries-list">
            {unpurchasedItems.length === 0 ? (
              <div className="empty-state">
                <p>All items purchased! 🎉</p>
              </div>
            ) : (
              unpurchasedItems.map((item) => (
                <div key={item.itemId} className="grocery-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    {item.quantity && <p className="quantity">{item.quantity}</p>}
                    {item.category && <span className="category-badge">{item.category}</span>}
                  </div>
                  <div className="item-actions">
                    <Button 
                      variant="success"
                      size="sm"
                      onClick={() => handleMarkPurchased(item.itemId)}
                      disabled={purchasingId === item.itemId || deletingId === item.itemId}
                    >
                      {purchasingId === item.itemId ? '...' : '✓'}
                    </Button>
                    <Button 
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.itemId)}
                      disabled={purchasingId === item.itemId || deletingId === item.itemId}
                    >
                      {deletingId === item.itemId ? '...' : '✕'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Purchased Items */}
        {purchasedItems.length > 0 && (
          <Card className="grocery-section purchased-section">
            <h2>✓ Purchased ({purchasedItems.length} items)</h2>
            <div className="groceries-list">
              {purchasedItems.map((item) => (
                <div key={item.itemId} className="grocery-item purchased">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    {item.quantity && <p className="quantity">{item.quantity}</p>}
                    {item.category && <span className="category-badge">{item.category}</span>}
                  </div>
                  <div className="item-actions">
                    <Button 
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.itemId)}
                      disabled={deletingId === item.itemId}
                    >
                      {deletingId === item.itemId ? '...' : '✕'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </PageLayout>
    </>
  );
}
