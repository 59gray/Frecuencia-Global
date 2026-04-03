const puppeteer = require('puppeteer-core');

const COLORS = [
  { name: 'Negro Profundo', hex: '0A0A0F' },
  { name: 'Cian Eléctrico', hex: '00E5FF' },
  { name: 'Magenta Neón', hex: 'FF00E5' },
  { name: 'Grafito Azulado', hex: '1A1A2E' },
  { name: 'Verde Ácido', hex: 'B8FF00' },
  { name: 'Blanco Puro', hex: 'FFFFFF' },
  { name: 'Gris Claro', hex: 'A0A0B8' },
  { name: 'Azul Profundo', hex: '4A6BFF' },
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Conectando a Chrome en puerto 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null,
  });

  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com/brand'));
  if (!page) {
    console.error('No se encontró la página del Brand Kit');
    process.exit(1);
  }

  console.log('Conectado al Brand Kit:', page.url());
  await page.bringToFront();
  
  // Take screenshot to see current state
  await page.screenshot({ path: 'scripts/brandkit_state.png', fullPage: false });
  console.log('Screenshot guardado en scripts/brandkit_state.png');
  
  // Get page content to understand structure
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  console.log('=== Contenido visible ===');
  console.log(bodyText);
  console.log('=========================');

})();
