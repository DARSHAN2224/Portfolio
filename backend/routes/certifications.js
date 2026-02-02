import express from 'express';
import * as certificationController from '../controllers/certificationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', certificationController.getCertifications);
router.get('/:id', certificationController.getCertificationById);

// Admin routes
router.post(
  '/',
  verifyToken,
  isAdmin,
  certificationController.createCertification
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  certificationController.updateCertification
);
router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  certificationController.deleteCertification
);

export default router;
