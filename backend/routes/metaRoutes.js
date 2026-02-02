const express = require('express');
const SystemConfig = require('../models/SystemConfig');
const ChatSession = require('../models/ChatSession');

const router = express.Router();

// GET /api/meta/config/:key
// Get a specific config value
router.get('/config/:key', async (req, res) => {
    try {
        const config = await SystemConfig.findOne({ key: req.params.key });
        if (!config) {
            return res.status(404).json({ error: 'Config not found' });
        }
        res.json(config);
    } catch (error) {
        console.error('Config Fetch Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/meta/config
// Update or Create a config value (Admin only - middleware to be added later)
router.post('/config', async (req, res) => {
    const { key, value, description } = req.body;
    try {
        const config = await SystemConfig.findOneAndUpdate(
            { key },
            { value, description },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json(config);
    } catch (error) {
        console.error('Config Update Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/meta/trends
// Analyze chat history to find trending topics
// GET /api/meta/trends
// Analyze chat history to find trending topics (Cached Monthly)
router.get('/trends', async (req, res) => {
    try {
        // 1. Check Cache
        const cache = await SystemConfig.findOne({ key: 'trend_cache' });
        const lastRun = await SystemConfig.findOne({ key: 'last_trend_analysis' });

        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        let shouldRefresh = !cache || !lastRun;
        if (lastRun && (now - new Date(lastRun.value) > thirtyDays)) {
            shouldRefresh = true;
        }

        if (!shouldRefresh) {
            return res.json(cache.value);
        }

        // 2. Run Analysis (if cache expired or missing)
        console.log("Refreshing Trends via AI...");
        const ChatSession = require('../models/ChatSession');
        const aiService = require('../services/aiService');

        // Default Trends (Fallback if no data or AI fails)
        const DEFAULT_TRENDS = [
            { word: "System Optimization", count: 9 },
            { word: "Neural Interface", count: 8 },
            { word: "React Rendering", count: 7 },
            { word: "API Latency", count: 5 }
        ];

        // Aggregate recent messages
        const sessions = await ChatSession.find({}, 'messages').sort({ createdAt: -1 }).limit(50); // Limit to recent 50 sessions for context
        let allText = "";
        sessions.forEach(session => {
            session.messages.forEach(msg => {
                if (msg.sender === 'user') {
                    allText += " " + msg.text;
                }
            });
        });

        if (!allText.trim()) {
            console.log("No chat history found. Using default trends.");
            return res.json(DEFAULT_TRENDS);
        }

        // AI Request
        const prompt = `
            Analyze the following user chat history and extract the top 3 weirdest or most interesting topics/trends.
            Return ONLY a JSON array of objects with keys "word" (the sentence/topic) and "count" (relevance score 1-10).
            Limit the "word" to a short snippet (max 5 words).
            Example: [{"word": "Asking about React", "count": 10}, {"word": "Project delays", "count": 8}]
            
            Chat History: ${allText.substring(0, 5000)}
        `;

        let trends = [];
        try {
            const aiResponse = await aiService.generateResponse(prompt);

            // Handle various AI return formats (array vs object)
            if (Array.isArray(aiResponse)) {
                trends = aiResponse;
            } else if (aiResponse.trends) {
                trends = aiResponse.trends;
            } else if (aiResponse.text) {
                // Fallback if it returns text
                try {
                    trends = JSON.parse(aiResponse.text);
                } catch (e) {
                    trends = DEFAULT_TRENDS;
                }
            }
        } catch (aiError) {
            console.error("AI Trend Gen Failed:", aiError);
            trends = DEFAULT_TRENDS;
        }

        if (!trends || trends.length === 0) {
            trends = DEFAULT_TRENDS;
        }

        // 3. Update Cache
        await SystemConfig.findOneAndUpdate(
            { key: 'trend_cache' },
            { value: trends, description: 'Cached monthly AI trends' },
            { upsert: true }
        );

        await SystemConfig.findOneAndUpdate(
            { key: 'last_trend_analysis' },
            { value: now.toISOString(), description: 'Timestamp of last trend analysis' },
            { upsert: true }
        );

        res.json(trends);

    } catch (error) {
        console.error('Trends Analysis Error:', error);
        // Fallback to defaults
        res.json([
            { word: "System Error", count: 0 },
            { word: "Check Logs", count: 0 }
        ]);
    }
});

module.exports = router;
