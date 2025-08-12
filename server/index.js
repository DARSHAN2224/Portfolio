import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { z } from 'zod';
import { renderOwnerEmail, renderSenderThankYouEmail } from './templates.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// sharp is optional; we'll load it lazily inside the upload handler
let __sharp = null;
async function loadSharp() {
  if (__sharp !== null) return __sharp;
  try {
    const mod = await import('sharp');
    __sharp = mod?.default || mod;
  } catch (err) {
    console.warn('[warn] sharp not available; skipping image optimization');
    __sharp = null;
  }
  return __sharp;
}

// Fix for Vercel serverless environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use process.cwd() for Vercel compatibility
const getProjectRoot = () => {
  // In Vercel, use process.cwd(), otherwise use __dirname
  return process.env.VERCEL ? process.cwd() : path.join(__dirname, '..');
};

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security & parsing
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.static('public')); // Serve static files

// Rate limiting to avoid abuse
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});
app.use('/api/contact', limiter);
app.use('/api/projects', limiter);

// Validation schema
const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  ownerEmail: z.string().email('Invalid owner email address')
});

const ImageUnionSchema = z.union([
  z.string().url('Invalid image URL'),
  z.object({
    url: z.string().url('Invalid image URL'),
    alt: z.string().optional()
  })
]);

const ProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Project title is required'),
  impactStatement: z.string().min(1, 'Impact statement is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  demoUrl: z.string().url('Invalid demo URL').optional(),
  images: z.array(ImageUnionSchema),
  showDemoButton: z.boolean().optional(),
  showGithubButton: z.boolean().optional(),
  createdAt: z.string().min(1, 'Creation date is required')
});

const AchievementSchema = z.object({
  id: z.string().min(1, 'Achievement ID is required'),
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().min(1, 'Achievement description is required'),
  icon: z.string().min(1, 'Achievement icon is required'),
  createdAt: z.string().min(1, 'Creation date is required')
});

const ExperienceSchema = z.object({
  id: z.string().min(1, 'Experience ID is required'),
  year: z.string().min(1, 'Experience year is required'),
  title: z.string().min(1, 'Experience title is required'),
  subtitle: z.string().min(1, 'Experience subtitle is required'),
  description: z.string().min(1, 'Experience description is required'),
  createdAt: z.string().min(1, 'Creation date is required')
});

// Nodemailer transporter
const requiredEnv = ['SMTP_MAIL', 'SMTP_PASSWORD', 'SMTP_HOST', 'SMTP_PORT'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`[warn] Missing env ${key}.`);
  }
}

function isSmtpConfigured() {
  return requiredEnv.every((k) => Boolean(process.env[k]));
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// --- GitHub Upload Configuration ---
const GITHUB_UPLOAD_ENABLED = String(process.env.GITHUB_UPLOAD_ENABLED || '').toLowerCase() === 'true';
const GITHUB_OWNER = process.env.GITHUB_OWNER || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_BASE_PATH = process.env.GITHUB_BASE_PATH || 'public/images/projects';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_COMMITTER_NAME = process.env.GITHUB_COMMITTER_NAME || 'Website Uploader';
const GITHUB_COMMITTER_EMAIL = process.env.GITHUB_COMMITTER_EMAIL || 'uploader@local';

function isGithubConfigured() {
  if (!GITHUB_UPLOAD_ENABLED) return false;
  return Boolean(GITHUB_OWNER && GITHUB_REPO && GITHUB_TOKEN);
}

function buildGithubFilePath(projectId, filename) {
  // Use POSIX separators for GitHub API paths
  const cleanProject = String(projectId).replace(/[^a-zA-Z0-9-_]/g, '');
  return `${GITHUB_BASE_PATH}/${cleanProject}/${filename}`.replace(/\\/g, '/');
}

async function githubGetFileSha(repoPath) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURI(repoPath)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'darshan-codecraft-uploader',
      Accept: 'application/vnd.github+json',
    },
  });
  if (res.status === 200) {
    const json = await res.json();
    return json.sha;
  }
  return null;
}

