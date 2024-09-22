import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useConversation from '../../hooks/useConversation';
import Message from './Message';
import socket from './socket';
import './styles/ChatBox.css';

const ChatBox = ({ senderUsername }) => {
    const { receiverUsername } = useParams();
    const [newMessage, setNewMessage] = useState('');
    const { messages, sendMessage, handleTyping, isTyping, setConversationId } = useConversation(senderUsername, receiverUsername);

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
            // Scroll to the bottom of the chat when new messages are added
            const chatContainer = document.querySelector('.messages');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }, [messages]);

    useEffect(() => {
        console.log(`isTyping: ${isTyping}`); // Log isTyping state changes
    }, [isTyping]);

    const handleSendMessage = () => {
        if (newMessage.trim() && senderUsername && receiverUsername) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
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
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
