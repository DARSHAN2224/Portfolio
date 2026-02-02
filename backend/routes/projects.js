import express from 'express';
import * as projectController from '../controllers/projectController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);

// Admin routes
router.post('/', verifyToken, isAdmin, projectController.createProject);
router.put('/:id', verifyToken, isAdmin, projectController.updateProject);
router.delete('/:id', verifyToken, isAdmin, projectController.deleteProject);

// Admin utility routes
router.patch(
  '/:id/toggle-visibility',
  verifyToken,
  isAdmin,
  projectController.toggleProjectVisibility
);
router.patch(
  '/:id/toggle-featured',
  verifyToken,
  isAdmin,
  projectController.markAsFeatured
);

export default router;
