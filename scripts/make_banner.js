const sharp = require('sharp');
const path = require('path');

const W = 1600;
const H = 400;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0A0A0F"/>
  <defs>
    <pattern id="g" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0L0 0 0 80" fill="none" stroke="#1A1A2E" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>

  <!-- Corchetes -->
  <path d="M80 100H50v200h30" stroke="#00E5FF" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.6"/>
  <path d="M1520 100h30v200h-30" stroke="#00E5FF" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.6"/>

  <!-- Wordmark -->
  <text x="800" y="170" font-family="Arial Black, Arial, sans-serif" font-size="54" font-weight="900" letter-spacing="8" fill="#F6F7F9" text-anchor="middle">FRECUENCIA GLOBAL</text>

  <!-- Signal line + nodo -->
  <line x1="300" y1="220" x2="1300" y2="220" stroke="#00E5FF" stroke-width="4" stroke-linecap="round"/>
  <circle cx="800" cy="220" r="12" fill="#00E5FF"/>
  <circle cx="300" cy="220" r="4" fill="#00E5FF" opacity="0.5"/>
  <circle cx="1300" cy="220" r="4" fill="#00E5FF" opacity="0.5"/>

  <!-- Tagline -->
  <text x="800" y="280" font-family="Arial, sans-serif" font-size="20" letter-spacing="3" fill="#A0A0B8" text-anchor="middle">ANALISIS INTERNACIONAL CON PULSO ELECTRONICO</text>

  <!-- Pillar accent bars -->
  <rect x="400" y="380" width="120" height="3" rx="1.5" fill="#00E5FF" opacity="0.7"/>
  <rect x="600" y="380" width="120" height="3" rx="1.5" fill="#FF00E5" opacity="0.7"/>
  <rect x="880" y="380" width="120" height="3" rx="1.5" fill="#B8FF00" opacity="0.7"/>
  <rect x="1080" y="380" width="120" height="3" rx="1.5" fill="#4A6BFF" opacity="0.7"/>
</svg>`;

const outPath = path.join(__dirname, '..', 'Frecuencia_Global_Assets_Base', 'assets', 'fg_banner_team.png');

sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)
  .then(info => {
    console.log(`OK: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
    console.log(`Saved to: ${outPath}`);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
