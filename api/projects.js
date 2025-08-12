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

  // GET /api/projects
  if (req.method === 'GET') {
    try {
      // The data file is in dist/data/projects.json
      const projectsPath = path.join(process.cwd(), 'dist', 'data', 'projects.json');
      
      if (fs.existsSync(projectsPath)) {
        const projects = readJsonFile(projectsPath);
        console.log(`Found ${projects.length} projects at: ${projectsPath}`);
        res.status(200).json(projects);
      } else {
        console.error(`Projects file not found at: ${projectsPath}`);
        res.status(500).json({ 
          error: 'Projects data file not found',
          debug: {
            cwd: process.cwd(),
            dirname: __dirname,
            vercel: process.env.VERCEL,
            searchedPath: projectsPath
          }
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
    return;
  }

  // POST /api/projects
  if (req.method === 'POST') {
    try {
      const projectsPath = path.join(process.cwd(), 'dist', 'data', 'projects.json');
      const projects = readJsonFile(projectsPath);
      
      const newProject = req.body;
      projects.push(newProject);
      
      if (writeJsonFile(projectsPath, projects)) {
        res.status(200).json({ message: 'Project added successfully', project: newProject });
      } else {
        res.status(500).json({ error: 'Failed to save project' });
      }
    } catch (error) {
      console.error('Error adding project:', error);
      res.status(500).json({ error: 'Failed to add project' });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
}
