const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Make sure we're on main Brand Kit page
  if (!page.url().includes('/brand/kAGEfgAcmZ0') || page.url().includes('/ingredient/')) {
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(5000);
  }

  // Find the Logos section card and its clickable area
  const logosInfo = await page.evaluate(() => {
    // Find the "Logos" text element
    const allP = [...document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5')];
    const logosLabel = allP.find(el => {
      const text = el.textContent.trim();
      return text === 'Logos' && el.children.length === 0;
    });

    if (!logosLabel) return { error: 'Logos label not found' };

    const labelRect = logosLabel.getBoundingClientRect();
    
    // Walk up to find the clickable card container
    let card = logosLabel;
    let cardInfo = [];
    for (let i = 0; i < 10; i++) {
      card = card.parentElement;
      if (!card) break;
      const r = card.getBoundingClientRect();
      const hasClick = card.onclick !== null;
      const hasRole = card.getAttribute('role');
      const fiber = Object.keys(card).find(k => k.startsWith('__reactFiber'));
      let hasReactClick = false;
      if (fiber) {
        let f = card[fiber];
        for (let step = 0; step < 20; step++) {
          if (!f) break;
          if (f.memoizedProps?.onClick) {
            hasReactClick = true;
            break;
          }
          f = f.return;
        }
      }
      
      cardInfo.push({
        depth: i,
        tag: card.tagName,
        role: hasRole,
        hasClick,
        hasReactClick,
        y: Math.round(r.y),
        x: Math.round(r.x),
        w: Math.round(r.width),
        h: Math.round(r.height),
        children: card.children.length,
        text: card.textContent.trim().substring(0, 60)
      });
    }

    // Also check the "Logos" label itself and siblings
    const parent = logosLabel.parentElement;
    const siblings = parent ? [...parent.children].map(c => ({
      tag: c.tagName,
      text: c.textContent.trim().substring(0, 40),
      role: c.getAttribute('role'),
      y: Math.round(c.getBoundingClientRect().y),
      x: Math.round(c.getBoundingClientRect().x),
      w: Math.round(c.getBoundingClientRect().width),
      h: Math.round(c.getBoundingClientRect().height)
    })) : [];

    return { 
      labelY: Math.round(labelRect.y), 
      labelX: Math.round(labelRect.x),
      ancestors: cardInfo, 
      siblings
    };
  });

  console.log('=== LOGOS CARD ANALYSIS ===');
  console.log('Label at:', logosInfo.labelY, logosInfo.labelX);
  console.log('\nAncestors (from label upward):');
  logosInfo.ancestors?.forEach(a => {
    console.log(`  depth=${a.depth} [${a.tag}] role=${a.role} click=${a.hasClick} reactClick=${a.hasReactClick} ${a.w}x${a.h} at (${a.x},${a.y}) children=${a.children} text="${a.text}"`);
  });
  console.log('\nSiblings:');
  logosInfo.siblings?.forEach(s => {
    console.log(`  [${s.tag}] role=${s.role} ${s.w}x${s.h} at (${s.x},${s.y}): "${s.text}"`);
  });

  // Now find what's clickable in the Logos column (x≈96, y≈180 to y≈270)
  const clickables = await page.evaluate(() => {
    const results = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      // In the Logos column area
      if (r.x >= 80 && r.x < 280 && r.y >= 170 && r.y < 280 && r.width > 20) {
        const role = el.getAttribute('role');
        const fiber = Object.keys(el).find(k => k.startsWith('__reactFiber'));
        let reactClickDepth = -1;
        if (fiber) {
          let f = el[fiber];
          for (let step = 0; step < 15; step++) {
            if (!f) break;
            if (f.memoizedProps?.onClick) {
              reactClickDepth = step;
              break;
            }
            f = f.return;
          }
        }
        results.push({
          tag: el.tagName,
          id: el.id,
          role,
          text: el.textContent.trim().substring(0, 40),
          y: Math.round(r.y),
          x: Math.round(r.x),
          w: Math.round(r.width),
          h: Math.round(r.height),
          reactClickDepth,
          tabIndex: el.tabIndex,
          cursor: getComputedStyle(el).cursor
        });
      }
    }
    return results;
  });

  console.log('\nClickable elements in Logos area (x=80-280, y=170-280):');
  clickables.forEach(c => {
    console.log(`  [${c.tag}] y=${c.y} x=${c.x} ${c.w}x${c.h} role=${c.role} reactClick=${c.reactClickDepth} tabIndex=${c.tabIndex} cursor=${c.cursor}: "${c.text}"`);
  });

  process.exit(0);
})();