async function githubPutFile({ repoPath, base64Content, commitMessage }) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURI(repoPath)}`;
  const existingSha = await githubGetFileSha(repoPath);
  const body = {
    message: commitMessage,
    content: base64Content,
    branch: GITHUB_BRANCH,
    committer: {
      name: GITHUB_COMMITTER_NAME,
      email: GITHUB_COMMITTER_EMAIL,
    },
    ...(existingSha ? { sha: existingSha } : {}),
  };
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'darshan-codecraft-uploader',
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  const commitSha = json?.commit?.sha || json?.content?.sha || '';
  return { commitSha };
}

async function githubDeleteFile({ repoPath, commitMessage }) {
  const sha = await githubGetFileSha(repoPath);
  if (!sha) {
    // Treat as success if file doesn't exist
    return;
  }
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURI(repoPath)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'darshan-codecraft-uploader',
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      sha,
      branch: GITHUB_BRANCH,
      committer: {
        name: GITHUB_COMMITTER_NAME,
        email: GITHUB_COMMITTER_EMAIL,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub DELETE failed (${res.status}): ${text}`);
  }
}

// --- Auth (optional) for admin endpoints ---
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN || '';
function requireAdminAuth(req, res, next) {
  if (!ADMIN_API_TOKEN) return next(); // not enforced
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token && token === ADMIN_API_TOKEN) return next();
  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}

// --- File validation ---
const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 10 * 1024 * 1024; // 10MB
function validateDataUrlImage(dataUrl) {
  const match = /^data:(.+);base64,(.*)$/.exec(dataUrl || '');
  if (!match) return { ok: false, error: 'Invalid data URL' };
  const mime = match[1];
  if (!ACCEPTED_MIME.includes(mime)) return { ok: false, error: 'Unsupported image type' };
  const base64 = match[2];
  const bytes = Buffer.byteLength(base64, 'base64');
  if (bytes > MAX_BYTES) return { ok: false, error: 'Image too large' };
  return { ok: true, mime, base64 };
}

// --- Storage driver abstraction ---
const STORAGE_DRIVER = (process.env.STORAGE_DRIVER || (isGithubConfigured() ? 'github' : 'local')).toLowerCase();

