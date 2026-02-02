import express from 'express';
import * as skillController from '../controllers/skillController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', skillController.getSkills);
router.get('/:id', skillController.getSkillById);

// Admin routes
router.post('/', verifyToken, isAdmin, skillController.createSkill);
router.put('/:id', verifyToken, isAdmin, skillController.updateSkill);
router.delete('/:id', verifyToken, isAdmin, skillController.deleteSkill);

export default router;
