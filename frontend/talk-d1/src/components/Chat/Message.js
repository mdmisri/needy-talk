import React from 'react';
import './styles/Message.css'; // Ensure styles are imported

const Message = ({ message, currentUser }) => {
    return (
        <div className={`message ${message.senderUsername === currentUser ? 'sent' : 'received'}`}>
            <strong>{message.senderUsername}:</strong> {message.message}
            {/* Display read receipt */}
            {Array.isArray(message.readBy) && message.readBy.includes(currentUser) && (
                <span className="read-receipt">✔</span>
            )}
        </div>
    );
};

export default Message;
