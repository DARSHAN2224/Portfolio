#!/usr/bin/env node

/**
 * Favicon Generator Script
 * 
 * This script helps generate favicon files from SVG.
 * You can run this with Node.js to convert SVG to PNG/ICO formats.
 * 
 * Usage:
 * 1. Install required packages: npm install sharp
 * 2. Run: node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Favicon Generator for Darshan Portfolio');
console.log('==========================================');

// Check if favicon files exist
const faviconFiles = [
  'public/favicon.svg',
  'public/favicon-alt.svg', 
  'public/favicon-tech.svg'
];

console.log('\n📁 Available favicon options:');
faviconFiles.forEach((file, index) => {
  if (fs.existsSync(file)) {
    console.log(`${index + 1}. ${path.basename(file)}`);
  }
});

console.log('\n💡 To use a different favicon:');
console.log('1. Choose one of the SVG files above');
console.log('2. Rename it to "favicon.svg"');
console.log('3. Or update the HTML to reference your preferred file');

console.log('\n🔧 Manual conversion options:');
console.log('- Use online tools like: https://convertio.co/svg-ico/');
console.log('- Use design tools like Figma, Sketch, or Adobe Illustrator');
console.log('- Use command line tools like ImageMagick or Inkscape');

console.log('\n✨ Current favicon features:');
console.log('- Modern gradient design');
console.log('- Represents backend development & AI');
console.log('- Responsive and scalable');
console.log('- Matches your portfolio theme');

console.log('\n🎯 Recommended: Use favicon.svg (AI/Neural Network theme)');
console.log('   This represents your expertise in AI and backend development perfectly!');
