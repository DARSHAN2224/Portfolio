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
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security & parsing
app.use(helmet());
app.use(cors());
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
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  ownerEmail: z.string().email().optional(),
});

// Project management endpoints
const ImageUnionSchema = z.union([
  z.string().url(),
  z.object({ url: z.string().url(), alt: z.string().optional() })
]);

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  impactStatement: z.string().min(1).max(500),
  tags: z.array(z.string()),
  githubUrl: z.string().url(),
  demoUrl: z.string().url().optional(),
  images: z.array(ImageUnionSchema),
  showDemoButton: z.boolean().optional().default(true),
  showGithubButton: z.boolean().optional().default(true),
  createdAt: z.string(),
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
  const projectFolder = path.join(__dirname, '../public/images/projects', projectId);
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
  const imagePath = path.join(__dirname, '../public/images/projects', projectId, filename);
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
        details: parsed.error.flatten() 
      });
    }

    const project = parsed.data;
    const projectFolder = path.join(__dirname, '../public/images/projects', project.id);
    
    // Create project folder
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
      console.log(`Created project folder: ${projectFolder}`);
    }

    // Save project data to JSON file
    const projectsFile = path.join(__dirname, '../data/projects.json');
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
    const projectsFile = path.join(__dirname, '../data/projects.json');
    
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
    const projectsFile = path.join(__dirname, '../data/projects.json');
    const projectFolder = path.join(__dirname, '../public/images/projects', projectId);
    
    // Remove from projects data
    if (fs.existsSync(projectsFile)) {
      let projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      projects = projects.filter(p => p.id !== projectId);
      fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    }

    // Remove project folder
    if (fs.existsSync(projectFolder)) {
      fs.rmSync(projectFolder, { recursive: true, force: true });
      console.log(`Deleted project folder: ${projectFolder}`);
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

    if (!imageData || !filename) {
      return res.status(400).json({ ok: false, error: 'Image data and filename are required' });
    }

    // Validate type/size
    const validation = validateDataUrlImage(imageData);
    if (!validation.ok) {
      return res.status(400).json({ ok: false, error: validation.error });
    }

    // Optimize/convert using sharp
    const inputBuffer = Buffer.from(validation.base64, 'base64');
    // Try to preserve type; convert PNG/JPEG to WebP for better size
    const optimized = await sharp(inputBuffer)
      .rotate() // auto-orient
      .toFormat('webp', { quality: 82 })
      .toBuffer();

    const outBase64 = optimized.toString('base64');
    // Replace extension to .webp if needed
    const outFilename = filename.replace(/\.(jpe?g|png|gif|webp)$/i, '.webp');

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
    const projectFolder = path.join(__dirname, '../public/images/projects', projectId);
    
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

app.post('/api/contact', async (req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return res.status(500).json({ ok: false, code: 'SMTP_NOT_CONFIGURED', error: 'SMTP credentials are missing' });
    }
    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: 'Invalid input', details: parsed.error.flatten() });
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

app.listen(PORT, () => {
  console.log(`SMTP API running on http://localhost:${PORT}`);
});


