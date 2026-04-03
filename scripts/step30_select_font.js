const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(2000);

  // Discard
  for (let i = 0; i < 5; i++) {
    const d = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (!d) break;
    await page.mouse.click(d.x, d.y);
    await delay(1500);
  }

  // Expand Subtitle
  await page.evaluate(() => {
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
      break;
    }
  });
  await delay(2500);

  // Open font picker
  const fontBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      if (btn.getAttribute('aria-label') === 'Choose a font') {
        const r = btn.getBoundingClientRect();
        if (r.width > 40) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      }
    }
    return null;
  });
  console.log('Font button:', fontBtn);

  await page.evaluate((cx, cy) => {
    const btn = document.elementFromPoint(cx, cy);
    if (!btn) return;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
    btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
    btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
    btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
    btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
    btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
    btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
  }, fontBtn.cx, fontBtn.cy);
  await delay(2000);

  // Type in search
  const searchInput = await page.evaluate(() => {
    for (const inp of document.querySelectorAll('input[type="search"]')) {
      const r = inp.getBoundingClientRect();
      if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  console.log('Search input:', searchInput);
  
  await page.mouse.click(searchInput.x, searchInput.y);
  await delay(300);
  await page.keyboard.type('Bebas Neue', { delay: 30 });
  await delay(4000);

  // Check what fonts are visible
  const visibleFonts = await page.evaluate(() => {
    return [...document.querySelectorAll('img[title]')]
      .map(img => ({ title: img.title, y: Math.round(img.getBoundingClientRect().y) }))
      .filter(f => f.y > 100 && f.y < 900);
  });
  console.log('Visible fonts:', visibleFonts);

  // Helper to check font button state
  async function checkFontBtn() {
    return await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Choose a font' || label.startsWith('Font:')) {
          return label;
        }
      }
      return null;
    });
  }

  console.log('Before selection:', await checkFontBtn());

  // === TEST A: Keyboard Down + Enter from search ===
  console.log('\n=== TEST A: ArrowDown + Enter ===');
  await page.keyboard.press('ArrowDown');
  await delay(500);
  await page.keyboard.press('Enter');
  await delay(3000);
  let label = await checkFontBtn();
  console.log('After Down+Enter:', label);

  if (!label?.startsWith('Font:')) {
    // Reopen picker
    await page.evaluate((cx, cy) => {
      const btn = document.elementFromPoint(cx, cy);
      if (!btn) return;
      const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
      btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
    }, fontBtn.cx, fontBtn.cy);
    await delay(2000);
    await page.mouse.click(searchInput.x, searchInput.y);
    await delay(300);
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.keyboard.type('Bebas Neue', { delay: 30 });
    await delay(4000);

    // === TEST B: Tab + Enter ===
    console.log('\n=== TEST B: Tab + Enter ===');
    await page.keyboard.press('Tab');
    await delay(500);
    await page.keyboard.press('Enter');
    await delay(3000);
    label = await checkFontBtn();
    console.log('After Tab+Enter:', label);
  }

  if (!label?.startsWith('Font:')) {
    // Navigate back, refresh and try again
    await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    for (let i = 0; i < 20; i++) {
      await delay(1000);
      if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
    }
    await delay(2000);
    for (let i = 0; i < 5; i++) {
      const d = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
          const r = btn.getBoundingClientRect();
          if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
        return null;
      });
      if (!d) break;
      await page.mouse.click(d.x, d.y);
      await delay(1500);
    }

    // Expand Subtitle
    await page.evaluate(() => {
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
        break;
      }
    });
    await delay(2500);

    // Open font picker
    const fontBtn2 = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        if (btn.getAttribute('aria-label') === 'Choose a font') {
          const r = btn.getBoundingClientRect();
          if (r.width > 40) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
        }
      }
      return null;
    });

    await page.evaluate((cx, cy) => {
      const btn = document.elementFromPoint(cx, cy);
      if (!btn) return;
      const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
      btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
    }, fontBtn2.cx, fontBtn2.cy);
    await delay(2000);

    await page.mouse.click(searchInput.x, searchInput.y);
    await delay(300);
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.keyboard.type('Bebas Neue', { delay: 30 });
    await delay(4000);

    // === TEST C: CDP Input events on the first font row ===
    console.log('\n=== TEST C: CDP click on font row ===');
    const firstFont = await page.evaluate(() => {
      for (const img of document.querySelectorAll('img[title="Bebas Neue"]')) {
        const r = img.getBoundingClientRect();
        if (r.width > 10 && r.y > 100) {
          // Get the row container 
          let row = img;
          for (let i = 0; i < 6; i++) {
            if (!row.parentElement) break;
            row = row.parentElement;
            const rr = row.getBoundingClientRect();
            if (rr.width > 300 && rr.height >= 35) break;
          }
          const rr = row.getBoundingClientRect();
          return { cx: rr.x + rr.width / 2, cy: rr.y + rr.height / 2, y: Math.round(rr.y) };
        }
      }
      return null;
    });
    console.log('First font row:', firstFont);

    if (firstFont) {
      const cdp = await page.target().createCDPSession();
      // Try CDP mouse events
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: firstFont.cx, y: firstFont.cy });
      await delay(200);
      await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: firstFont.cx, y: firstFont.cy, button: 'left', clickCount: 1 });
      await delay(100);
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: firstFont.cx, y: firstFont.cy, button: 'left', clickCount: 1 });
      await delay(3000);
      label = await checkFontBtn();
      console.log('After CDP click:', label);

      if (!label?.startsWith('Font:')) {
        // === TEST D: React fiber trigger on font row ===
        console.log('\n=== TEST D: React fiber onClick ===');
        const triggered = await page.evaluate((cx, cy) => {
          const el = document.elementFromPoint(cx, cy);
          if (!el) return 'no element';
          // Walk up to find a clickable container
          let target = el;
          for (let i = 0; i < 8; i++) {
            const key = Object.keys(target).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
            if (key) {
              let fiber = target[key];
              while (fiber) {
                if (fiber.memoizedProps) {
                  if (fiber.memoizedProps.onClick) {
                    try {
                      fiber.memoizedProps.onClick(new MouseEvent('click', { bubbles: true }));
                      return 'onClick triggered on ' + (target.tagName || 'unknown');
                    } catch (e) {
                      return 'onClick error: ' + e.message;
                    }
                  }
                  if (fiber.memoizedProps.onSelect) {
                    try {
                      fiber.memoizedProps.onSelect();
                      return 'onSelect triggered';
                    } catch (e) {}
                  }
                }
                fiber = fiber.return;
              }
            }
            if (!target.parentElement) break;
            target = target.parentElement;
          }
          return 'no handler found';
        }, firstFont.cx, firstFont.cy);
        console.log('React trigger result:', triggered);
        await delay(3000);
        label = await checkFontBtn();
        console.log('After React trigger:', label);
      }

      if (!label?.startsWith('Font:')) {
        // === TEST E: Keyboard Down arrows to reach font then Enter ===
        console.log('\n=== TEST E: Multiple Down arrows + Enter ===');
        // Focus search input first
        await page.evaluate(() => {
          const inp = document.querySelector('input[type="search"]');
          if (inp) inp.focus();
        });
        await delay(300);
        // Press Down multiple times to cycle through results
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('ArrowDown');
          await delay(300);
          // Check active/focused element
          const focused = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el) return 'none';
            const r = el.getBoundingClientRect();
            return `${el.tagName} (${Math.round(r.x)},${Math.round(r.y)}) ${el.getAttribute('aria-label') || el.textContent?.substring(0, 30) || ''}`;
          });
          console.log(`  Down ${i + 1}: focused = ${focused}`);
        }
        await page.keyboard.press('Enter');
        await delay(3000);
        label = await checkFontBtn();
        console.log('After Down×5+Enter:', label);
      }
    }
  }

  console.log('\n=== FINAL STATE ===');
  console.log('Font button:', await checkFontBtn());

  await browser.disconnect();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
