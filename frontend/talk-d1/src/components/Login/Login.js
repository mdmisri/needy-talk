import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const Login = ({ setUser, setUsername, setIsAdmin, setAdminUsername }) => {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3010/api/auth/login', {
                username,
                password,
            });

            const userData = response.data;
            setUser(userData);
            setUsername(username);
            setIsAdmin(userData.isAdmin);
            
            if (userData.isAdmin) {
                setAdminUsername(username);
            }

            navigate('/AdminSelection');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={togglePasswordVisibility}
                            className="password-toggle-icon"
                        />
                    
                    {/* <p className="password-requirement">Password must be at least 6 characters</p> */}
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="not-a-user">
                    Not a user? <Link to="/register" className="register-link">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;