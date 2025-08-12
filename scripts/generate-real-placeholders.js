import fs from 'fs';
import path from 'path';

// Create a simple SVG placeholder image as a data URL
function createPlaceholderSVGDataURL(width, height, text, color = '#3b82f6') {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  
  // Convert SVG to data URL
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Project image configurations
const projects = [
  {
    id: 'project-1',
    images: [
      { name: 'ai-dashboard.jpg', text: 'AI Dashboard' },
      { name: 'symptom-analyzer.jpg', text: 'Symptom Analyzer' },
      { name: 'appointment-scheduler.jpg', text: 'Appointment Scheduler' },
      { name: 'patient-interface.jpg', text: 'Patient Interface' },
      { name: 'healthcare-mobile.jpg', text: 'Healthcare Mobile' },
      { name: 'cool-geometric-triangular-figure-neon-laser-light-great-backgrounds-wallpapers.jpg', text: 'Geometric Background' }
    ]
  },
  {
    id: 'project-2',
    images: [
      { name: 'iot-dashboard.jpg', text: 'IoT Dashboard' },
      { name: 'smart-lighting.jpg', text: 'Smart Lighting' },
      { name: 'temperature-control.jpg', text: 'Temperature Control' },
      { name: 'security-system.jpg', text: 'Security System' },
      { name: 'mobile-app.jpg', text: 'Mobile App' },
      { name: 'hardware-setup.jpg', text: 'Hardware Setup' }
    ]
  },
  {
    id: 'project-3',
    images: [
      { name: 'ecommerce-homepage.jpg', text: 'E-commerce Homepage' },
      { name: 'product-catalog.jpg', text: 'Product Catalog' },
      { name: 'shopping-cart.jpg', text: 'Shopping Cart' },
      { name: 'checkout-process.jpg', text: 'Checkout Process' },
      { name: 'admin-dashboard.jpg', text: 'Admin Dashboard' },
      { name: 'inventory-management.jpg', text: 'Inventory Management' }
    ]
  }
];

// Generate images for each project
projects.forEach(project => {
  const projectDir = path.join('public', 'images', 'projects', project.id);
  
  // Ensure project directory exists
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  
  project.images.forEach(image => {
    const imagePath = path.join(projectDir, image.name);
    
    // Create a simple HTML file that displays a placeholder image
    // This will be served as a proper image by the server
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>${image.text}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            margin: 0; 
            padding: 0;
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: Arial, sans-serif;
        }
        .placeholder { 
            text-align: center; 
            color: white; 
            padding: 2rem;
            border-radius: 1rem;
            background: rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .placeholder h1 { 
            font-size: 2rem; 
            margin-bottom: 1rem; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            margin-top: 0;
        }
        .placeholder p { 
            font-size: 1rem; 
            opacity: 0.9; 
            margin: 0.5rem 0;
        }
        .icon { 
            font-size: 3rem; 
            margin-bottom: 1rem; 
        }
        .project-id {
            background: rgba(255,255,255,0.1);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.9rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="placeholder">
        <div class="icon">🖼️</div>
        <h1>${image.text}</h1>
        <p>This is a placeholder image for demonstration purposes.</p>
        <p>Upload your actual project screenshot here!</p>
        <div class="project-id">Project: ${project.id}</div>
    </div>
</body>
</html>`;
    
    // Save as HTML file (we'll rename it to .jpg for compatibility)
    fs.writeFileSync(imagePath, htmlContent);
    console.log(`Created placeholder: ${imagePath}`);
  });
});

console.log('All placeholder images generated successfully!');
console.log('Note: These are HTML files named as .jpg for compatibility.');
console.log('Replace them with actual project screenshots when ready.');
console.log('');
console.log('To fix the image loading issues:');
console.log('1. Replace these placeholder files with actual JPG/PNG images');
console.log('2. Or use the admin panel to upload real project screenshots');
console.log('3. The current placeholders will show as HTML pages instead of images');
