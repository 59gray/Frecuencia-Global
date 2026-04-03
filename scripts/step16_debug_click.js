const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com'));
  if (!page) { console.log('No Canva page'); process.exit(1); }
  await page.bringToFront();

  // Navigate fresh
  console.log('Navigating...');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(5000);
  
  // Discard if needed
  const discard = await page.evaluate(() => {
    for (const b of document.querySelectorAll('button')) {
      if (['Leave','Discard'].includes(b.textContent?.trim())) {
        const r = b.getBoundingClientRect();
        return r.width > 30 ? { x: r.x+r.width/2, y: r.y+r.height/2 } : null;
      }
    }
    return null;
  });
  if (discard) { await page.mouse.click(discard.x, discard.y); await delay(3000); }
  
  await delay(2000);

  // Find Subtitle row
  const row = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (ownText === 'Subtitle' && el.tagName === 'SPAN') {
        const r = el.getBoundingClientRect();
        if (r.x > 300 && r.width > 50) {
          // Return left-aligned click position
          return { x: Math.round(r.x + 20), y: Math.round(r.y + r.height / 2), rx: Math.round(r.x), rw: Math.round(r.width) };
        }
      }
    }
    return null;
  });
  
  if (!row) { console.log('Subtitle row not found'); process.exit(1); }
  console.log(`Subtitle SPAN at x=${row.rx}, w=${row.rw}. Clicking at (${row.x}, ${row.y})`);
  await page.mouse.click(row.x, row.y);
  await delay(2500);
  await page.screenshot({ path: 'scripts/test_click_sub.png' });
  
  // Now find ALL buttons on the page in the area where the Font dropdown should be
  const allBtns = await page.evaluate(() => {
    const results = [];
    for (const btn of document.querySelectorAll('button')) {
      const r = btn.getBoundingClientRect();
      if (r.width > 30 && r.height > 10 && r.y > 280 && r.y < 600) {
        results.push({
          text: btn.textContent?.trim()?.substring(0, 60),
          ariaLabel: btn.getAttribute('aria-label') || '',
          x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        });
      }
    }
    return results;
  });
  
  console.log('\nAll buttons in y=280-600:');
  allBtns.forEach(b => console.log(`  text="${b.text}" aria="${b.ariaLabel}" pos=(${b.x},${b.y}) ${b.w}x${b.h}`));
  
  // Also check: is the parent of Subtitle row clickable?
  const parentInfo = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (ownText === 'Subtitle' && el.tagName === 'SPAN') {
        let p = el.parentElement;
        const chain = [];
        while (p && chain.length < 5) {
          const cs = window.getComputedStyle(p);
          const r = p.getBoundingClientRect();
          chain.push({
            tag: p.tagName, 
            cursor: cs.cursor,
            role: p.getAttribute('role') || '',
            x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
          });
          p = p.parentElement;
        }
        return chain;
      }
    }
    return null;
  });
  
  console.log('\nParent chain of Subtitle span:');
  parentInfo?.forEach((p, i) => console.log(`  ${'  '.repeat(i)}${p.tag} cursor=${p.cursor} role="${p.role}" (${p.x},${p.y}) ${p.w}x${p.h}`));
  
  process.exit(0);
})();
