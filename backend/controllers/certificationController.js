import Certification from '../models/Certification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all certifications
 */
export const getCertifications = asyncHandler(async (req, res) => {
  const { category, visible } = req.query;

  const filter = { isVisible: visible !== 'false' };
  if (category) filter.category = category;

  const certifications = await Certification.find(filter)
    .sort({ date: -1 })
    .exec();

  res.json(certifications);
});

/**
 * Get single certification
 */
export const getCertificationById = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);

  if (!certification) {
    return res.status(404).json({ message: 'Certification not found' });
  }

  res.json(certification);
});

/**
 * Create certification (admin only)
 */
export const createCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.create(req.body);
  res.status(201).json(certification);
});

/**
 * Update certification (admin only)
 */
export const updateCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!certification) {
    return res.status(404).json({ message: 'Certification not found' });
  }

  res.json(certification);
});

/**
 * Delete certification (admin only)
 */
export const deleteCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findByIdAndDelete(req.params.id);

  if (!certification) {
    return res.status(404).json({ message: 'Certification not found' });
  }

  res.json({ message: 'Certification deleted' });
});
