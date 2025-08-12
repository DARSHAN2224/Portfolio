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

  // GET /api/achievements
  if (req.method === 'GET') {
    try {
      // Try to read from the source data file first, then from dist
      let achievementsPath = path.join(process.cwd(), 'data', 'achievements.json');
      
      if (!fs.existsSync(achievementsPath)) {
        // Try dist/data path for Vercel
        achievementsPath = path.join(process.cwd(), 'dist', 'data', 'achievements.json');
      }
      
      if (fs.existsSync(achievementsPath)) {
        const achievements = readJsonFile(achievementsPath);
        res.status(200).json(achievements);
      } else {
        // If file doesn't exist, return empty array
        res.status(200).json([]);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
    return;
  }

  // POST /api/achievements
  if (req.method === 'POST') {
    try {
      const achievementsPath = path.join(process.cwd(), 'data', 'achievements.json');
      let achievements = [];
      
      // Try to read existing data
      if (fs.existsSync(achievementsPath)) {
        achievements = readJsonFile(achievementsPath);
      }
      
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
