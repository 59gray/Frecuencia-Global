const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate fresh
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) break;
  }
  await delay(3000);
  console.log('Page loaded');

  // Step 1: Discard any open edits
  let discardFound = true;
  while (discardFound) {
    discardFound = false;
    const disc = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (disc) {
      discardFound = true;
      await page.mouse.click(disc.x, disc.y);
      await delay(1500);
    }
  }
  console.log('Discarded all open edits');

  // Step 2: Expand "Subtitle" row via dispatchEvent dblclick
  const expanded = await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Subtitle') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 100) continue;
      
      const opts = { bubbles: true, cancelable: true, clientX: r.x + 40, clientY: r.y + r.height / 2 };
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
      return { y: r.y };
    }
    return null;
  });
  console.log('Expanded:', expanded);
  await delay(3000);

  // Step 3: Find "Choose a font" button
  const fontBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font:')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 40) return { label, cx: r.x + r.width / 2, cy: r.y + r.height / 2, x: r.x, y: r.y, w: r.width, h: r.height };
      }
    }
    return null;
  });
  console.log('Font button:', fontBtn);

  if (!fontBtn) {
    console.log('FAIL: No font button');
    await browser.disconnect();
    return;
  }

  // Step 4: Take screenshot BEFORE clicking font button
  await page.screenshot({ path: 'scripts/diag25_before_click.png' });

  // Step 5: Click font button using Puppeteer mouse (not dispatchEvent)
  console.log(`Clicking font button at (${fontBtn.cx}, ${fontBtn.cy})...`);
  await page.mouse.move(fontBtn.cx, fontBtn.cy);
  await delay(300);
  await page.mouse.click(fontBtn.cx, fontBtn.cy);
  await delay(3000);

  // Step 6: Take screenshot AFTER clicking
  await page.screenshot({ path: 'scripts/diag25_after_click.png' });

  // Step 7: Dump ALL inputs on the page
  const inputs = await page.evaluate(() => {
    const results = [];
    for (const inp of document.querySelectorAll('input, textarea, [role="searchbox"], [role="combobox"]')) {
      const r = inp.getBoundingClientRect();
      results.push({
        tag: inp.tagName, type: inp.type,
        placeholder: inp.placeholder,
        role: inp.getAttribute('role'),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        visible: r.width > 0 && r.height > 0,
      });
    }
    return results;
  });
  console.log('\nAll inputs after clicking font button:');
  for (const inp of inputs) {
    console.log(`  ${inp.tag} type=${inp.type} role=${inp.role} visible=${inp.visible} (${inp.x},${inp.y}) ${inp.w}x${inp.h} placeholder="${inp.placeholder}"`);
  }

  // Step 8: Also check if any dropdown/popover appeared
  const dropdowns = await page.evaluate(() => {
    const results = [];
    const selectors = ['[role="listbox"]', '[role="dialog"]', '[role="menu"]', '[data-radix-popper-content-wrapper]', '[class*="dropdown"]', '[class*="popover"]', '[class*="picker"]', '[class*="modal"]'];
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width > 20 && r.height > 20) {
          results.push({ selector: sel, tag: el.tagName, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
    }
    return results;
  });
  console.log('\nDropdowns/popovers:');
  for (const d of dropdowns) {
    console.log(`  ${d.selector} ${d.tag} (${d.x},${d.y}) ${d.w}x${d.h}`);
  }

  // Step 9: Try clicking font button via JavaScript dispatchEvent too
  console.log('\nTrying JS click on font button...');
  await page.evaluate((cx, cy) => {
    const el = document.elementFromPoint(cx, cy);
    if (el) {
      el.click();
      console.log('JS clicked:', el.tagName, el.getAttribute('aria-label'));
    }
  }, fontBtn.cx, fontBtn.cy);
  await delay(3000);

  await page.screenshot({ path: 'scripts/diag25_after_jsclick.png' });

  // Re-check inputs
  const inputs2 = await page.evaluate(() => {
    const results = [];
    for (const inp of document.querySelectorAll('input, textarea, [role="searchbox"], [role="combobox"]')) {
      const r = inp.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        results.push({
          tag: inp.tagName, type: inp.type,
          placeholder: inp.placeholder,
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
        });
      }
    }
    return results;
  });
  console.log('\nVisible inputs after JS click:');
  for (const inp of inputs2) {
    console.log(`  ${inp.tag} type=${inp.type} (${inp.x},${inp.y}) ${inp.w}x${inp.h} placeholder="${inp.placeholder}"`);
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
