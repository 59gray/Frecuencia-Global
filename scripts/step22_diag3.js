const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle2', timeout: 45000 });
  await delay(6000);
  
  // Find the "Fonts" text, then explore all ancestors
  const ancestors = await page.evaluate(() => {
    const allP = document.querySelectorAll('p');
    for (const p of allP) {
      if (p.textContent.trim() === 'Fonts') {
        const r = p.getBoundingClientRect();
        if (r.x > 400) {
          // Walk up ALL ancestors
          const chain = [];
          let el = p;
          while (el) {
            const er = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            chain.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || '').toString().substring(0, 80),
              role: el.getAttribute('role'),
              href: el.href || el.getAttribute('href'),
              onclick: !!el.onclick,
              cursor: cs.cursor,
              x: Math.round(er.x), y: Math.round(er.y),
              w: Math.round(er.width), h: Math.round(er.height),
              hasDataAttrs: [...el.attributes].filter(a => a.name.startsWith('data-')).map(a => a.name).join(','),
            });
            el = el.parentElement;
          }
          return chain;
        }
      }
    }
    return null;
  });
  
  if (ancestors) {
    console.log('Ancestor chain for "Fonts" text (p → body):');
    for (const a of ancestors) {
      console.log(`  ${a.tag} id="${a.id}" role="${a.role}" href="${a.href}" cursor=${a.cursor} onclick=${a.onclick} (${a.x},${a.y}) ${a.w}x${a.h}`);
      if (a.hasDataAttrs) console.log(`    data attrs: ${a.hasDataAttrs}`);
      if (a.className) console.log(`    class: ${a.className}`);
    }
  }
  
  // Also look for ALL <a> tags on the page that might link to fonts
  const allLinks = await page.evaluate(() => {
    const results = [];
    for (const a of document.querySelectorAll('a')) {
      const href = a.href || '';
      if (href.includes('font') || href.includes('ingredient')) {
        const r = a.getBoundingClientRect();
        results.push({ href, text: a.textContent?.trim().substring(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) });
      }
    }
    return results;
  });
  
  console.log('\nLinks containing "font" or "ingredient":');
  for (const l of allLinks) {
    console.log(`  "${l.text}" → ${l.href} (${l.x},${l.y}) w=${l.w}`);
  }
  
  // Try clicking the IMAGE area of the Fonts card (above the text)
  // The text "Fonts" is at y=393, the card image should be from about y=200 to y=380
  console.log('\nTrying click at card image center (650, 300)...');
  await page.mouse.click(650, 300);
  await delay(8000);
  
  console.log('After click URL:', page.url());
  await page.screenshot({ path: 'scripts/diag22_card_click.png' });
  
  // Check if page changed
  const hasSubtitle = await page.evaluate(() => document.body.textContent.includes('Subtitle'));
  console.log('Has Subtitle text:', hasSubtitle);
  
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
