import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Profile from '../models/Profile.js';
import llamaService from '../services/llama.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * AI Kernel chat endpoint
 * Accepts user message, returns AI response with optional command
 */
export const chat = asyncHandler(async (req, res) => {
  const { message, context: contextType } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message required' });
  }

  // Build context from database
  const context = {};

  if (!contextType || contextType === 'all' || contextType === 'projects') {
    context.projects = await Project.find({ isVisible: true })
      .select('title domain description')
      .limit(10);
  }

  if (!contextType || contextType === 'all' || contextType === 'skills') {
    context.skills = await Skill.find({ isVisible: true })
      .select('name category proficiency')
      .limit(10);
  }

  if (!contextType || contextType === 'all' || contextType === 'profile') {
    context.profile = await Profile.findOne().select(
      'name title bio systemDescription'
    );
  }

  // Query Llama AI
  const result = await llamaService.chat(message, context);

  // Log to terminal (store in memory, could also store in DB)
  console.log(`[KERNEL] User: ${message}`);
  console.log(`[KERNEL] Response: ${result.response.substring(0, 100)}...`);
  if (result.command) {
    console.log(`[KERNEL] Command: ${JSON.stringify(result.command)}`);
  }

  res.json({
    response: result.response,
    command: result.command,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get system status
 */
export const getSystemStatus = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();

  res.json({
    status: profile?.systemStatus || 'OPTIMAL',
    uptime: profile?.uptime || '99.9%',
    message: 'DARSHAN-OS kernel operational',
  });
});