async function storeImage({ projectId, filename, base64Content }) {
  if (STORAGE_DRIVER === 'github') {
    const repoPath = buildGithubFilePath(projectId, filename);
    const { commitSha } = await githubPutFile({
      repoPath,
      base64Content,
      commitMessage: `feat(images): add ${filename} for project ${projectId}`,
    });
    return {
      url: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${encodeURIComponent(GITHUB_BRANCH)}/${repoPath}${commitSha ? `?sha=${commitSha}` : ''}`,
      location: 'github',
      path: repoPath,
    };
  }
  const projectFolder = path.join(getProjectRoot(), 'public/images/projects', projectId);
  if (!fs.existsSync(projectFolder)) fs.mkdirSync(projectFolder, { recursive: true });
  const buffer = Buffer.from(base64Content, 'base64');
  const imagePath = path.join(projectFolder, filename);
  fs.writeFileSync(imagePath, buffer);
  return { url: `/images/projects/${projectId}/${filename}`, location: 'local', path: imagePath };
}

async function deleteImage({ projectId, filename }) {
  if (STORAGE_DRIVER === 'github') {
    const repoPath = buildGithubFilePath(projectId, filename);
    await githubDeleteFile({ repoPath, commitMessage: `chore(images): delete ${filename} for project ${projectId}` });
    return { ok: true };
  }
  const imagePath = path.join(getProjectRoot(), 'public/images/projects', projectId, filename);
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  return { ok: true };
}

// Create project folder and save project data
app.post('/api/projects', async (req, res) => {
  try {
  
    
    const parsed = ProjectSchema.safeParse(req.body);
    if (!parsed.success) {

      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid project data', 
        details: parsed.error.flatten(),
        received: req.body,
        required: ['id', 'title', 'impactStatement', 'tags', 'githubUrl', 'images', 'createdAt'],
        optional: ['demoUrl', 'showDemoButton', 'showGithubButton']
      });
    }

    const project = parsed.data;
    
    // Validate that required fields are not empty strings
    if (!project.title.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Project title cannot be empty'
      });
    }
    
    if (!project.impactStatement.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Impact statement cannot be empty'
      });
    }
    
    // Check GitHub URL only if GitHub button is enabled
    if (project.showGithubButton !== false && (!project.githubUrl || !project.githubUrl.trim())) {
      return res.status(400).json({
        ok: false,
        error: 'GitHub URL is required when GitHub button is enabled'
      });
    }
    
    // Check Demo URL only if Demo button is enabled
    if (project.showDemoButton !== false && project.demoUrl && !project.demoUrl.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Demo URL cannot be empty when Demo button is enabled'
      });
    }
    
    // Validate URL format if provided
    if (project.githubUrl && project.githubUrl.trim()) {
      try {
        new URL(project.githubUrl);
      } catch {
        return res.status(400).json({
          ok: false,
          error: 'Invalid GitHub URL format'
        });
      }
    }
    
    if (project.demoUrl && project.demoUrl.trim()) {
      try {
        new URL(project.demoUrl);
      } catch {
        return res.status(400).json({
          ok: false,
          error: 'Invalid Demo URL format'
        });
      }
    }
    
    if (!Array.isArray(project.tags) || project.tags.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'At least one tag is required'
      });
    }

    const projectFolder = path.join(getProjectRoot(), 'public/images/projects', project.id);
    
    // Create project folder
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
      
    }

    // Save project data to JSON file
    const projectsFile = path.join(getProjectRoot(), 'data/projects.json');
    const projectsDir = path.dirname(projectsFile);
    
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    let projects = [];
    if (fs.existsSync(projectsFile)) {
      projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    }

    // Check if project already exists
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }

    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    
    res.json({ 
      ok: true, 
      message: 'Project saved successfully',
      projectFolder: `/images/projects/${project.id}`
    });
  } catch (err) {
    console.error('[projects] save error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to save project',
      details: err.message 
    });
  }
});

// Get all projects
app.get('/api/projects', (req, res) => {
  try {
    const projectsFile = path.join(getProjectRoot(), 'data/projects.json');
    
    if (!fs.existsSync(projectsFile)) {
      return res.json({ ok: true, projects: [] });
    }

    const raw = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    const projects = (raw || []).map((p) => ({
      ...p,
      images: Array.isArray(p.images)
        ? p.images.map((img) => (typeof img === 'string' ? { url: img } : img))
        : [],
    }));
    res.json({ ok: true, projects });
  } catch (err) {
    console.error('[projects] get error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get projects',
      details: err.message 
    });
  }
});

// Delete project and its folder
app.delete('/api/projects/:id', (req, res) => {
  try {
    const projectId = req.params.id;
    const projectsFile = path.join(getProjectRoot(), 'data/projects.json');
    const projectFolder = path.join(getProjectRoot(), 'public/images/projects', projectId);
    
    // Remove from projects data
    if (fs.existsSync(projectsFile)) {
      let projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      projects = projects.filter(p => p.id !== projectId);
      fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    }

    // Remove project folder
    if (fs.existsSync(projectFolder)) {
      fs.rmSync(projectFolder, { recursive: true, force: true });
      
    }

    res.json({ ok: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('[projects] delete error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to delete project',
      details: err.message 
    });
  }
});

// Upload image for a project
app.post('/api/projects/:id/images', requireAdminAuth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { imageData, filename, alt = '' } = req.body; // Base64 data URL expected



    // Check if project exists
    const projectsFile = path.join(getProjectRoot(), 'data/projects.json');
    if (!fs.existsSync(projectsFile)) {

      return res.status(404).json({ ok: false, error: 'Projects file not found' });
    }

    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    const project = projects.find(p => p.id === projectId);
    if (!project) {

      return res.status(404).json({ ok: false, error: 'Project not found' });
    }

    

    if (!imageData || !filename) {

      return res.status(400).json({ ok: false, error: 'Image data and filename are required' });
    }

    // Validate type/size
    const validation = validateDataUrlImage(imageData);
    if (!validation.ok) {

      return res.status(400).json({ ok: false, error: validation.error });
    }

    

    // Optimize but preserve original format and filename (optional if sharp is present)
    const inputBuffer = Buffer.from(validation.base64, 'base64');
    let optimizedBuffer = inputBuffer;
    const sharp = await loadSharp();
    if (sharp) {
      try {
        optimizedBuffer = await sharp(inputBuffer).rotate().toBuffer(); // auto-orient

      } catch (optErr) {
        console.warn('[warn] sharp optimization failed, using original buffer:', optErr?.message || optErr);
        optimizedBuffer = inputBuffer;
      }
    }

    const outBase64 = optimizedBuffer.toString('base64');
    const outFilename = filename; // keep the same name and extension

    
    
    const stored = await storeImage({ projectId, filename: outFilename, base64Content: outBase64 });
    

    res.json({ ok: true, message: 'Image uploaded successfully', imageUrl: stored.url, alt });
  } catch (err) {
    console.error('[projects] image upload error', err);
    res.status(500).json({ ok: false, error: 'Failed to upload image', details: err.message });
  }
});

// Get project images
app.get('/api/projects/:id/images', (req, res) => {
  try {
    const projectId = req.params.id;
    const projectFolder = path.join(getProjectRoot(), 'public/images/projects', projectId);
    
    if (!fs.existsSync(projectFolder)) {
      return res.json({ ok: true, images: [] });
    }

    const files = fs.readdirSync(projectFolder);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/images/projects/${projectId}/${file}`);

    res.json({ ok: true, images });
  } catch (err) {
    console.error('[projects] get images error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get project images',
      details: err.message 
    });
  }
});

