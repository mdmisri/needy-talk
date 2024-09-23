import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import socket from '../components/Chat/socket';
import { getConversationId, createConversation } from '../conversationUtils'; // Ensure this path is correct

const useConversation = (senderUsername, receiverUsername) => {
    const [conversationId, setConversationId] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    // Fetch or create a conversation ID
    const fetchOrCreateConversationId = useCallback(async () => {
        if (senderUsername && receiverUsername) {
            console.log(`Fetching conversation for ${senderUsername} and ${receiverUsername}`); // Log the usernames

            try {
                let id = await getConversationId(senderUsername, receiverUsername);
                if (!id) {
                    id = await createConversation(senderUsername, receiverUsername);
                }
                setConversationId(id);
            } catch (error) {
                console.error("Failed to fetch or create conversation ID:", error);
            }
        }
    }, [senderUsername, receiverUsername]);

    useEffect(() => {
        fetchOrCreateConversationId();
    }, [fetchOrCreateConversationId]);

    useEffect(() => {
        if (!conversationId) return;

        // Define the listeners
        const messageListener = (message) => {
            if (message.conversationId === conversationId) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        };

        const typingListener = ({ conversationId: roomId, username }) => {
            console.log(`Typing event received for room: ${roomId}, username: ${username}`);

            if (roomId === conversationId && username === receiverUsername) {
                setIsTyping(true);
            }
        };

        const stopTypingListener = ({ conversationId: roomId, username }) => {
            console.log(`StopTyping event received for room: ${roomId}, username: ${username}`);

            if (roomId === conversationId && username === receiverUsername) {
                setIsTyping(false);
            }
        };
        const messageReadListener = ({ messageId, readBy }) => {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg._id === messageId
                        ? { ...msg, readBy }
                        : msg
                )
            );
        };

        // Join the room
        socket.emit('joinRoom', { username: senderUsername, room: conversationId });

        // Register the listeners
        socket.on('message', messageListener);
        socket.on('typing', typingListener);
        socket.on('stopTyping', stopTypingListener);
        socket.on('messageRead', messageReadListener);

        // Cleanup function
        return () => {
            socket.off('message', messageListener);
            socket.off('typing', typingListener);
            socket.off('stopTyping', stopTypingListener);
            socket.off('messageRead', messageReadListener);
            socket.emit('leaveRoom', { username: senderUsername, room: conversationId });
        };
    }, [conversationId, senderUsername, receiverUsername]);

    useEffect(() => {
        if (conversationId) {
            const fetchMessages = async (id) => {
                try {
                    const response = await axios.get(`http://localhost:3010/api/messages/${id}`);
                    setMessages(response.data.messages || []);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    setMessages([]);
                }
            };

            fetchMessages(conversationId);
        }
    }, [conversationId]);

    const sendMessage = async (messageContent) => {
        if (!messageContent || !conversationId) return;

        const messageData = {
            senderUsername,
            receiverUsername,
            message: messageContent,
            conversationId,
        };

        try {
            socket.emit('sendMessage', messageData);
            await axios.post('http://localhost:3010/api/messages', messageData);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleTyping = () => {
        if (conversationId) {
            socket.emit('typing', { conversationId, username: senderUsername });
            console.log(`Typing event emitted for conversationId: ${conversationId}, username: ${senderUsername}`);
            setTimeout(() => {
                socket.emit('stopTyping', { conversationId, username: senderUsername });
                console.log(`StopTyping ev  ent emitted for conversationId: ${conversationId}, username: ${senderUsername}`);
            }, 3000);
        }
    };
    

    return { messages, sendMessage, handleTyping, isTyping, setConversationId };
};

export default useConversation;
