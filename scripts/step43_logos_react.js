const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Find and click the Logos card using React event dispatch
  console.log('=== CLICKING LOGOS CARD WITH REACT EVENTS ===');
  const clickResult = await page.evaluate(() => {
    // Find Logos label
    let logosY = null, logosX = null;
    for (const el of document.querySelectorAll('p, span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own === 'Logos') {
        const r = el.getBoundingClientRect();
        if (r.y > 200 && r.width > 10) { logosY = r.y; logosX = r.x; break; }
      }
    }
    if (!logosY) return { error: 'no logos label' };

    // Find card
    const card = [...document.querySelectorAll('[role="button"]')]
      .find(c => {
        const cr = c.getBoundingClientRect();
        return cr.y > logosY && cr.y < logosY + 100 && Math.abs(cr.x - logosX) < 50 && cr.width > 100;
      });
    if (!card) return { error: 'no card' };

    const cr = card.getBoundingClientRect();
    const cx = cr.x + cr.width / 2;
    const cy = cr.y + cr.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };

    // Full React-compatible event dispatch
    card.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
    card.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
    card.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
    card.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
    card.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
    card.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));

    // Also check React fiber for onClick
    const fk = Object.keys(card).find(k => k.startsWith('__reactFiber'));
    if (fk) {
      let fiber = card[fk];
      const handlers = [];
      while (fiber) {
        if (fiber.memoizedProps?.onClick) {
          handlers.push({ type: fiber.type?.toString().substring(0, 30) || 'unknown', native: fiber.memoizedProps.onClick.toString().includes('[native code]') });
        }
        fiber = fiber.return;
      }
      return { dispatched: true, cx: Math.round(cx), cy: Math.round(cy), fiberHandlers: handlers };
    }
    return { dispatched: true, cx: Math.round(cx), cy: Math.round(cy), noFiber: true };
  });
  console.log('Result:', JSON.stringify(clickResult));
  await delay(3000);
  console.log('URL:', page.url());

  // Check for navigation or modal
  const afterClick = await page.evaluate(() => {
    const result = {
      dialogs: [...document.querySelectorAll('[role="dialog"]')].map(d => d.textContent.trim().substring(0, 100)),
      fileInputs: [...document.querySelectorAll('input[type="file"]')].length,
      newButtons: [],
      pageText: []
    };
    // Check for any new buttons
    for (const btn of document.querySelectorAll('button')) {
      const r = btn.getBoundingClientRect();
      if (r.width > 10) {
        const text = btn.textContent.trim();
        const label = btn.getAttribute('aria-label') || '';
        if (text.toLowerCase().includes('upload') || label.toLowerCase().includes('upload') ||
            text.toLowerCase().includes('add') || label.toLowerCase().includes('add')) {
          result.newButtons.push({ text, label, y: Math.round(r.y) });
        }
      }
    }
    return result;
  });
  console.log('After click:', JSON.stringify(afterClick));

  // Try calling the React fiber onClick directly 
  if (clickResult.fiberHandlers?.some(h => h.native)) {
    console.log('\n=== CALLING REACT FIBER onClick ===');
    const fiberResult = await page.evaluate(() => {
      let logosY = null, logosX = null;
      for (const el of document.querySelectorAll('p, span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own === 'Logos') {
          const r = el.getBoundingClientRect();
          if (r.y > 200 && r.width > 10) { logosY = r.y; logosX = r.x; break; }
        }
      }
      const card = [...document.querySelectorAll('[role="button"]')]
        .find(c => {
          const cr = c.getBoundingClientRect();
          return cr.y > logosY && cr.y < logosY + 100 && Math.abs(cr.x - logosX) < 50 && cr.width > 100;
        });
      if (!card) return 'no card';
      
      const fk = Object.keys(card).find(k => k.startsWith('__reactFiber'));
      if (!fk) return 'no fiber';
      let fiber = card[fk];
      while (fiber) {
        if (fiber.memoizedProps?.onClick?.toString().includes('[native code]')) {
          try {
            fiber.memoizedProps.onClick();
            return 'called native onClick';
          } catch(e) { return 'error: ' + e.message; }
        }
        fiber = fiber.return;
      }
      return 'no native handler';
    });
    console.log('Fiber result:', fiberResult);
    await delay(5000);
    console.log('URL after fiber:', page.url());
    
    // Check state after fiber call
    const afterFiber = await page.evaluate(() => {
      return {
        dialogs: [...document.querySelectorAll('[role="dialog"]')].length,
        fileInputs: [...document.querySelectorAll('input[type="file"]')].length,
        url: window.location.href,
        bodyText: document.body.textContent.substring(0, 500)
      };
    });
    console.log('After fiber:', JSON.stringify({ dialogs: afterFiber.dialogs, fileInputs: afterFiber.fileInputs }));
  }

  // Also try navigating to a logos ingredient URL pattern
  console.log('\n=== CHECKING INGREDIENT LINKS ===');
  const links = await page.evaluate(() => {
    return [...document.querySelectorAll('a')]
      .filter(a => (a.href || '').includes('ingredient'))
      .map(a => ({ href: a.href, text: a.textContent.trim().substring(0, 30) }));
  });
  console.log('Ingredient links:', JSON.stringify(links));

  process.exit(0);
})();
