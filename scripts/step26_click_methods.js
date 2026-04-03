const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

// Force exit after 90 seconds
setTimeout(() => { console.log('TIMEOUT: Force exit'); process.exit(1); }, 90000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate fresh
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) break;
  }
  await delay(2000);
  console.log('Page loaded');

  // Discard any open edits
  for (let attempt = 0; attempt < 5; attempt++) {
    const disc = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (!disc) break;
    await page.mouse.click(disc.x, disc.y);
    await delay(1500);
  }
  console.log('Discards done');

  // Expand "Subtitle" via dispatchEvent dblclick
  const expanded = await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Subtitle') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 100) continue;
      const opts = { bubbles: true, cancelable: true, clientX: r.x + 40, clientY: r.y + r.height / 2, view: window };
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

  // Find font button
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
    console.log('FAIL: No font button found');
    await browser.disconnect();
    process.exit(1);
  }

  // Helper: check for search input or popup
  async function checkForPicker() {
    return await page.evaluate(() => {
      const result = { inputs: [], dropdowns: [], newButtons: [] };
      for (const inp of document.querySelectorAll('input, textarea, [role="searchbox"], [role="combobox"], [contenteditable="true"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          result.inputs.push({
            tag: inp.tagName, type: inp.type || '', role: inp.getAttribute('role') || '',
            placeholder: inp.placeholder || inp.getAttribute('aria-label') || '',
            x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)
          });
        }
      }
      for (const sel of ['[role="listbox"]', '[role="dialog"]', '[role="menu"]', '[role="presentation"]', '[data-radix-popper-content-wrapper]']) {
        for (const el of document.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          if (r.width > 20 && r.height > 20) {
            result.dropdowns.push({ sel, tag: el.tagName, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
          }
        }
      }
      return result;
    });
  }

  console.log('\n--- Baseline (before any click) ---');
  const baseline = await checkForPicker();
  console.log('Inputs:', JSON.stringify(baseline.inputs));
  console.log('Dropdowns:', JSON.stringify(baseline.dropdowns));

  // === METHOD 1: Puppeteer page.mouse.click ===
  console.log('\n=== METHOD 1: page.mouse.click ===');
  await page.mouse.click(fontBtn.cx, fontBtn.cy);
  await delay(3000);
  const m1 = await checkForPicker();
  console.log('Inputs:', JSON.stringify(m1.inputs));
  console.log('Dropdowns:', JSON.stringify(m1.dropdowns));
  const m1_worked = m1.inputs.length > baseline.inputs.length || m1.dropdowns.length > baseline.dropdowns.length;
  console.log('Result:', m1_worked ? 'NEW ELEMENTS FOUND!' : 'No change');

  if (!m1_worked) {
    // === METHOD 2: CDP Input.dispatchMouseEvent ===
    console.log('\n=== METHOD 2: CDP Input.dispatchMouseEvent ===');
    const cdp = await page.target().createCDPSession();
    const cx = fontBtn.cx, cy = fontBtn.cy;
    await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: cx, y: cy, button: 'left', clickCount: 1 });
    await delay(100);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cx, y: cy, button: 'left', clickCount: 1 });
    await delay(3000);
    const m2 = await checkForPicker();
    console.log('Inputs:', JSON.stringify(m2.inputs));
    console.log('Dropdowns:', JSON.stringify(m2.dropdowns));
    const m2_worked = m2.inputs.length > baseline.inputs.length || m2.dropdowns.length > baseline.dropdowns.length;
    console.log('Result:', m2_worked ? 'NEW ELEMENTS FOUND!' : 'No change');

    if (!m2_worked) {
      // === METHOD 3: JS dispatchEvent (pointer + mouse + click) ===
      console.log('\n=== METHOD 3: JS dispatchEvent on button element ===');
      await page.evaluate((cx, cy) => {
        const btn = document.elementFromPoint(cx, cy);
        if (!btn) return;
        const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
        // Full event sequence
        btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      }, fontBtn.cx, fontBtn.cy);
      await delay(3000);
      const m3 = await checkForPicker();
      console.log('Inputs:', JSON.stringify(m3.inputs));
      console.log('Dropdowns:', JSON.stringify(m3.dropdowns));
      const m3_worked = m3.inputs.length > baseline.inputs.length || m3.dropdowns.length > baseline.dropdowns.length;
      console.log('Result:', m3_worked ? 'NEW ELEMENTS FOUND!' : 'No change');

      if (!m3_worked) {
        // === METHOD 4: Focus + keyboard Enter ===
        console.log('\n=== METHOD 4: Focus + keyboard Enter ===');
        await page.evaluate((cx, cy) => {
          const btn = document.elementFromPoint(cx, cy);
          if (btn) btn.focus();
        }, fontBtn.cx, fontBtn.cy);
        await delay(500);
        await page.keyboard.press('Enter');
        await delay(3000);
        const m4 = await checkForPicker();
        console.log('Inputs:', JSON.stringify(m4.inputs));
        console.log('Dropdowns:', JSON.stringify(m4.dropdowns));
        const m4_worked = m4.inputs.length > baseline.inputs.length || m4.dropdowns.length > baseline.dropdowns.length;
        console.log('Result:', m4_worked ? 'NEW ELEMENTS FOUND!' : 'No change');

        if (!m4_worked) {
          // === METHOD 5: Puppeteer page.click with selector ===
          console.log('\n=== METHOD 5: page.click selector ===');
          try {
            await page.click('button[aria-label="Choose a font"]', { delay: 100 });
            await delay(3000);
            const m5 = await checkForPicker();
            console.log('Inputs:', JSON.stringify(m5.inputs));
            console.log('Dropdowns:', JSON.stringify(m5.dropdowns));
            const m5_worked = m5.inputs.length > baseline.inputs.length || m5.dropdowns.length > baseline.dropdowns.length;
            console.log('Result:', m5_worked ? 'NEW ELEMENTS FOUND!' : 'No change');
          } catch (e) {
            console.log('Error:', e.message);
          }

          // === METHOD 6: Click child elements of font button ===
          console.log('\n=== METHOD 6: Click inner elements ===');
          const inner = await page.evaluate(() => {
            const btn = document.querySelector('button[aria-label="Choose a font"]');
            if (!btn) return null;
            const children = [];
            function walk(el, depth) {
              const r = el.getBoundingClientRect();
              children.push({
                tag: el.tagName, text: el.textContent?.substring(0, 30), depth,
                x: Math.round(r.x + r.width/2), y: Math.round(r.y + r.height/2),
                w: Math.round(r.width), h: Math.round(r.height),
                tagLower: el.tagName.toLowerCase(),
              });
              for (const c of el.children) walk(c, depth + 1);
            }
            walk(btn, 0);
            return children;
          });
          console.log('Button DOM tree:', JSON.stringify(inner, null, 2));

          if (inner && inner.length > 1) {
            // Click deepest non-text child
            const deepest = inner.filter(c => c.w > 5).sort((a, b) => b.depth - a.depth)[0];
            console.log('Clicking deepest child:', deepest);
            await page.mouse.click(deepest.x, deepest.y);
            await delay(3000);
            const m6 = await checkForPicker();
            console.log('Inputs:', JSON.stringify(m6.inputs));
            console.log('Dropdowns:', JSON.stringify(m6.dropdowns));
            const m6_worked = m6.inputs.length > baseline.inputs.length || m6.dropdowns.length > baseline.dropdowns.length;
            console.log('Result:', m6_worked ? 'NEW ELEMENTS FOUND!' : 'No change');
          }

          // === METHOD 7: React event trigger ===
          console.log('\n=== METHOD 7: React synthetic event ===');
          await page.evaluate(() => {
            const btn = document.querySelector('button[aria-label="Choose a font"]');
            if (!btn) return;
            // Try to find React fiber and trigger onClick
            const key = Object.keys(btn).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
            if (key) {
              console.log('Found React key:', key);
              let fiber = btn[key];
              while (fiber) {
                if (fiber.memoizedProps && fiber.memoizedProps.onClick) {
                  fiber.memoizedProps.onClick({ preventDefault: () => {}, stopPropagation: () => {} });
                  return 'triggered onClick';
                }
                fiber = fiber.return;
              }
            }
            // Also try direct native click simulation  
            const nativeClick = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            Object.defineProperty(nativeClick, 'isTrusted', { get: () => true });
            btn.dispatchEvent(nativeClick);
          });
          await delay(3000);
          const m7 = await checkForPicker();
          console.log('Inputs:', JSON.stringify(m7.inputs));
          console.log('Dropdowns:', JSON.stringify(m7.dropdowns));
          const m7_worked = m7.inputs.length > baseline.inputs.length || m7.dropdowns.length > baseline.dropdowns.length;
          console.log('Result:', m7_worked ? 'NEW ELEMENTS FOUND!' : 'No change');
        }
      }
    }
  }

  console.log('\n=== DONE ===');
  await browser.disconnect();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
