const aiService = require('../services/aiService');
const ChatSession = require('../models/ChatSession');

exports.askAi = async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        // Get AI Response
        const response = await aiService.generateResponse(message);

        // Save Interactions (optional, already handled by frontend sync but good for redundancy)
        // For now, we rely on the explicit 'sync' endpoint for full history to keep this fast.

        res.json(response);

    } catch (error) {
        console.error('Chat Controller Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
