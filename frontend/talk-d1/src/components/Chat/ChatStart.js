import React, { useState } from 'react';
import AdminSelection from './AdminSelection';
import ChatBox from './ChatBox';
import axios from 'axios';

const ChatStart = ({ username, onAdminSelect }) => {
    const [adminUsername, setAdminUsername] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);

    const handleSelectAdmin = async (admin) => {
        setAdminUsername(admin);
        try {
            const response = await axios.post('http://localhost:3010/api/conversations/start-chat', {
                username,
                adminUsername: admin
            });
            setConversationId(response.data.conversationId);
            fetchMessages(response.data.conversationId);
            onAdminSelect(admin); // Notify the parent to handle redirection
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };
    
    const fetchMessages = async (conversationId) => {
        try {
            const response = await axios.get(`http://localhost:3010/api/messages/${conversationId}`);
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <div>
            {!adminUsername ? (
                <AdminSelection onSelectAdmin={handleSelectAdmin} />
            ) : (
                <ChatBox conversationId={conversationId} messages={messages} />
            )}
        </div>
    );
};

export default ChatStart;
