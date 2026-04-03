const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle2', timeout: 45000 });
  await delay(6000);
  
  // Find ALL elements whose text is exactly "Fonts" or contains "Fonts"
  const fontsEls = await page.evaluate(() => {
    const results = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
      if (ownText !== 'Fonts') continue;
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      // Walk up to find clickable parent
      let clickableParent = null;
      let p = el;
      while (p.parentElement) {
        p = p.parentElement;
        const pcs = window.getComputedStyle(p);
        if (pcs.cursor === 'pointer') {
          const pr = p.getBoundingClientRect();
          clickableParent = { tag: p.tagName, x: Math.round(pr.x), y: Math.round(pr.y), w: Math.round(pr.width), h: Math.round(pr.height), cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2 };
          break;
        }
      }
      results.push({
        tag: el.tagName,
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        cursor: cs.cursor,
        parent: clickableParent,
      });
    }
    return results;
  });
  
  console.log('Elements with text "Fonts":');
  for (const el of fontsEls) {
    console.log(`  ${el.tag} (${el.x},${el.y}) ${el.w}x${el.h} cursor=${el.cursor}`);
    if (el.parent) {
      console.log(`    ↑ clickable parent: ${el.parent.tag} (${el.parent.x},${el.parent.y}) ${el.parent.w}x${el.parent.h}`);
    }
  }
  
  // If we found a clickable parent, click it
  const clickTarget = fontsEls.find(e => e.parent)?.parent || (fontsEls.length > 0 ? fontsEls[0] : null);
  if (clickTarget) {
    const cx = clickTarget.cx || (clickTarget.x + clickTarget.w / 2);
    const cy = clickTarget.cy || (clickTarget.y + clickTarget.h / 2);
    console.log(`\nClicking at (${cx|0}, ${cy|0})`);
    await page.mouse.click(cx, cy);
    await delay(8000);
    
    console.log('After click URL:', page.url());
    await page.screenshot({ path: 'scripts/diag22_after_fonts.png' });
    
    // Check for font category rows
    const text = await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode.textContent?.trim();
        if (t && t.length > 2 && t.length < 30) {
          const range = document.createRange();
          range.selectNode(walker.currentNode);
          const r = range.getBoundingClientRect();
          if (r.x > 200 && r.y > 100 && r.y < 1200) {
            results.push({ text: t, x: Math.round(r.x), y: Math.round(r.y) });
          }
        }
      }
      return results;
    });
    
    console.log('\nContent after clicking Fonts:');
    for (const t of text) {
      console.log(`  (${t.x},${t.y}) "${t.text}"`);
    }
  } else {
    console.log('No clickable Fonts element found');
  }
  
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
