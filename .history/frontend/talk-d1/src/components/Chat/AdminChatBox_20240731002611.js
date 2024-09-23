import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useConversation from '../../hooks/useConversation';
import Message from './Message';
import './styles/AdminChatBox.css';
import socket from './socket';

const AdminChatBox = ({ adminUsername }) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    const { messages, sendMessage, handleTyping, isTyping, setConversationId } = useConversation(adminUsername, currentUser?.username);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3010/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();

        socket.on('userRegistered', (newUser) => {
            setUsers((prevUsers) => [...prevUsers, newUser]);
        });

        socket.on('statusUpdate', (statusUpdate) => {
            setUsers((prevUsers) =>
                prevUsers.map(user =>
                    user.username === statusUpdate.username
                        ? { ...user, isOnline: statusUpdate.isOnline }
                        : user
                )
            );
        });

        return () => {
            socket.off('userRegistered');
            socket.off('statusUpdate');
        };
    }, [adminUsername]);

    const handleSelectUser = async (user) => {
        setCurrentUser(user);
        try {
            const response = await axios.get(`http://localhost:3010/api/conversations/${adminUsername}/${user.username}`);
            setConversationId(response.data.conversationId);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                try {
                    const newConversation = await axios.post('http://localhost:3010/api/conversations', {
                        senderUsername: adminUsername,
                        receiverUsername: user.username
                    });
                    setConversationId(newConversation.data._id);
                } catch (err) {
                    console.error("Error creating new conversation:", err);
                }
            } else {
                console.error("Error fetching conversation:", error);
            }
        }
    };

    const handleSendMessage = () => {
        if (newMessage && currentUser) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="admin-chat-container">
            <div className="user-tabs">
                {users.map(user => (
                    <div
                        key={user.username}
                        className={`user-tab ${currentUser?.username === user.username ? 'active' : ''}`}
                        onClick={() => handleSelectUser(user)}
                    >
                        {user.username} {user.isOnline ? '🟢' : '⚪'}
                    </div>
                ))}
            </div>
            <div className="chat-box">
                {currentUser ? (
                    <>
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <Message key={index} message={msg} currentUser={adminUsername} />
                            ))}
                            {isTyping && <div className="typing-indicator">User is typing...</div>}
                        </div>
                        <div className='inputmsg'>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                                handleTyping();
                            }}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </>
                ) : (
                    <div>Select a user to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default AdminChatBox;