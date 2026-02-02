import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

// Setup route (create initial admin, should be protected in production)
router.post('/setup', authController.createAdminUser);

export default router;
