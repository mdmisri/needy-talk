import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3010/api/auth/register', {
                username,
                password,
                isAdmin,
            });
            setMessage('User registered successfully');
            navigate('/login');
        } catch (err) {
            setMessage('Error registering user');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <div className="checkbox-container">
                    <label className="admin-text">Admin</label>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