// Delete project image
app.delete('/api/projects/:id/images/:filename', requireAdminAuth, (req, res) => {
  try {
    const { id, filename } = req.params;

    deleteImage({ projectId: id, filename })
      .then(() => res.json({ ok: true, message: 'Image deleted successfully' }))
      .catch((err) => {
        console.error('[projects] delete image error', err);
        res.status(500).json({ ok: false, error: 'Failed to delete image', details: err.message });
      });
  } catch (err) {
    console.error('[projects] delete image error', err);
    res.status(500).json({ ok: false, error: 'Failed to delete image', details: err.message });
  }
});

// Helpful GET for visibility/debugging (browsers do GET by default)
app.get('/api/contact', (_req, res) => {
  res.json({ ok: true, usage: 'POST /api/contact with { name, email, message, ownerEmail }' });
});

// Achievements API endpoints
app.get('/api/achievements', (req, res) => {
  try {
    const achievementsFile = path.join(getProjectRoot(), 'data/achievements.json');
    
    if (!fs.existsSync(achievementsFile)) {
      return res.json({ ok: true, achievements: [] });
    }

    const achievements = JSON.parse(fs.readFileSync(achievementsFile, 'utf8'));
    res.json({ ok: true, achievements: achievements || [] });
  } catch (err) {
    console.error('[achievements] get error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get achievements',
      details: err.message 
    });
  }
});

app.post('/api/achievements', async (req, res) => {
  try {

    
    const parsed = AchievementSchema.safeParse(req.body);
    if (!parsed.success) {

      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid achievement data', 
        details: parsed.error.flatten(),
        received: req.body,
        required: ['id', 'title', 'description', 'icon', 'createdAt'],
      });
    }

    const achievement = parsed.data;
    
    // Additional validation for empty strings
    if (!achievement.title.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Achievement title cannot be empty'
      });
    }
    
    if (!achievement.description.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Achievement description cannot be empty'
      });
    }
    
    if (!achievement.icon.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Achievement icon cannot be empty'
      });
    }
    
    
    
    const achievementsFile = path.join(getProjectRoot(), 'data/achievements.json');
    const achievementsDir = path.dirname(achievementsFile);
    
    if (!fs.existsSync(achievementsDir)) {
      fs.mkdirSync(achievementsDir, { recursive: true });
    }

    let achievements = [];
    if (fs.existsSync(achievementsFile)) {
      achievements = JSON.parse(fs.readFileSync(achievementsFile, 'utf8'));
    }

    // Check if achievement already exists
    const existingIndex = achievements.findIndex(a => a.id === achievement.id);
    if (existingIndex >= 0) {
      
      achievements[existingIndex] = achievement;
    } else {
      
      achievements.push(achievement);
    }

    fs.writeFileSync(achievementsFile, JSON.stringify(achievements, null, 2));
    
    
    res.json({ 
      ok: true, 
      message: 'Achievement saved successfully',
      achievement: achievement
    });
  } catch (err) {
    console.error('[achievements] save error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to save achievement',
      details: err.message 
    });
  }
});

