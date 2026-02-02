import express from 'express';
import * as profileController from '../controllers/profileController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', profileController.getProfile);

// Admin routes
router.patch('/', verifyToken, isAdmin, profileController.updateProfile);

export default router;
