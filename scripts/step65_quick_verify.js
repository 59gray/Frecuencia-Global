const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 60000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Check Brand voice
  console.log('=== BRAND VOICE ===');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9fRIO_', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(8000);
  let text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  let hasContent = text.includes('Frecuencia Global habla') || text.includes('claridad') || text.includes('Brand voice');
  console.log(hasContent ? '✅' : '❌');
  // Extract relevant lines
  let relevant = text.split('\n').filter(l => l.trim().length > 20 && !l.includes('Main content') && !l.includes('Create') && !l.includes('Home') && !l.includes('Projects') && !l.includes('Templates') && !l.includes('Brand') && !l.includes('Canva AI') && !l.includes('Print Shop') && !l.includes('Approvals') && !l.includes('More'));
  relevant.forEach(l => console.log(`  "${l.trim().substring(0, 150)}"`));

  // Quick check Icons
  console.log('\n=== ICONS ===');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9WINe6', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(8000);
  text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  hasContent = text.includes('Geométricos') || text.includes('trazo limpio');
  console.log(hasContent ? '✅' : '❌');
  relevant = text.split('\n').filter(l => l.trim().length > 20 && !l.includes('Main content') && !l.includes('Create') && !l.includes('Home') && !l.includes('Projects'));
  relevant.slice(0, 5).forEach(l => console.log(`  "${l.trim().substring(0, 150)}"`));

  // Quick check Charts
  console.log('\n=== CHARTS ===');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9_o_EG', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(8000);
  text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  hasContent = text.includes('Minimalistas') || text.includes('legibles');
  console.log(hasContent ? '✅' : '❌');
  relevant = text.split('\n').filter(l => l.trim().length > 20 && !l.includes('Main content') && !l.includes('Create') && !l.includes('Home') && !l.includes('Projects'));
  relevant.slice(0, 5).forEach(l => console.log(`  "${l.trim().substring(0, 150)}"`));

  process.exit(0);
})();
