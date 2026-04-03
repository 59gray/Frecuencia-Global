const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

// Font assignments per brand kit category
const FONT_MAP = [
  { category: 'Subtitle', font: 'Space Grotesk', search: 'Space Grotesk' },
  { category: 'Heading', font: 'Bebas Neue', search: 'Bebas Neue' },
  { category: 'Subheading', font: 'Space Grotesk', search: 'Space Grotesk' },
  { category: 'Section header', font: 'Space Grotesk', search: 'Space Grotesk' },
  { category: 'Quote', font: 'Space Grotesk', search: 'Space Grotesk' },
  { category: 'Caption', font: 'Source Code Pro', search: 'Source Code Pro' },
  // Title and Body handled separately (special expansion behavior)
  { category: 'Title', font: 'Bebas Neue', search: 'Bebas Neue' },
  { category: 'Body', font: 'Space Grotesk', search: 'Space Grotesk' },
];

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  let configured = 0;
  let failed = [];

  for (const entry of FONT_MAP) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`CONFIGURING: ${entry.category} → ${entry.font}`);
    console.log('='.repeat(50));

    // Navigate fresh
    await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    for (let i = 0; i < 25; i++) {
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

    // Step 1: Expand the category row via dblclick dispatchEvent
    console.log(`  Expanding ${entry.category}...`);
    const expanded = await page.evaluate((cat) => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== cat) continue;
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
        return true;
      }
      return false;
    }, entry.category);

    if (!expanded) {
      console.log(`  ✗ Could not find/expand ${entry.category}`);
      failed.push({ category: entry.category, reason: 'span not found' });
      continue;
    }
    await delay(3000);

    // Step 2: Find "Choose a font" button
    const fontBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        if (btn.getAttribute('aria-label') === 'Choose a font') {
          const r = btn.getBoundingClientRect();
          if (r.width > 40) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
        }
      }
      return null;
    });

    if (!fontBtn) {
      console.log(`  ✗ No "Choose a font" button for ${entry.category}`);
      failed.push({ category: entry.category, reason: 'no font button' });
      continue;
    }
    console.log(`  Font button at (${fontBtn.cx.toFixed(0)}, ${fontBtn.cy.toFixed(0)})`);

    // Step 3: Open font picker via dispatchEvent PointerEvent+MouseEvent
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
    await delay(2500);

    // Step 4: Find search input
    const searchInput = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });

    if (!searchInput) {
      console.log(`  ✗ Font picker did not open for ${entry.category}`);
      failed.push({ category: entry.category, reason: 'picker did not open' });
      continue;
    }
    console.log(`  Picker open, searching for "${entry.search}"...`);

    // Step 5: Type font name in search
    await page.mouse.click(searchInput.x, searchInput.y);
    await delay(300);
    await page.keyboard.type(entry.search, { delay: 25 });
    await delay(4000);

    // Step 6: Find the font result and select it via React fiber onClick
    const selectResult = await page.evaluate((searchFont) => {
      // Find the best matching font IMG
      const imgs = [...document.querySelectorAll('img[title]')]
        .filter(img => {
          const r = img.getBoundingClientRect();
          return r.width > 10 && r.y > 100 && r.y < 900;
        });

      // Score each font by how well it matches the search
      let bestImg = null;
      let bestScore = 0;
      for (const img of imgs) {
        const title = img.title.toLowerCase();
        const target = searchFont.toLowerCase();
        if (title === target) {
          bestImg = img;
          bestScore = 100;
          break;
        }
        if (title.startsWith(target)) {
          const score = 90;
          if (score > bestScore) { bestImg = img; bestScore = score; }
        }
        if (title.includes(target)) {
          const score = 80;
          if (score > bestScore) { bestImg = img; bestScore = score; }
        }
      }

      if (!bestImg) {
        return { ok: false, reason: 'font not found', available: imgs.map(i => i.title).slice(0, 10) };
      }

      // Walk up React fiber tree from the IMG to find the bound onClick handler
      let el = bestImg;
      for (let depth = 0; depth < 12; depth++) {
        const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
        if (fiberKey) {
          let fiber = el[fiberKey];
          while (fiber) {
            if (fiber.memoizedProps?.onClick) {
              const fnStr = fiber.memoizedProps.onClick.toString();
              // Prefer bound functions (native code) as they have arguments pre-bound
              if (fnStr.includes('[native code]')) {
                try {
                  fiber.memoizedProps.onClick();
                  return { ok: true, font: bestImg.title, score: bestScore, method: 'bound-onClick' };
                } catch (e) {
                  // Continue to next handler
                }
              }
            }
            fiber = fiber.return;
          }
        }
        if (!el.parentElement) break;
        el = el.parentElement;
      }

      // Fallback: try any onClick handler
      el = bestImg;
      for (let depth = 0; depth < 12; depth++) {
        const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
        if (fiberKey) {
          let fiber = el[fiberKey];
          while (fiber) {
            if (fiber.memoizedProps?.onClick) {
              try {
                fiber.memoizedProps.onClick({
                  type: 'click', target: bestImg, currentTarget: bestImg,
                  bubbles: true, cancelable: true, defaultPrevented: false,
                  preventDefault: () => {}, stopPropagation: () => {},
                  nativeEvent: { type: 'click' },
                  isDefaultPrevented: () => false, isPropagationStopped: () => false,
                  persist: () => {}
                });
                return { ok: true, font: bestImg.title, score: bestScore, method: 'onClick-with-event' };
              } catch (e) {
                // Continue
              }
            }
            fiber = fiber.return;
          }
        }
        if (!el.parentElement) break;
        el = el.parentElement;
      }

      return { ok: false, reason: 'no working onClick handler found' };
    }, entry.search);

    console.log(`  Select result:`, JSON.stringify(selectResult));

    if (!selectResult.ok) {
      failed.push({ category: entry.category, reason: selectResult.reason, available: selectResult.available });
      continue;
    }

    await delay(3000);

    // Step 7: Verify selection
    const verifyLabel = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label.includes('selected') && label.includes('Choose a font')) {
          return label;
        }
      }
      return null;
    });

    if (verifyLabel) {
      console.log(`  ✓ SELECTED: ${verifyLabel}`);

      // Step 8: Check for Save button and click it
      const saved = await page.evaluate(() => {
        // Look for save/apply/done buttons
        for (const btn of document.querySelectorAll('button')) {
          const label = (btn.getAttribute('aria-label') || '').toLowerCase();
          const text = (btn.textContent || '').toLowerCase().trim();
          if (text === 'save' || text === 'done' || text === 'apply' || label === 'save' || label === 'done') {
            const r = btn.getBoundingClientRect();
            if (r.width > 20) {
              btn.click();
              return text || label;
            }
          }
        }
        return null;
      });
      if (saved) console.log(`  Clicked save: ${saved}`);
      await delay(2000);

      configured++;
    } else {
      // Check if font shows in button text
      const btnText = await page.evaluate((fontName) => {
        for (const btn of document.querySelectorAll('button')) {
          if (btn.textContent.includes(fontName)) return btn.textContent.substring(0, 50);
        }
        return null;
      }, selectResult.font);

      if (btnText) {
        console.log(`  ✓ Font visible in button: ${btnText}`);
        configured++;
      } else {
        console.log(`  ✗ Selection might not have stuck`);
        failed.push({ category: entry.category, reason: 'selection not confirmed' });
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS: ${configured}/${FONT_MAP.length} fonts configured`);
  if (failed.length > 0) {
    console.log('FAILED:');
    for (const f of failed) console.log(`  - ${f.category}: ${f.reason}`, f.available ? `(available: ${f.available.join(', ')})` : '');
  }
  console.log('='.repeat(50));

  process.exit(0);
})();
