import axios from 'axios';

export const getConversationId = async (senderUsername, receiverUsername) => {
    try {
        const response = await axios.get(`http://localhost:3010/api/conversations/${senderUsername}/${receiverUsername}`);
        

        return response.data.conversationId; 
    } catch (error) {
        console.error('Error fetching conversation ID:', error);
        throw error;
    }
};

export const createConversation = async (senderUsername, receiverUsername) => {
    try {
        const response = await axios.post('http://localhost:3010/api/conversations', { senderUsername, receiverUsername });
        return response.data.conversationId;
    } catch (error) {
        console.error('Error creating conversation:', error);
        return null;
    }
};
