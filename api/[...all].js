const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper function to get project root
const getProjectRoot = () => {
  return process.env.VERCEL ? process.cwd() : __dirname;
};

// Helper function to read JSON files
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// GET /api/projects
app.get('/api/projects', (req, res) => {
  try {
    const projectsPath = path.join(getProjectRoot(), 'data', 'projects.json');
    const projects = readJsonFile(projectsPath);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects
app.post('/api/projects', (req, res) => {
  try {
    const projectsPath = path.join(getProjectRoot(), 'data', 'projects.json');
    const projects = readJsonFile(projectsPath);
    
    const newProject = req.body;
    projects.push(newProject);
    
    if (writeJsonFile(projectsPath, projects)) {
      res.json({ message: 'Project added successfully', project: newProject });
    } else {
      res.status(500).json({ error: 'Failed to save project' });
    }
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// GET /api/achievements
app.get('/api/achievements', (req, res) => {
  try {
    const achievementsPath = path.join(getProjectRoot(), 'data', 'achievements.json');
    const achievements = readJsonFile(achievementsPath);
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// POST /api/achievements
app.post('/api/achievements', (req, res) => {
  try {
    const achievementsPath = path.join(getProjectRoot(), 'data', 'achievements.json');
    const achievements = readJsonFile(achievementsPath);
    
    const newAchievement = req.body;
    achievements.push(newAchievement);
    
    if (writeJsonFile(achievementsPath, achievements)) {
      res.json({ message: 'Achievement added successfully', achievement: newAchievement });
    } else {
      res.status(500).json({ error: 'Failed to save achievement' });
    }
  } catch (error) {
    console.error('Error adding achievement:', error);
    res.status(500).json({ error: 'Failed to add achievement' });
  }
});

// GET /api/skills
app.get('/api/skills', (req, res) => {
  try {
    const skillsPath = path.join(getProjectRoot(), 'data', 'skills.json');
    const skills = readJsonFile(skillsPath);
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /api/skills
app.post('/api/skills', (req, res) => {
  try {
    const skillsPath = path.join(getProjectRoot(), 'data', 'skills.json');
    const skills = readJsonFile(skillsPath);
    
    const newSkill = req.body;
    skills.push(newSkill);
    
    if (writeJsonFile(skillsPath, skills)) {
      res.json({ message: 'Skill added successfully', skill: newSkill });
    } else {
      res.status(500).json({ error: 'Failed to save skill' });
    }
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// GET /api/experiences
app.get('/api/experiences', (req, res) => {
  try {
    const experiencesPath = path.join(getProjectRoot(), 'data', 'experiences.json');
    const experiences = readJsonFile(experiencesPath);
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// POST /api/experiences
app.post('/api/experiences', (req, res) => {
  try {
    const experiencesPath = path.join(getProjectRoot(), 'data', 'experiences.json');
    const experiences = readJsonFile(experiencesPath);
    
    const newExperience = req.body;
    experiences.push(newExperience);
    
    if (writeJsonFile(experiencesPath, experiences)) {
      res.json({ message: 'Experience added successfully', experience: newExperience });
    } else {
      res.status(500).json({ error: 'Failed to save experience' });
    }
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    // For now, just return success (you can add email logic later)
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Catch-all handler for other API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

module.exports = app;


