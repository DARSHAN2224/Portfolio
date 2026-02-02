import express from 'express';
import * as kernelController from '../controllers/kernelController.js';

const router = express.Router();

// Public routes (AI chat accessible to all users)
router.post('/chat', kernelController.chat);
router.get('/status', kernelController.getSystemStatus);

export default router;
