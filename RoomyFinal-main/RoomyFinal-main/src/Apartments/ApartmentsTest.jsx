import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApartmentsTest() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Apartments Page Test</h1>
      <p>If you can see this, the route is working!</p>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
}
