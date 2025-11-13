import React, { useState } from 'react';
import './SignUp.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Split name into first and last name
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName; // Use firstName if no last name
    
    // Generate username from email (part before @)
    const username = formData.email.split('@')[0];

    try {
      const response = await axios.post('http://localhost:8080/api/signup', {
        username: username,
        email: formData.email,
        password: formData.password,
        firstName: firstName,
        lastName: lastName
      });
      console.log('Sign up successful:', response.data);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Sign up error:', error);
      alert(error.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <h1>Sign Up</h1>

        <form onSubmit={handleSignUp}>
          <div className="signup-input-box">
            <input 
              type="text"
              name="name"
              placeholder="Username" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
            <span className="icon"><FaUser /></span>
          </div>

          <div className="signup-input-box">
            <input 
              type="email"
              name="email"
              placeholder="Email" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
            <span className="icon"><FaEnvelope /></span>
          </div>

          <div className="signup-input-box">
            <input 
              type="password"
              name="password"
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
            <span className="icon"><FaLock /></span>
          </div>

          <div className="signup-input-box">
            <input 
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password" 
              required 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span className="icon"><FaLock /></span>
          </div>

          <button type="submit">Sign Up</button>

          <div className="login-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;