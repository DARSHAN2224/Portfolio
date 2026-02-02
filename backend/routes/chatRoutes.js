const express = require('express');
const ChatSession = require('../models/ChatSession');

const router = express.Router();

// POST /api/chat/sync
// Syncs chat history from frontend to backend
router.post('/sync', async (req, res) => {
    const { sessionId, messages, userAgent } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!sessionId || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid payload. sessionId and messages array required.' });
    }

    try {
        // Upsert the session
        const session = await ChatSession.findOneAndUpdate(
            { sessionId },
            {
                $set: {
                    ipAddress,
                    userAgent,
                    lastUpdated: new Date(),
                    messages // Replace messages with latest state (or you could append, but replacement ensures sync)
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, sessionId: session.sessionId });
    } catch (error) {
        console.error('Chat Sync Error:', error);
        res.status(500).json({ error: 'Failed to sync chat session' });
    }
});

const chatController = require('../controllers/chatController');

// POST /api/chat/ask
// Get AI response
router.post('/ask', chatController.askAi);

module.exports = router;
