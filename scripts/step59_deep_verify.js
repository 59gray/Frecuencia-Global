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

  // Just check Photos first to understand the page structure
  console.log('========== PHOTOS PAGE DEEP SCAN ==========');
  await page.goto(URLS['Photos'], { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  const pageTitle = await page.title();
  console.log('Title:', pageTitle);

  // Get ALL visible text on the page
  const allText = await page.evaluate(() => {
    const items = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent.trim();
      if (text.length > 5) {
        const parent = walker.currentNode.parentElement;
        const r = parent.getBoundingClientRect();
        if (r.y > 100 && r.y < 1000 && r.width > 50 && r.height > 0) {
          items.push({
            text: text.substring(0, 120),
            tag: parent.tagName,
            y: Math.round(r.y),
            w: Math.round(r.width)
          });
        }
      }
    }
    // Deduplicate
    const seen = new Set();
    return items.filter(i => {
      const key = i.text.substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a,b) => a.y - b.y);
  });

  console.log(`Found ${allText.length} text nodes:`);
  allText.forEach(t => console.log(`  y=${t.y} w=${t.w} <${t.tag}>: "${t.text}"`));

  // Check for buttons
  const buttons = await page.evaluate(() => {
    return [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({
      text: (b.getAttribute('aria-label') || b.textContent.trim()).substring(0, 50),
      y: Math.round(b.getBoundingClientRect().y)
    })).filter(b => b.y > 100);
  });
  console.log('\nButtons:');
  buttons.forEach(b => console.log(`  y=${b.y}: "${b.text}"`));

  // Check for "Edit guidelines"
  const editGuidelines = await page.evaluate(() => {
    return [...document.querySelectorAll('button, a, [role="button"]')].filter(el => 
      el.textContent.includes('Edit') || el.textContent.includes('guideline')
    ).map(el => ({
      text: el.textContent.trim().substring(0, 60),
      tag: el.tagName,
      y: Math.round(el.getBoundingClientRect().y)
    }));
  });
  console.log('\nEdit/Guidelines elements:', JSON.stringify(editGuidelines));

  process.exit(0);
})();
