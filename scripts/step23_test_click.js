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
    if (ready) { console.log(`Content ready after ${i + 1}s`); await delay(2000); break; }
  }

  // Take "before" snapshot of body text
  const beforeText = await page.evaluate(() => document.body.textContent.length);
  const beforeButtons = await page.evaluate(() => document.querySelectorAll('button').length);
  
  // Find the Subtitle row's clickable SPAN at (113, 371)
  // Click more to the LEFT of the text where the label is
  const clickTarget = await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Subtitle') continue;
      const cs = window.getComputedStyle(el);
      if (cs.cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      // Click at the left portion of the text
      return { x: r.x + 40, y: r.y + r.height / 2 };
    }
    return null;
  });

  if (!clickTarget) { console.log('NOT FOUND'); return; }

  console.log(`Clicking at (${clickTarget.x|0}, ${clickTarget.y|0})`);
  
  // Try mouse.move first, then mousedown, mouseup sequence
  await page.mouse.move(clickTarget.x, clickTarget.y);
  await delay(300);
  await page.mouse.down();
  await delay(100);
  await page.mouse.up();
  await delay(4000);

  // Take screenshot
  await page.screenshot({ path: 'scripts/diag23_after_click.png' });

  // Check what changed
  const afterText = await page.evaluate(() => document.body.textContent.length);
  const afterButtons = await page.evaluate(() => document.querySelectorAll('button').length);
  
  console.log(`Text length: ${beforeText} → ${afterText} (diff: ${afterText - beforeText})`);
  console.log(`Buttons: ${beforeButtons} → ${afterButtons} (diff: ${afterButtons - beforeButtons})`);

  // Check URL
  console.log(`URL: ${page.url()}`);

  // Check for any new elements that appeared
  const newEls = await page.evaluate(() => {
    const results = [];
    // Look for font-related elements: inputs, selects, listboxes, dropdowns
    for (const inp of document.querySelectorAll('input')) {
      const r = inp.getBoundingClientRect();
      if (r.width > 20) results.push({ type: 'input', kind: inp.type, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
    }
    // Check for new buttons with font-related labels
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label.includes('font') || label.includes('Font') || label.includes('Choose') || label.includes('Save') || label.includes('Discard')) {
        const r = btn.getBoundingClientRect();
        results.push({ type: 'button', label, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
      }
    }
    // Check for dialogs/modals
    for (const el of document.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"], [aria-modal="true"]')) {
      const r = el.getBoundingClientRect();
      results.push({ type: el.getAttribute('role'), tag: el.tagName, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
    }
    return results;
  });

  console.log('\nNew/special elements:');
  for (const el of newEls) {
    console.log(`  ${JSON.stringify(el)}`);
  }

  // Check if popup/panel opened by looking at new visible overlays
  const overlays = await page.evaluate(() => {
    const results = [];
    for (const el of document.querySelectorAll('div')) {
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      // Look for elevated/overlay elements (high z-index, fixed/absolute position)
      if ((cs.position === 'fixed' || cs.position === 'absolute') && 
          parseInt(cs.zIndex) > 10 && r.width > 100 && r.height > 100) {
        results.push({
          pos: cs.position, zIndex: cs.zIndex,
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
          text: (el.textContent || '').substring(0, 100),
        });
      }
    }
    return results;
  });

  console.log('\nOverlay/fixed elements:');
  for (const o of overlays) {
    console.log(`  z=${o.zIndex} pos=${o.pos} (${o.x},${o.y}) ${o.w}x${o.h} text="${o.text}"`);
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
