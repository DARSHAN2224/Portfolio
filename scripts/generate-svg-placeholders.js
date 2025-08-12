import fs from 'fs';
import path from 'path';

// Create SVG placeholder images
function createSVGPlaceholder(width, height, text, projectId, color = '#3b82f6') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)"/>
    <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="10"/>
    
    <!-- Main Icon -->
    <circle cx="${width/2}" cy="${height/2 - 40}" r="30" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
    <text x="${width/2}" y="${height/2 - 40}" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">🖼️</text>
    
    <!-- Title -->
    <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">${text}</text>
    
    <!-- Project ID -->
    <text x="${width/2}" y="${height/2 + 25}" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle">Project: ${projectId}</text>
    
    <!-- Instructions -->
    <text x="${width/2}" y="${height/2 + 45}" font-family="Arial, sans-serif" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">Upload your screenshot here</text>
    
    <!-- Decorative elements -->
    <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.3)"/>
    <circle cx="${width-20}" cy="20" r="3" fill="rgba(255,255,255,0.3)"/>
    <circle cx="20" cy="${height-20}" r="3" fill="rgba(255,255,255,0.3)"/>
    <circle cx="${width-20}" cy="${height-20}" r="3" fill="rgba(255,255,255,0.3)"/>
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

// Generate SVG images for each project
projects.forEach(project => {
  const projectDir = path.join('public', 'images', 'projects', project.id);
  
  // Ensure project directory exists
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  
  project.images.forEach(image => {
    const imagePath = path.join(projectDir, image.name);
    
    // Create SVG content
    const svgContent = createSVGPlaceholder(800, 600, image.text, project.id);
    
    // Save as SVG file (we'll rename it to .jpg for compatibility)
    fs.writeFileSync(imagePath, svgContent);
    console.log(`Created SVG placeholder: ${imagePath}`);
  });
});

console.log('All SVG placeholder images generated successfully!');
console.log('Note: These are SVG files named as .jpg for compatibility.');
console.log('SVG files can be displayed in img tags and will work properly.');
console.log('');
console.log('To replace with real images:');
console.log('1. Use the admin panel to upload actual project screenshots');
console.log('2. Or manually replace the .jpg files with real JPG/PNG images');
console.log('3. The current SVG placeholders will display correctly in the carousel');
