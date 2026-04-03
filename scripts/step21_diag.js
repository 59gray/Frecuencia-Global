const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  
  console.log('Current URL:', page.url());
  
  // Navigate to fonts page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(5000);
  console.log('After nav URL:', page.url());
  
  await page.screenshot({ path: 'scripts/diag21.png', fullPage: false });
  
  // Dump all spans with text in the main area
  const spans = await page.evaluate(() => {
    const results = [];
    for (const span of document.querySelectorAll('span')) {
      const text = span.textContent?.trim();
      if (!text || text.length > 50) continue;
      const r = span.getBoundingClientRect();
      if (r.x > 200 && r.y > 100 && r.y < 1000 && r.width > 30) {
        results.push({ text, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
      }
    }
    return results;
  });
  
  console.log('\nAll spans in main area:');
  for (const s of spans) {
    console.log(`  (${s.x},${s.y}) ${s.w}x${s.h} "${s.text}"`);
  }
  
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
