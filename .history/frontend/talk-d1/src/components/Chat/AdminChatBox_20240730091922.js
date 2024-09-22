import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useConversation from '../../hooks/useConversation';
import Message from './Message';
import './styles/AdminChatBox.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3010');

const AdminChatBox = ({ adminUsername }) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const { messages, sendMessage, handleTyping, isTyping, setConversationId } = useConversation(adminUsername, currentUser?.username);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3010/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                alert("Failed to fetch users. Please try refreshing the page.");
            }
        };

        fetchUsers();

        // Connect to socket
        socket.connect();

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

        const handleDisconnect = () => {
            console.log('Disconnected from server. Attempting to reconnect...');
            socket.connect();
        };

        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('userRegistered');
            socket.off('statusUpdate');
            socket.off('disconnect', handleDisconnect);
            // Disconnect socket when component unmounts
            socket.disconnect();
        };
    }, [adminUsername]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSelectUser = async (user) => {
        setCurrentUser(user);
        try {
            const response = await axios.get(`http://localhost:3010/api/conversations/${adminUsername}/${user.username}`);
            setConversationId(response.data.conversationId);
        } catch (error) {
            console.error("Error fetching conversation:", error);
            if (error.response && error.response.status === 404) {
                try {
                    console.log("Conversation not found. Attempting to create a new one...");
                    const newConversation = await axios.post('http://localhost:3010/api/conversations', {
                        senderUsername: adminUsername,
                        receiverUsername: user.username
                    });
                    console.log("New conversation created:", newConversation.data);
                    setConversationId(newConversation.data._id);
                } catch (err) {
                    console.error("Error creating new conversation:", err);
                    console.log("Error details:", err.response ? err.response.data : "No response data");
                    alert("Failed to create a new conversation. Please try again later.");
                }
            } else {
                console.log("Error details:", error.response ? error.response.data : "No response data");
                alert("An error occurred while fetching the conversation. Please try again later.");
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
                        <span>{user.username}</span>
                        <span>{user.isOnline ? '🟢' : '⚪'}</span>
                    </div>
                ))}
            </div>
            <div className="chat-box">
                {currentUser ? (
                    <>
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <Message 
                                    key={index} 
                                    message={msg} 
                                    isAdmin={msg.sender === adminUsername}
                                />
                            ))}
                            {isTyping && <div className="typing-indicator">User is typing...</div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="input-area">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSendMessage();
                                }}
                                placeholder="Type a message..."
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <div>Select a user to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default AdminChatBox;