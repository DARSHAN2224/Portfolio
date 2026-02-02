const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'frontend', 'public', 'images', 'projects');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const templates = [
    {
        name: 'food-ordering.svg',
        color1: '#4C1D95', // Purple
        color2: '#1E3A8A', // Blue
        icon: '🥡',
        title: 'Food Ordering System',
        subtitle: 'Multi-Role Dashboard'
    },
    {
        name: 'voice-converter.svg',
        color1: '#0F766E', // Teal
        color2: '#064E3B', // Emerald
        icon: '🎙️',
        title: 'Voice Converter',
        subtitle: 'Real-Time AI Translation'
    },
    {
        name: 'healthcare-ai.svg',
        color1: '#0369A1', // Sky
        color2: '#1D4ED8', // Blue
        icon: '🧠',
        title: 'HealthCare AI',
        subtitle: 'Mental Health Platform'
    }
];

const generateSVG = ({ color1, color2, icon, title, subtitle }) => `
<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="glass" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#grad)" />
    
    <!-- Grid Pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-opacity="0.1" stroke-width="1"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#grid)" />

    <!-- Glass Card -->
    <rect x="100" y="75" width="600" height="300" rx="15" fill="white" fill-opacity="0.1" stroke="white" stroke-opacity="0.2" stroke-width="2" />
    
    <!-- Content -->
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="80" fill="white">${icon}</text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">${title}</text>
    <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)">${subtitle}</text>
</svg>
`;

templates.forEach(t => {
    const svgContent = generateSVG(t);
    fs.writeFileSync(path.join(outputDir, t.name), svgContent.trim());
    console.log(`Generated ${t.name}`);
});
