import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                username,
                password
            });
            console.log('Login successful:', response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/search');
        } catch (error) {
            console.error('Login error:', error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="login-page">  {/* ✅ Add this wrapper */}
            <div className='wrapper'> 
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>

                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder='Username' 
                            required 
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                        />
                        <span className="icon"><FaUser /></span>
                    </div>

                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder='Password' 
                            required
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span className="icon"><FaLock /></span>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" /> Remember me</label>
                        <a href="#"> Forgot password?</a>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p> Don't have an account? <Link to="/register">Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>  
    );
};

export default Login;