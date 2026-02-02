import express from 'express';
import * as experienceController from '../controllers/experienceController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', experienceController.getExperience);
router.get('/:id', experienceController.getExperienceById);

// Admin routes
router.post('/', verifyToken, isAdmin, experienceController.createExperience);
router.put('/:id', verifyToken, isAdmin, experienceController.updateExperience);
router.delete('/:id', verifyToken, isAdmin, experienceController.deleteExperience);

export default router;
