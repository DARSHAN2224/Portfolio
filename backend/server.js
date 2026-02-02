const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Models
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const BlogPost = require('./models/BlogPost');
// const Profile = require('./models/Profile'); // Use if needed

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const chatRoutes = require('./routes/chatRoutes');
const metaRoutes = require('./routes/metaRoutes');

// --- API ROUTES ---
app.use('/api/chat', chatRoutes);
app.use('/api/meta', metaRoutes);

// Profile
app.get('/api/profile', async (req, res) => {
  try {
    const Profile = require('./models/Profile');
    const profile = await Profile.findOne();

    // Default Fallback if DB is empty
    const defaultProfile = {
      name: "Darshan P",
      title: "Full Stack Engineer",
      email: "pdarshan2224@gmail.com",
      bio: "Full Stack Engineer with 2+ years of experience in building scalable web applications and AI-powered solutions. Proficient in the MERN stack (MongoDB, Express, React, Node.js), Next.js, and Python. Passionate about solving real-world problems through code.",
      location: "Hyderabad, Telangana",
      systemStatus: "OPTIMAL"
    };

    res.json(profile || defaultProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const Profile = require('./models/Profile');
    // Update the first (and only) profile document
    const profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
      res.json(profile);
    } else {
      const newProfile = await Profile.create(req.body);
      res.json(newProfile);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({ isVisible: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = await Project.create(req.body);
    res.json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find({ isVisible: true });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/skills', async (req, res) => {
  try {
    const newSkill = await Skill.create(req.body);
    res.json(newSkill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/skills/:id', async (req, res) => {
  try {
    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Experience Routes
app.get('/api/experience', async (req, res) => {
  try {
    const Experience = require('./models/Experience');
    const experience = await Experience.find({ isVisible: true }).sort({ startDate: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experience', async (req, res) => {
  try {
    const Experience = require('./models/Experience');
    const newExp = await Experience.create(req.body);
    res.json(newExp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/experience/:id', async (req, res) => {
  try {
    const Experience = require('./models/Experience');
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experience/:id', async (req, res) => {
  try {
    const Experience = require('./models/Experience');
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Certificate Routes
app.get('/api/certificates', async (req, res) => {
  try {
    const Certificate = require('./models/Certificate');
    const certs = await Certificate.find({ isVisible: true }).sort({ date: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const Certificate = require('./models/Certificate');
    const newCert = await Certificate.create(req.body);
    res.json(newCert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    const Certificate = require('./models/Certificate');
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post Link (or specific post)
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Post not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const newBlog = await BlogPost.create(req.body);
    res.json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Social Links Routes
app.get('/api/social-links', async (req, res) => {
  try {
    const SocialLink = require('./models/SocialLink');
    const links = await SocialLink.find({ isVisible: true }).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/social-links', async (req, res) => {
  try {
    const SocialLink = require('./models/SocialLink');
    const newLink = await SocialLink.create(req.body);
    res.json(newLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/social-links/:id', async (req, res) => {
  try {
    const SocialLink = require('./models/SocialLink');
    const updated = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/social-links/:id', async (req, res) => {
  try {
    const SocialLink = require('./models/SocialLink');
    await SocialLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Social link deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image Upload Endpoint (Cloudinary)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio',
      resource_type: 'auto'
    });

    // Delete local file after upload
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Email Transporter Configuration (Google SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // Your Gmail address
    pass: process.env.EMAIL_PASS,     // Your Gmail App Password
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 1. Notification Email to YOU (the portfolio owner)
    const mailOptions = {
      from: process.env.EMAIL_USER, // Send from YOUR authenticated email to avoid spoofing checks
      to: process.env.EMAIL_USER,   // Send TO yourself
      replyTo: email,               // Reply to the USER'S email
      subject: `Portfolio Contact: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${process.env.EMAIL_USER}`);

    // 2. Auto-Reply Email to the USER
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send to the person who filled out the form
      subject: `Thank you for contacting Darshan P`,
      text: `Hi ${name},\n\nThank you for reaching out! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nDarshan P`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>I have received your message regarding:</p>
          <blockquote style="border-left: 4px solid #ddd; padding-left: 10px; color: #555;">
            ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}
          </blockquote>
          <p>I will review it and get back to you as soon as possible.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Darshan P</strong></p>
          <p style="font-size: 12px; color: #888;">Full Stack Engineer</p>
        </div>
      `,
    };

    await transporter.sendMail(autoReplyOptions);
    console.log(`Auto-reply sent to ${email}`);

    res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}`);
  });
}

module.exports = app;
