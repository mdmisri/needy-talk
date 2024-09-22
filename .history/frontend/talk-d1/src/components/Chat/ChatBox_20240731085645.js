import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useConversation from '../../hooks/useConversation';
import Message from './Message';
import socket from './socket';
import './styles/ChatBox.css';

const ChatBox = ({ senderUsername }) => {
    const { receiverUsername } = useParams();
    const [newMessage, setNewMessage] = useState('');
    const { messages, sendMessage, handleTyping, isTyping, setConversationId } = useConversation(senderUsername, receiverUsername);
    const navigate = useNavigate();

    useEffect(() => {
        if (senderUsername) {
            console.log(`Sender Username: ${senderUsername}`);
            socket.emit('setUsername', senderUsername);
            socket.emit('userOnline', senderUsername);
        }

        return () => {
            if (senderUsername) {
                socket.emit('userOffline', senderUsername);
            }
        };
    }, [senderUsername]);

    useEffect(() => {
        if (receiverUsername) {
            console.log(`Receiver Username: ${receiverUsername}`);
        }
    }, [receiverUsername]);

    useEffect(() => {
        if (messages) {
            const chatContainer = document.querySelector('.messages');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }, [messages]);

    useEffect(() => {
        console.log(`isTyping: ${isTyping}`);
    }, [isTyping]);

    const handleSendMessage = () => {
        if (newMessage.trim() && senderUsername && receiverUsername) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    const handleLogout = () => {
        socket.emit('userOffline', senderUsername);
        navigate('/login'); // Assuming the login page is at /login
    };

    return (
        <>
            <div className="notification-text">
                You will be responded to within 12 hours
            </div>
            <div className="chatbox">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <Message key={index} message={msg} currentUser={senderUsername} />
                    ))}
                    {isTyping && <div className="typing-indicator">{receiverUsername} is typing...</div>}
                </div>
                <div className="input-area">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type a message..."
                    />
                    <button className='send' onClick={handleSendMessage}>Send</button>
                </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </>
    );
};

export default ChatBox;
