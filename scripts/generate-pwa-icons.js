import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create a simple SVG icon
function createSVGIcon(size, text) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#3b82f6"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">${text}</text>
  </svg>`;
}

// Icon sizes needed
const iconSizes = [
  { size: 72, text: '72' },
  { size: 96, text: '96' },
  { size: 128, text: '128' },
  { size: 144, text: '144' },
  { size: 152, text: '152' },
  { size: 192, text: '192' },
  { size: 384, text: '384' },
  { size: 512, text: '512' }
];

// Generate icons
iconSizes.forEach(({ size, text }) => {
  const svg = createSVGIcon(size, text);
  const filePath = path.join(imagesDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Created icon: icon-${size}x${size}.svg`);
});

// Create shortcut icons
const shortcutIcons = [
  { name: 'search-icon-96x96', text: '🔍' },
  { name: 'bookings-icon-96x96', text: '📅' },
  { name: 'planner-icon-96x96', text: '📋' }
];

shortcutIcons.forEach(({ name, text }) => {
  const svg = createSVGIcon(96, text);
  const filePath = path.join(imagesDir, `${name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Created shortcut icon: ${name}.svg`);
});

// Create badge icon
const badgeSVG = createSVGIcon(72, '72');
const badgePath = path.join(imagesDir, 'badge-72x72.svg');
fs.writeFileSync(badgePath, badgeSVG);
console.log('Created badge icon: badge-72x72.svg');

// Create action icons
const actionIcons = [
  { name: 'checkmark', text: '✓' },
  { name: 'xmark', text: '✕' }
];

actionIcons.forEach(({ name, text }) => {
  const svg = createSVGIcon(24, text);
  const filePath = path.join(imagesDir, `${name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Created action icon: ${name}.svg`);
});

console.log('\nPWA icons generated successfully!');
console.log('Note: These are placeholder SVG icons. For production, replace with proper PNG icons.');
