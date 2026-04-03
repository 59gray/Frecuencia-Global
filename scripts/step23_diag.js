const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  console.log('Navigating to fonts page...');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Poll for content
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => {
      return (document.body.textContent || '').includes('Subtitle');
    });
    if (ready) {
      console.log(`Content ready after ${i + 1}s`);
      await delay(2000);
      break;
    }
    if (i === 19) console.log('Timed out waiting');
  }

  // Screenshot
  await page.screenshot({ path: 'scripts/diag23_page.png' });

  // Look for all text elements with font-related labels
  const labels = ['Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];
  
  for (const label of labels) {
    const found = await page.evaluate((lbl) => {
      const allEls = document.querySelectorAll('*');
      const results = [];
      for (const el of allEls) {
        // Check textContent
        const tc = (el.textContent || '').trim();
        if (tc !== lbl) continue; // Exact match only to avoid partial
        
        const r = el.getBoundingClientRect();
        if (r.width < 5 || r.height < 5) continue;
        if (r.y < 0 || r.y > 2000) continue;
        
        const cs = window.getComputedStyle(el);
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        
        results.push({
          tag: el.tagName,
          ownText: ownText.substring(0, 50),
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
          cursor: cs.cursor,
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          childCount: el.children.length,
        });
      }
      return results;
    }, label);

    console.log(`\n"${label}" — ${found.length} exact textContent matches:`);
    for (const f of found) {
      console.log(`  ${f.tag} ownText="${f.ownText}" (${f.x},${f.y}) ${f.w}x${f.h} cursor=${f.cursor} role=${f.role} children=${f.childCount}`);
    }
  }

  // Also check: are there any clickable elements in the row area?
  const clickables = await page.evaluate(() => {
    const results = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      const r = el.getBoundingClientRect();
      if (r.x < 70 || r.x > 900 || r.y < 200 || r.y > 800 || r.width < 40) continue;
      const cs = window.getComputedStyle(el);
      if (cs.cursor !== 'pointer') continue;
      
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      const tc = (el.textContent || '').trim();
      
      results.push({
        tag: el.tagName,
        ownText: ownText.substring(0, 50),
        textContent: tc.substring(0, 80),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        role: el.getAttribute('role'),
      });
    }
    // Deduplicate by position
    const seen = new Set();
    return results.filter(r => {
      const key = `${r.x},${r.y},${r.w},${r.h}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });

  console.log(`\n\nClickable elements (cursor:pointer) in main area:`);
  for (const c of clickables) {
    console.log(`  ${c.tag} (${c.x},${c.y}) ${c.w}x${c.h} role=${c.role} own="${c.ownText}" tc="${c.textContent}"`);
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
