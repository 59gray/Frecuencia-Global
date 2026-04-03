const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 180000);

const URLS = {
  'Photos':   'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw',
  'Graphics': 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9x-Pgo',
  'Icons':    'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9WINe6',
  'Charts':   'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9_o_EG'
};

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  for (const [name, url] of Object.entries(URLS)) {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(6000);

    const result = await page.evaluate(() => {
      // Scroll down to load all content
      window.scrollTo(0, 0);
      
      // Find text in the main content area (y > 200)
      const allText = [];
      document.querySelectorAll('div, p, span').forEach(el => {
        const r = el.getBoundingClientRect();
        const text = el.textContent.trim();
        if (text.length > 20 && r.y > 200 && r.y < 800 && r.width > 200 && r.height > 15 && r.height < 100 && el.children.length < 3) {
          if (!allText.find(t => t.text === text.substring(0, 60))) {
            allText.push({
              text: text.substring(0, 120),
              y: Math.round(r.y)
            });
          }
        }
      });

      // Check for "Edit guidelines" or "More" button near guidelines
      const hasGuidelines = allText.some(t => !t.text.includes('Stay on brand'));
      
      return { content: allText.sort((a,b) => a.y - b.y).slice(0, 6), hasGuidelines };
    });

    const status = result.hasGuidelines ? '✅' : '❌';
    console.log(`${status} ${name}:`);
    result.content.forEach(c => console.log(`   y=${c.y}: "${c.text}"`));
    if (!result.hasGuidelines) console.log('   (No guideline content found)');
  }

  // Also check Brand voice
  console.log('\n--- Brand voice ---');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9fRIO_', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(6000);
  const bv = await page.evaluate(() => {
    const texts = [];
    document.querySelectorAll('div, p, span').forEach(el => {
      const r = el.getBoundingClientRect();
      const text = el.textContent.trim();
      if (text.length > 30 && r.y > 200 && r.y < 800 && r.width > 200 && r.height > 15 && r.height < 150 && el.children.length < 3) {
        if (!texts.find(t => t.text === text.substring(0, 60))) {
          texts.push({ text: text.substring(0, 150), y: Math.round(r.y) });
        }
      }
    });
    return texts.sort((a,b) => a.y - b.y);
  });
  const bvStatus = bv.length > 0 ? '✅' : '❌';
  console.log(`${bvStatus} Brand voice:`);
  bv.forEach(t => console.log(`   y=${t.y}: "${t.text}"`));

  process.exit(0);
})();
