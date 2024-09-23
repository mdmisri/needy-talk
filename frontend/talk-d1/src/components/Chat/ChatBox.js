import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useConversation from '../../hooks/useConversation';
import Message from './Message';
import socket from './socket';
import './styles/ChatBox.css';

const ChatBox = ({ senderUsername, handleLogout }) => {
    const { receiverUsername } = useParams();
    const [newMessage, setNewMessage] = useState('');
    const { messages, sendMessage, handleTyping, isTyping } = useConversation(senderUsername, receiverUsername);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto scroll when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (senderUsername) {
            socket.emit('setUsername', senderUsername);
            socket.emit('userOnline', senderUsername);
        }

        return () => {
            if (senderUsername) {
                socket.emit('userOffline', senderUsername);
            }
        };
    }, [senderUsername]);

    const handleSendMessage = () => {
        if (newMessage.trim() && senderUsername && receiverUsername) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const Logout = () => {
        socket.emit('userOffline', senderUsername);
        handleLogout();
        navigate('/login'); // Assuming the login page is at /login
    };

    return (
        <div className='user-chat-page'>                                                                                                                                                                                    
            <div className="notification-text">
                Hey, you will be responded to within 12 hours!😁
            </div>
            <div className="chat-box">
                <div className="user-messages">
                    {messages.map((msg, index) => (
                        <Message key={index} message={msg} currentUser={senderUsername} />
                    ))}
                    {isTyping && <div className="typing-indicator">{receiverUsername} is typing...</div>}
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
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                    />
                    <button className='send-button' onClick={handleSendMessage}>Send</button>
                </div>
            </div>
            <button className="logout-button" onClick={Logout}>Logout</button>
        </div>
    );
};

export default ChatBox;
