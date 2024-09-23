import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../Chat/socket';
import './Login.css';

const Login = ({ setUser, setUsername, setIsAdmin, setAdminUsername }) => {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
                setAdminUsername(username); // Set the admin username
            }

            socket.emit('userOnline', username);
            navigate('/home');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
