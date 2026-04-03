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

  // Discard any pending changes
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

  // Expand Subtitle row
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

  // Find font button
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
  if (!fontBtn) { console.log('No font button found'); process.exit(1); }

  // Open font picker via dispatchEvent
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

  // Find search input and type
  const searchInput = await page.evaluate(() => {
    for (const inp of document.querySelectorAll('input[type="search"]')) {
      const r = inp.getBoundingClientRect();
      if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  console.log('Search input:', searchInput);
  if (!searchInput) { console.log('No search input - picker did not open'); process.exit(1); }

  await page.mouse.click(searchInput.x, searchInput.y);
  await delay(300);
  await page.keyboard.type('Bebas Neue', { delay: 30 });
  await delay(4000);

  // Find Bebas Neue IMG and analyze its ancestors
  console.log('\n=== ANALYZING FONT ROW REACT FIBER TREE ===');
  const fiberAnalysis = await page.evaluate(() => {
    const img = [...document.querySelectorAll('img[title="Bebas Neue"]')]
      .find(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100; });
    if (!img) return 'Bebas Neue IMG not found';

    const result = [];
    let el = img;
    for (let depth = 0; depth < 12; depth++) {
      const r = el.getBoundingClientRect();
      const info = {
        depth,
        tag: el.tagName,
        class: el.className?.toString().substring(0, 40) || '',
        size: `${Math.round(r.width)}x${Math.round(r.height)}`,
        pos: `(${Math.round(r.x)},${Math.round(r.y)})`,
        cursor: window.getComputedStyle(el).cursor,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        handlers: []
      };

      // Check for React fiber
      const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
      if (fiberKey) {
        let fiber = el[fiberKey];
        let fiberDepth = 0;
        while (fiber && fiberDepth < 15) {
          const props = fiber.memoizedProps;
          if (props) {
            const eventHandlers = Object.keys(props).filter(k => 
              typeof props[k] === 'function' && (k.startsWith('on') || k === 'onClick' || k === 'onSelect' || k === 'onMouseDown')
            );
            if (eventHandlers.length > 0) {
              info.handlers.push({
                fiberDepth,
                fiberType: typeof fiber.type === 'string' ? fiber.type : fiber.type?.name || fiber.type?.displayName || 'Component',
                events: eventHandlers,
                hasOnClick: !!props.onClick,
                onClickStr: props.onClick ? props.onClick.toString().substring(0, 200) : null
              });
            }
          }
          fiber = fiber.return;
          fiberDepth++;
        }
      }

      result.push(info);
      if (!el.parentElement) break;
      el = el.parentElement;
    }
    return result;
  });
  console.log(JSON.stringify(fiberAnalysis, null, 2));

  // Now try the React fiber trigger with DETAILED tracking
  console.log('\n=== TRIGGERING React onClick - DETAILED ===');
  
  // First snapshot: all buttons with "font" in aria-label
  const beforeBtns = await page.evaluate(() => {
    return [...document.querySelectorAll('button')]
      .map(b => ({ label: b.getAttribute('aria-label'), text: b.textContent.substring(0, 30) }))
      .filter(b => b.label && (b.label.toLowerCase().includes('font') || b.label.toLowerCase().includes('choose')));
  });
  console.log('Buttons BEFORE:', JSON.stringify(beforeBtns));

  // Try triggering the SPECIFIC handler on the innermost clickable element
  const triggerResult = await page.evaluate(() => {
    const img = [...document.querySelectorAll('img[title="Bebas Neue"]')]
      .find(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100; });
    if (!img) return 'no img';

    // Walk up from img to find ALL onClick handlers
    const handlers = [];
    let el = img;
    for (let depth = 0; depth < 12; depth++) {
      const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
      if (fiberKey) {
        let fiber = el[fiberKey];
        while (fiber) {
          if (fiber.memoizedProps?.onClick && !handlers.find(h => h.fn === fiber.memoizedProps.onClick)) {
            handlers.push({
              depth,
              tag: el.tagName,
              fiberType: typeof fiber.type === 'string' ? fiber.type : fiber.type?.name || 'Comp',
              fn: fiber.memoizedProps.onClick,
              fnStr: fiber.memoizedProps.onClick.toString().substring(0, 100)
            });
          }
          fiber = fiber.return;
        }
      }
      if (!el.parentElement) break;
      el = el.parentElement;
    }

    const results = [];
    // Try triggering each unique onClick handler with a proper synthetic event
    for (const h of handlers) {
      try {
        // Create a more complete React synthetic event
        const event = {
          type: 'click',
          target: img,
          currentTarget: img,
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          preventDefault: () => {},
          stopPropagation: () => {},
          nativeEvent: new MouseEvent('click', { bubbles: true }),
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {}
        };
        h.fn(event);
        results.push(`OK: depth=${h.depth} tag=${h.tag} fiber=${h.fiberType}`);
      } catch (e) {
        results.push(`ERR: depth=${h.depth} tag=${h.tag} → ${e.message}`);
      }
    }
    return { handlers: handlers.length, results };
  });
  console.log('Trigger results:', JSON.stringify(triggerResult));
  await delay(3000);

  // After snapshot
  const afterBtns = await page.evaluate(() => {
    return [...document.querySelectorAll('button')]
      .map(b => ({ label: b.getAttribute('aria-label'), text: b.textContent.substring(0, 30) }))
      .filter(b => b.label && (b.label.toLowerCase().includes('font') || b.label.toLowerCase().includes('choose')));
  });
  console.log('Buttons AFTER:', JSON.stringify(afterBtns));

  // Check if picker is still visible
  const pickerState = await page.evaluate(() => {
    const searchInput = document.querySelector('input[type="search"]');
    const imgs = [...document.querySelectorAll('img[title]')].filter(i => i.getBoundingClientRect().y > 100 && i.getBoundingClientRect().y < 900);
    return {
      searchVisible: !!searchInput && searchInput.getBoundingClientRect().width > 0,
      fontImgsCount: imgs.length,
      subtitleSpan: (() => {
        for (const s of document.querySelectorAll('span')) {
          const own = [...s.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
          if (own === 'Subtitle') { const r = s.getBoundingClientRect(); return { y: Math.round(r.y), text: s.parentElement?.textContent?.substring(0, 80) }; }
        }
        return null;
      })()
    };
  });
  console.log('Picker state after:', JSON.stringify(pickerState));

  // Check ALL aria-labels on page for any font change
  const allAriaLabels = await page.evaluate(() => {
    return [...document.querySelectorAll('[aria-label]')]
      .map(el => el.getAttribute('aria-label'))
      .filter(l => l.toLowerCase().includes('font') || l.toLowerCase().includes('bebas') || l.toLowerCase().includes('choose'));
  });
  console.log('All font/choose aria-labels:', JSON.stringify(allAriaLabels));

  // Try one more approach: dispatchEvent with full pointer+mouse sequence on the FONT NAME AREA (not the row, not the img)
  console.log('\n=== BONUS: DispatchEvent on font-name-area DIV ===');
  const bonusResult = await page.evaluate(() => {
    // Re-search since picker might have changed
    const searchInput = document.querySelector('input[type="search"]');
    if (!searchInput) return 'picker closed';
    
    const img = [...document.querySelectorAll('img[title="Bebas Neue"]')]
      .find(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100; });
    if (!img) return 'no img';

    // The font name area is the parent DIV of the IMG (not the checkbox area)
    // Walk up until we find a div with width > 250 (the font name area)
    let fontNameDiv = img.parentElement;
    for (let i = 0; i < 5; i++) {
      if (!fontNameDiv) break;
      const r = fontNameDiv.getBoundingClientRect();
      if (r.width > 250 && r.height > 30) break;
      fontNameDiv = fontNameDiv.parentElement;
    }
    if (!fontNameDiv) return 'no font name div';

    const r = fontNameDiv.getBoundingClientRect();
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };

    // Full pointer + mouse sequence
    fontNameDiv.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
    fontNameDiv.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
    fontNameDiv.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
    fontNameDiv.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
    fontNameDiv.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
    fontNameDiv.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));

    return `dispatched on ${fontNameDiv.tagName} class=${fontNameDiv.className?.toString().substring(0,30)} at (${Math.round(cx)},${Math.round(cy)})`;
  });
  console.log('Bonus result:', bonusResult);
  await delay(3000);

  const finalLabel = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font:')) return label;
    }
    // Also check for any button containing "Bebas"
    for (const btn of document.querySelectorAll('button')) {
      if (btn.textContent.includes('Bebas')) return 'FOUND:' + btn.textContent.substring(0, 50);
    }
    return null;
  });
  console.log('Final label:', finalLabel);

  console.log('\nDONE');
  process.exit(0);
})();