app.delete('/api/achievements/:id', (req, res) => {
  try {
    const achievementId = req.params.id;
    const achievementsFile = path.join(getProjectRoot(), 'data/achievements.json');
    
    if (fs.existsSync(achievementsFile)) {
      let achievements = JSON.parse(fs.readFileSync(achievementsFile, 'utf8'));
      achievements = achievements.filter(a => a.id !== achievementId);
      fs.writeFileSync(achievementsFile, JSON.stringify(achievements, null, 2));
    }

    res.json({ ok: true, message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error('[achievements] delete error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to delete achievement',
      details: err.message 
    });
  }
});

// Skills API endpoints
app.get('/api/skills', (req, res) => {
  try {
    const skillsFile = path.join(getProjectRoot(), 'data/skills.json');
    
    if (!fs.existsSync(skillsFile)) {
      return res.json({ ok: true, skills: {} });
    }

    const skills = JSON.parse(fs.readFileSync(skillsFile, 'utf8'));
    res.json({ ok: true, skills: skills || {} });
  } catch (err) {
    console.error('[skills] get error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get skills',
      details: err.message 
    });
  }
});

app.post('/api/skills', async (req, res) => {
  try {

    
    const { category, skills } = req.body;
    
    if (!category || !category.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Skill category is required'
      });
    }
    
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Skills array is required and cannot be empty'
      });
    }
    
    const skillsFile = path.join(getProjectRoot(), 'data/skills.json');
    const skillsDir = path.dirname(skillsFile);
    
    if (!fs.existsSync(skillsDir)) {
      fs.mkdirSync(skillsDir, { recursive: true });
    }

    let allSkills = {};
    if (fs.existsSync(skillsFile)) {
      allSkills = JSON.parse(fs.readFileSync(skillsFile, 'utf8'));
    }

    allSkills[category] = skills;
    fs.writeFileSync(skillsFile, JSON.stringify(allSkills, null, 2));
    
    res.json({ 
      ok: true, 
      message: 'Skills saved successfully',
      skills: allSkills
    });
  } catch (err) {
    console.error('[skills] save error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to save skills',
      details: err.message 
    });
  }
});

app.delete('/api/skills/:category', (req, res) => {
  try {
    const category = req.params.category;
    const skillsFile = path.join(getProjectRoot(), 'data/skills.json');
    
    if (fs.existsSync(skillsFile)) {
      let allSkills = JSON.parse(fs.readFileSync(skillsFile, 'utf8'));
      delete allSkills[category];
      fs.writeFileSync(skillsFile, JSON.stringify(allSkills, null, 2));
    }

    res.json({ ok: true, message: 'Skill category deleted successfully' });
  } catch (err) {
    console.error('[skills] delete error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to delete skill category',
      details: err.message 
    });
  }
});

// Experiences API endpoints
app.get('/api/experiences', (req, res) => {
  try {
    const experiencesFile = path.join(getProjectRoot(), 'data/experiences.json');
    
    if (!fs.existsSync(experiencesFile)) {
      return res.json({ ok: true, experiences: [] });
    }

    const experiences = JSON.parse(fs.readFileSync(experiencesFile, 'utf8'));
    res.json({ ok: true, experiences: experiences || [] });
  } catch (err) {
    console.error('[experiences] get error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get experiences',
      details: err.message 
    });
  }
});

