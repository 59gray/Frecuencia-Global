const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  
  console.log('Current URL:', page.url());
  
  // Navigate to brand kit main page first
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle2', timeout: 45000 });
  await delay(8000);
  
  console.log('After nav URL:', page.url());
  await page.screenshot({ path: 'scripts/diag21b_1.png' });
  
  // Check if sidebar has Fonts link
  const links = await page.evaluate(() => {
    const results = [];
    const all = document.querySelectorAll('a, button, [role="tab"], [role="link"]');
    for (const el of all) {
      const text = el.textContent?.trim();
      if (!text || text.length > 30) continue;
      const r = el.getBoundingClientRect();
      if (r.x < 250 && r.y > 100) {
        results.push({ text, tag: el.tagName, href: el.href || '', x: Math.round(r.x), y: Math.round(r.y) });
      }
    }
    return results;
  });
  
  console.log('\nSidebar links/buttons:');
  for (const l of links) {
    console.log(`  (${l.x},${l.y}) ${l.tag} "${l.text}" ${l.href ? l.href.substring(0,60) : ''}`);
  }

  // Look for "Fonts" link in sidebar
  const fontsLink = links.find(l => l.text === 'Fonts');
  if (fontsLink) {
    console.log('\nFound Fonts link, clicking...');
    await page.mouse.click(fontsLink.x + 30, fontsLink.y + 10);
    await delay(4000);
    await page.screenshot({ path: 'scripts/diag21b_2.png' });
    
    // Now dump content
    const spans = await page.evaluate(() => {
      const results = [];
      for (const el of document.querySelectorAll('span, p, div')) {
        const text = el.textContent?.trim();
        if (!text || text.length > 80 || text.length < 3) continue;
        // Only own text
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
        if (!ownText || ownText.length < 3) continue;
        const r = el.getBoundingClientRect();
        if (r.x > 200 && r.y > 100 && r.y < 1200 && r.width > 30) {
          results.push({ text: ownText.substring(0, 50), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), tag: el.tagName });
        }
      }
      return results;
    });
    
    console.log('\nContent after clicking Fonts:');
    for (const s of spans) {
      console.log(`  (${s.x},${s.y}) ${s.w}x${s.h} ${s.tag} "${s.text}"`);
    }
  } else {
    console.log('\nFonts link NOT found in sidebar');
    
    // Dump all text on page
    const allText = await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent?.trim();
        if (text && text.length > 2 && text.length < 50) {
          const range = document.createRange();
          range.selectNode(walker.currentNode);
          const r = range.getBoundingClientRect();
          if (r.width > 10 && r.y > 0 && r.y < 1200) {
            results.push({ text, x: Math.round(r.x), y: Math.round(r.y) });
          }
        }
      }
      return results;
    });
    console.log('\nAll text on page:');
    for (const t of allText) {
      console.log(`  (${t.x},${t.y}) "${t.text}"`);
    }
  }
  
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
