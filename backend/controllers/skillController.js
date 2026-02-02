import Skill from '../models/Skill.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all skills
 */
export const getSkills = asyncHandler(async (req, res) => {
  const { category, domain, visible } = req.query;

  const filter = { isVisible: visible !== 'false' };
  if (category) filter.category = category;
  if (domain) filter.domain = domain;

  const skills = await Skill.find(filter).sort({ category: 1, proficiency: -1 });

  res.json(skills);
});

/**
 * Get single skill
 */
export const getSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }

  res.json(skill);
});

/**
 * Create skill (admin only)
 */
export const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
});

/**
 * Update skill (admin only)
 */
export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }

  res.json(skill);
});

/**
 * Delete skill (admin only)
 */
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }

  res.json({ message: 'Skill deleted' });
});
