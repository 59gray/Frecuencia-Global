const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  
  // Navigate to brand kit
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle2', timeout: 45000 });
  await delay(6000);
  
  console.log('URL:', page.url());
  await page.screenshot({ path: 'scripts/diag22_1.png' });
  
  // Find the Fonts card more precisely - look for clickable container
  const fontsCard = await page.evaluate(() => {
    const results = [];
    const allEls = document.querySelectorAll('a, button, [role="link"], [role="button"]');
    for (const el of allEls) {
      const tc = el.textContent?.trim() || '';
      if (tc.includes('Fonts') && tc.length < 30) {
        const r = el.getBoundingClientRect();
        if (r.x > 200 && r.y > 100 && r.width > 50) {
          results.push({ 
            tag: el.tagName, 
            role: el.getAttribute('role'),
            href: el.href || '',
            text: tc,
            x: Math.round(r.x), y: Math.round(r.y), 
            w: Math.round(r.width), h: Math.round(r.height),
            cx: r.x + r.width / 2, cy: r.y + r.height / 2
          });
        }
      }
    }
    return results;
  });
  
  console.log('\nFonts card candidates:');
  for (const c of fontsCard) {
    console.log(`  ${c.tag} role=${c.role} (${c.x},${c.y}) ${c.w}x${c.h} href="${c.href}" "${c.text}"`);
  }
  
  if (fontsCard.length > 0) {
    // Click the best one (prefer <a> with href)
    const best = fontsCard.find(c => c.tag === 'A' && c.href) || fontsCard[0];
    console.log(`\nClicking: ${best.tag} at (${best.cx|0},${best.cy|0}), href=${best.href}`);
    
    if (best.tag === 'A' && best.href) {
      // Navigate directly to the href
      console.log('Navigating to:', best.href);
      await page.goto(best.href, { waitUntil: 'networkidle2', timeout: 45000 });
    } else {
      await page.mouse.click(best.cx, best.cy);
    }
    await delay(8000);
    
    console.log('\nAfter click URL:', page.url());
    await page.screenshot({ path: 'scripts/diag22_2.png' });
    
    // Dump page content
    const allText = await page.evaluate(() => {
      const results = [];
      const allEls = document.querySelectorAll('span, p, h1, h2, h3');
      for (const el of allEls) {
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
        if (!ownText || ownText.length < 2 || ownText.length > 60) continue;
        const r = el.getBoundingClientRect();
        if (r.y > 0 && r.y < 1200 && r.x > 50) {
          results.push({ text: ownText, x: Math.round(r.x), y: Math.round(r.y), tag: el.tagName });
        }
      }
      return results;
    });
    console.log('\nPage text content:');
    for (const t of allText) {
      console.log(`  (${t.x},${t.y}) ${t.tag} "${t.text}"`);
    }
  }
  
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
