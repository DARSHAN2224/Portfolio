import Experience from '../models/Experience.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all work experience
 */
export const getExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.find({ isVisible: true })
    .sort({ startDate: -1 })
    .exec();

  res.json(experience);
});

/**
 * Get single experience entry
 */
export const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  res.json(experience);
});

/**
 * Create experience entry (admin only)
 */
export const createExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.create(req.body);
  res.status(201).json(experience);
});

/**
 * Update experience entry (admin only)
 */
export const updateExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  res.json(experience);
});

/**
 * Delete experience entry (admin only)
 */
export const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);

  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  res.json({ message: 'Experience entry deleted' });
});
