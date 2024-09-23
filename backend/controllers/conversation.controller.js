import Conversation from "../models/Conversation.js";
import mongoose from "mongoose";
import User from "../models/User.js";
// Create conversation
export const createConversation = async (req, res) => {
    const { senderUsername, receiverUsername } = req.body;

    try {
        // Find users by usernames
        const sender = await User.findOne({ username: senderUsername });
        const receiver = await User.findOne({ username: receiverUsername });
        console.log("sender backend is",sender)
        console.log("rcv backend is",receiver)

        

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create conversation with ObjectId
        let conversation = await Conversation.findOne({
            participants: { $all: [sender._id, receiver._id] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [sender._id, receiver._id],
            });
            await conversation.save();
        }
        res.status(200).json({ conversationId: conversation._id });
    } catch (error) {
        res.status(500).json({ error: 'Error creating conversation' });
    }
};

// Get conversation ID
export const getConversationId = async (req, res) => {
    const { senderUsername, receiverUsername } = req.params;
   

    try {
        // Find users by usernames
        const sender = await User.findOne({ username: senderUsername });
        const receiver = await User.findOne({ username: receiverUsername });
        console.log("sender backend is",sender)
        console.log("rcv backend is",receiver)
    

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [sender._id, receiver._id] }
        });

        if (conversation) {
            return res.status(200).json({ conversationId: conversation._id });
        }

        return res.status(404).json({ error: 'Conversation not found' });
    } catch (error) {
        console.error("Error fetching conversation ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const initiateConversation = async (userId, genderPreference) => {
    try {
        // Find the admin based on gender preference
        const admin = await User.findOne({ isAdmin: true, gender: genderPreference });

        if (!admin) {
            throw new Error('No available admin of the selected gender.');
        }

        // Check if a conversation already exists between the user and the selected admin
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, admin._id] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, admin._id],
                genderPreference: genderPreference // Save gender preference in conversation
            });
            await conversation.save();
        }

        return conversation;
    } catch (error) {
        throw new Error('Error initiating conversation: ' + error.message);
    }
};

// controllers/conversation.controller.js
export const startChat = async (req, res) => {
    const { username, adminUsername } = req.body;

    try {
        const user = await User.findOne({ username });
        const admin = await User.findOne({ username: adminUsername });

        if (!user || !admin) {
            return res.status(404).json({ error: 'User or admin not found' });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [user._id, admin._id] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [user._id, admin._id]
            });
            await conversation.save();
        }

        res.json({ conversationId: conversation._id });
    } catch (error) {
        console.error('Error starting chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

    