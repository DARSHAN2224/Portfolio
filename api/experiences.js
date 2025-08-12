import fs from 'fs';
import path from 'path';

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

  // GET /api/experiences
  if (req.method === 'GET') {
    try {
      const experiencesPath = path.join(getProjectRoot(), 'data', 'experiences.json');
      const experiences = readJsonFile(experiencesPath);
      res.status(200).json(experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      res.status(500).json({ error: 'Failed to fetch experiences' });
    }
    return;
  }

  // POST /api/experiences
  if (req.method === 'POST') {
    try {
      const experiencesPath = path.join(getProjectRoot(), 'data', 'experiences.json');
      const experiences = readJsonFile(experiencesPath);
      
      const newExperience = req.body;
      experiences.push(newExperience);
      
      if (writeJsonFile(experiencesPath, experiences)) {
        res.status(200).json({ message: 'Experience added successfully', experience: newExperience });
      } else {
        res.status(500).json({ error: 'Failed to save experience' });
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      res.status(500).json({ error: 'Failed to add experience' });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
}
