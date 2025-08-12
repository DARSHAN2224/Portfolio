import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const cwd = process.cwd();
    const dirname = __dirname;
    const vercel = process.env.VERCEL;
    
    // List available directories
    const cwdContents = fs.readdirSync(cwd);
    const dirnameContents = fs.readdirSync(dirname);
    
    // Try to read the projects data directly
    let projectsData = null;
    let projectsPath = null;
    
    try {
      projectsPath = path.join(cwd, 'dist', 'data', 'projects.json');
      if (fs.existsSync(projectsPath)) {
        projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      }
    } catch (err) {
      console.log('Could not read from dist/data/projects.json');
    }
    
    res.status(200).json({
      debug: {
        cwd,
        dirname,
        vercel,
        cwdContents,
        dirnameContents,
        projectsPath,
        projectsData: projectsData ? projectsData.length : null
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Debug failed',
      message: error.message,
      stack: error.stack
    });
  }
}