app.post('/api/experiences', async (req, res) => {
  try {

    
    const parsed = ExperienceSchema.safeParse(req.body);
    if (!parsed.success) {

      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid experience data', 
        details: parsed.error.flatten(),
        received: req.body,
        required: ['id', 'year', 'title', 'subtitle', 'description', 'createdAt'],
      });
    }

    const experience = parsed.data;
    
    // Additional validation for empty strings
    if (!experience.year.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Experience year cannot be empty'
      });
    }
    
    if (!experience.title.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Experience title cannot be empty'
      });
    }
    
    if (!experience.subtitle.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Experience subtitle cannot be empty'
      });
    }
    
    if (!experience.description.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Experience description cannot be empty'
      });
    }
    
    
    
    const experiencesFile = path.join(getProjectRoot(), 'data/experiences.json');
    const experiencesDir = path.dirname(experiencesFile);
    
    if (!fs.existsSync(experiencesDir)) {
      fs.mkdirSync(experiencesDir, { recursive: true });
    }

    let experiences = [];
    if (fs.existsSync(experiencesFile)) {
      experiences = JSON.parse(fs.readFileSync(experiencesFile, 'utf8'));
    }

    // Check if experience already exists
    const existingIndex = experiences.findIndex(e => e.id === experience.id);
    if (existingIndex >= 0) {
      
      experiences[existingIndex] = experience;
    } else {
      
      experiences.push(experience);
    }

    fs.writeFileSync(experiencesFile, JSON.stringify(experiences, null, 2));
    
    
    res.json({ 
      ok: true, 
      message: 'Experience saved successfully',
      experience: experience
    });
  } catch (err) {
    console.error('[experiences] save error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to save experience',
      details: err.message 
    });
  }
});

app.delete('/api/experiences/:id', (req, res) => {
  try {
    const experienceId = req.params.id;
    const experiencesFile = path.join(getProjectRoot(), 'data/experiences.json');
    
    if (fs.existsSync(experiencesFile)) {
      let experiences = JSON.parse(fs.readFileSync(experiencesFile, 'utf8'));
      experiences = experiences.filter(e => e.id !== experienceId);
      fs.writeFileSync(experiencesFile, JSON.stringify(experiences, null, 2));
    }

    res.json({ ok: true, message: 'Experience deleted successfully' });
  } catch (err) {
    console.error('[experiences] delete error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to delete experience',
      details: err.message 
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {

    
    if (!isSmtpConfigured()) {

      return res.status(500).json({ ok: false, code: 'SMTP_NOT_CONFIGURED', error: 'SMTP credentials are missing' });
    }
    
    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {

      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid input', 
        details: parsed.error.flatten(),
        received: req.body 
      });
    }

    const { name, email, message, ownerEmail } = parsed.data;
    const ownerTo = ownerEmail || process.env.TO_EMAIL || process.env.SMTP_MAIL;

    // Owner notification
    const ownerSubject = `New portfolio contact from ${name}`;
    const ownerHtml = renderOwnerEmail({ name, email, message });

    // Sender thank you
    const thankYouSubject = `Thanks for reaching out, ${name}!`;
    const thankYouHtml = renderSenderThankYouEmail({ name });

    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_MAIL}>`,
      to: ownerTo,
      subject: ownerSubject,
      html: ownerHtml,
    });

    await transporter.sendMail({
      from: `Darshan • Portfolio <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: thankYouSubject,
      html: thankYouHtml,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[contact] send error', err);
    return res.status(500).json({ ok: false, code: 'SEND_FAILED', error: 'Failed to send email' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/test-contact', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'Contact endpoint is working',
    schema: {
      required: ['name', 'email', 'message'],
      optional: ['ownerEmail'],
      example: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello, this is a test message',
        ownerEmail: 'owner@example.com'
      }
    }
  });
});

app.get('/api/verify', async (_req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return res.status(500).json({ ok: false, code: 'SMTP_NOT_CONFIGURED', error: 'SMTP credentials are missing' });
    }
    await transporter.verify();
    res.json({ ok: true });
  } catch (err) {
    console.error('[verify] transporter error', err);
    res.status(500).json({ ok: false, code: 'VERIFY_FAILED', error: String(err && err.message || err) });
  }
});

// Export the Express app for serverless environments (e.g., Vercel)
export default app;

// Start the server only when not running in a serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
  
  });
}

