const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  console.log('Navigating to fonts page...');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) { console.log(`Content ready after ${i + 1}s`); await delay(3000); break; }
  }

  // Try each category
  const categories = ['Title', 'Subtitle', 'Heading', 'Subheading'];

  for (const cat of categories) {
    // Navigate fresh
    await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    for (let i = 0; i < 20; i++) {
      await delay(1000);
      const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
      if (ready) { await delay(3000); break; }
    }

    const span = await page.evaluate((category) => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== category) continue;
        if (window.getComputedStyle(el).cursor !== 'pointer') continue;
        const r = el.getBoundingClientRect();
        return { x: r.x + 40, y: r.y + r.height / 2 };
      }
      return null;
    }, cat);

    if (!span) { console.log(`${cat}: NOT FOUND`); continue; }

    // First hover over center of page (like the working test did)
    await page.mouse.move(400, 389);
    await delay(1000);

    // Double-click on category
    console.log(`Double-clicking ${cat} at (${span.x|0}, ${span.y|0})`);
    await page.mouse.click(span.x, span.y, { clickCount: 2 });
    await delay(3000);

    const fontBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Choose a font' || label.startsWith('Font:')) return label;
      }
      return null;
    });

    console.log(`  ${cat}: fontBtn = ${fontBtn || 'null'}`);
    
    if (fontBtn) {
      await page.screenshot({ path: `scripts/diag23_${cat}_expanded.png` });
      // Discard
      const disc = await page.evaluate(() => {
        for (const b of document.querySelectorAll('button[aria-label="Discard"]')) {
          const r = b.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
        return null;
      });
      if (disc) { await page.mouse.click(disc.x, disc.y); await delay(2000); }
    } else {
      await page.screenshot({ path: `scripts/diag23_${cat}_failed.png` });
    }
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
