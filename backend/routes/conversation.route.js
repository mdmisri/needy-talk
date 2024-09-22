import express from 'express';
import { createConversation, getConversationId, initiateConversation , startChat} from '../controllers/conversation.controller.js';
const router = express.Router();

// Create a new conversation
router.post('/', createConversation);

// Get conversation ID by sender and receiver usernames
router.get('/:senderUsername/:receiverUsername', getConversationId);

// Start a chat with an admin based on gender preference
// router.post('/start-chat', async (req, res) => {
//     const { userId, adminUsername } = req.body;

//     try {
//         // Check if a conversation already exists
//         let conversation = await Conversation.findOne({
//             participants: { $all: [userId, adminUsername] }
//         });

//         if (!conversation) {
//             // If no conversation exists, create a new one
//             conversation = new Conversation({
//                 participants: [userId, adminUsername],
//                 messages: []
//             });
//             await conversation.save();
//         }

//         res.json({ _id: conversation._id });
//     } catch (error) {
//         console.error('Error starting chat:', error);
//         res.status(500).send('Server error');
//     }
// });

// Start a chat with an admin based on username
router.post('/start-chat', startChat);
export default router;
