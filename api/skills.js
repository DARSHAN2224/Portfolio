import fs from 'fs';
import path from 'path';

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

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET /api/skills
  if (req.method === 'GET') {
    try {
      // Try to read from the source data file first, then from dist
      let skillsPath = path.join(process.cwd(), 'data', 'skills.json');
      
      if (!fs.existsSync(skillsPath)) {
        // Try dist/data path for Vercel
        skillsPath = path.join(process.cwd(), 'dist', 'data', 'skills.json');
      }
      
      if (fs.existsSync(skillsPath)) {
        const skills = readJsonFile(skillsPath);
        res.status(200).json(skills);
      } else {
        // If file doesn't exist, return empty array
        res.status(200).json([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      res.status(500).json({ error: 'Failed to fetch skills' });
    }
    return;
  }

  // POST /api/skills
  if (req.method === 'POST') {
    try {
      const skillsPath = path.join(process.cwd(), 'data', 'skills.json');
      let skills = [];
      
      // Try to read existing data
      if (fs.existsSync(skillsPath)) {
        skills = readJsonFile(skillsPath);
      }
      
      const newSkill = req.body;
      skills.push(newSkill);
      
      if (writeJsonFile(skillsPath, skills)) {
        res.status(200).json({ message: 'Skill added successfully', skill: newSkill });
      } else {
        res.status(500).json({ error: 'Failed to save skill' });
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      res.status(500).json({ error: 'Failed to add skill' });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
}
