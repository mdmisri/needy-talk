import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ChatBox from './components/Chat/ChatBox';
import AdminChatBox from './components/Chat/AdminChatBox';
import ChatStart from './components/Chat/ChatStart';
import AdminSelection from './components/Chat/AdminSelection';
import socket from './components/Chat/socket';

const App = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminUsername, setAdminUsername] = useState(null);
    const [redirectToChat, setRedirectToChat] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (username) {
                socket.emit('userOffline', username);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [username]);

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate('/admin-chat');
            } else if (redirectToChat) {
                navigate(`/chat/${adminUsername}`);
            } else {
                navigate('/home');
            }
        }
    }, [user, isAdmin, redirectToChat, adminUsername, navigate]);

    const handleLogout = () => {
        socket.emit('userOffline', username);
        setUser(null);
        setUsername('');
        setIsAdmin(false);
        setAdminUsername(null);
        setRedirectToChat(false);
        navigate('/login');
    };

    const handleAdminSelection = (selectedAdminUsername) => { 
        setAdminUsername(selectedAdminUsername);
        setRedirectToChat(true);
    };

    return (
        <div>
            <Routes>
                <Route path="/login" element={<Login setUser={setUser} setUsername={setUsername} setIsAdmin={setIsAdmin} setAdminUsername={setAdminUsername} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={!isAdmin ? <ChatStart username={username} onAdminSelect={handleAdminSelection} /> : <AdminChatBox adminUsername={username} handleAdminSelection={handleAdminSelection} />} />
                <Route path="/admin-chat" element={<AdminChatBox adminUsername={username} handleAdminSelection={handleAdminSelection} />} />
                <Route path="/chat/:receiverUsername" element={user ? <ChatBox senderUsername={username} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
                {/* Default route for the root path */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
};

export default App;
