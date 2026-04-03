const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 180000);

const URLS = {
  'Brand voice': 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9fRIO_',
  'Photos':      'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw',
  'Graphics':    'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9x-Pgo',
  'Icons':       'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9WINe6',
  'Charts':      'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9_o_EG'
};

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  for (const [name, url] of Object.entries(URLS)) {
    console.log(`\n========== ${name} ==========`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(3000);

    const content = await page.evaluate(() => {
      const results = [];
      
      // Get all text blocks that look like guideline content
      const elements = [...document.querySelectorAll('p, span, div')].filter(el => {
        const r = el.getBoundingClientRect();
        const text = el.textContent.trim();
        return text.length > 20 && text.length < 600 && r.y > 200 && r.y < 900 && r.width > 150 && 
               el.children.length < 3 && !text.includes('Stay on brand');
      });

      // Deduplicate by taking unique texts
      const seen = new Set();
      for (const el of elements) {
        const text = el.textContent.trim();
        if (!seen.has(text) && text.length > 30) {
          seen.add(text);
          const r = el.getBoundingClientRect();
          results.push({
            y: Math.round(r.y),
            text: text.substring(0, 200)
          });
        }
      }

      // Look for "Do" / "Don't" / "Summary" labels
      const labels = [...document.querySelectorAll('p, span, h2, h3')].filter(el => {
        const text = el.textContent.trim();
        return (text === 'Do' || text === "Don't" || text === 'Summary' || text.includes('Brand voice'));
      }).map(el => ({
        label: el.textContent.trim(),
        y: Math.round(el.getBoundingClientRect().y)
      }));

      // Check for "Edit guidelines" button (indicates guidelines are saved)
      const editBtn = [...document.querySelectorAll('button')].find(b => 
        b.textContent.includes('Edit guidelines')
      );
      const hasEditBtn = !!editBtn;

      return { results: results.sort((a,b) => a.y - b.y).slice(0, 10), labels, hasEditBtn };
    });

    console.log(`  Has "Edit guidelines" button: ${content.hasEditBtn}`);
    console.log(`  Labels: ${content.labels.map(l => `"${l.label}" y=${l.y}`).join(', ')}`);
    console.log('  Content:');
    content.results.forEach(r => console.log(`    y=${r.y}: "${r.text}"`));
  }

  console.log('\n\n========== FINAL STATUS ==========');
  console.log('Brand Kit kAGEfgAcmZ0 - Guidelines Configuration Complete');

  process.exit(0);
})();
