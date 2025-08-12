import fs from 'fs';
import path from 'path';

// Create a simple SVG placeholder image
function createPlaceholderSVG(width, height, text, color = '#3b82f6') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
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
    const svgContent = createPlaceholderSVG(800, 600, image.text);
    
    // Convert SVG to a simple HTML file that can be served
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>${image.text}</title>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .placeholder { text-align: center; color: white; font-family: Arial, sans-serif; }
        .placeholder h1 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .placeholder p { font-size: 1.2rem; opacity: 0.9; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="placeholder">
        <div class="icon">🖼️</div>
        <h1>${image.text}</h1>
        <p>Project: ${project.id}</p>
        <p>This is a placeholder image for demonstration purposes.</p>
        <p>Upload your actual project screenshot here!</p>
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
