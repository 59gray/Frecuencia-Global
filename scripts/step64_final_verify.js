const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 90000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  const checks = [
    ['Brand voice', 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9fRIO_'],
    ['Photos', 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw'],
    ['Graphics', 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9x-Pgo'],
    ['Icons', 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9WINe6'],
    ['Charts', 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9_o_EG']
  ];

  for (const [name, url] of checks) {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(6000);

    const bodyText = await page.evaluate(() => {
      const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
      return main.innerText.substring(0, 1500);
    });

    // Extract the guideline content (after the category name, before "Stay on brand")
    const lines = bodyText.split('\n').filter(l => l.trim().length > 0);
    const guidelineLines = lines.filter(l => 
      !l.includes('Main content') && !l.includes('Brand Kit') && 
      !l.includes('Stay on brand') && !l.includes('Add brand assets') &&
      !l.includes('Rename this') && !l.includes('consistency across') &&
      l.length > 10
    );

    const hasContent = guidelineLines.some(l => l.length > 30 && l !== name && l !== 'Guidelines');
    console.log(`${hasContent ? '✅' : '❌'} ${name}:`);
    guidelineLines.forEach(l => {
      if (l.length > 15 && l !== name && l !== 'Guidelines') {
        console.log(`   "${l.substring(0, 150)}"`);
      }
    });
  }

  process.exit(0);
})();
