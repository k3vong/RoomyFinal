import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // toggle for eye icon
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', { username, password });
            const user = response.data;

            if (!user || !user.userId) {
                alert('Invalid username or password.');
                return;
            }

            localStorage.setItem('user', JSON.stringify(user));
            alert(`Welcome, ${user.firstName}!`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            alert('Invalid username or password.');
        }
    };

    return (
        <div className="login-page">
            <div className='wrapper'>
                <form onSubmit={handleLogin}>
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
                            type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span
                            className="icon eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="remember-forgot">
                    <label><input type="checkbox" /> Remember me</label>
                    <Link to="/forgot-password">Forgot password?</Link>
                    </div>


                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
