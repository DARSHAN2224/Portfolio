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

// Validation schema
const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  ownerEmail: z.string().email().optional(),
});

// Project management endpoints
const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  impactStatement: z.string().min(1).max(500),
  tags: z.array(z.string()),
  githubUrl: z.string().url(),
  demoUrl: z.string().url().optional(),
  images: z.array(z.string()),
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

    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
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
app.post('/api/projects/:id/images', (req, res) => {
  try {
    const projectId = req.params.id;
    const { imageData, filename } = req.body; // Base64 image data
    
    if (!imageData || !filename) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Image data and filename are required' 
      });
    }

    const projectFolder = path.join(__dirname, '../public/images/projects', projectId);
    
    // Create project folder if it doesn't exist
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
    }

    // Decode base64 image and save
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const imagePath = path.join(projectFolder, filename);
    
    fs.writeFileSync(imagePath, buffer);
    
    const imageUrl = `/images/projects/${projectId}/${filename}`;
    
    res.json({ 
      ok: true, 
      message: 'Image uploaded successfully',
      imageUrl 
    });
  } catch (err) {
    console.error('[projects] image upload error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to upload image',
      details: err.message 
    });
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
app.delete('/api/projects/:id/images/:filename', (req, res) => {
  try {
    const { id, filename } = req.params;
    const imagePath = path.join(__dirname, '../public/images/projects', id, filename);
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      res.json({ ok: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ ok: false, error: 'Image not found' });
    }
  } catch (err) {
    console.error('[projects] delete image error', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to delete image',
      details: err.message 
    });
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


