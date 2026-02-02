import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all projects
 */
export const getProjects = asyncHandler(async (req, res) => {
  const { domain, tag, featured, visible } = req.query;

  const filter = { isVisible: visible !== 'false' };
  if (domain) filter.domain = domain;
  if (featured === 'true') filter.isFeatured = true;
  if (tag) filter.tags = tag;

  const projects = await Project.find(filter).sort({ isFeatured: -1, createdAt: -1 });

  res.json(projects);
});

/**
 * Get single project
 */
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json(project);
});

/**
 * Create project (admin only)
 */
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

/**
 * Update project (admin only)
 */
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json(project);
});

/**
 * Delete project (admin only)
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({ message: 'Project deleted' });
});

/**
 * Toggle project visibility (admin only)
 */
export const toggleProjectVisibility = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  project.isVisible = !project.isVisible;
  await project.save();

  res.json(project);
});

/**
 * Mark project as featured (admin only)
 */
export const markAsFeatured = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  project.isFeatured = !project.isFeatured;
  await project.save();

  res.json(project);
});
