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

  // GET /api/achievements
  if (req.method === 'GET') {
    try {
      const achievementsPath = path.join(getProjectRoot(), 'data', 'achievements.json');
      const achievements = readJsonFile(achievementsPath);
      res.status(200).json(achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
    return;
  }

  // POST /api/achievements
  if (req.method === 'POST') {
    try {
      const achievementsPath = path.join(getProjectRoot(), 'data', 'achievements.json');
      const achievements = readJsonFile(achievementsPath);
      
      const newAchievement = req.body;
      achievements.push(newAchievement);
      
      if (writeJsonFile(achievementsPath, achievements)) {
        res.status(200).json({ message: 'Achievement added successfully', achievement: newAchievement });
      } else {
        res.status(500).json({ error: 'Failed to save achievement' });
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
      res.status(500).json({ error: 'Failed to add achievement' });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
}
