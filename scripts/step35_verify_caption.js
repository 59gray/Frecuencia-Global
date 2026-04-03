const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 180000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // ===== PART 1: Verify all configured fonts =====
  console.log('=== VERIFICATION ===');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(3000);

  // Discard any pending
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

  const categories = ['Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];

  for (const cat of categories) {
    // Expand category
    await page.evaluate((cat) => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== cat) continue;
        if (window.getComputedStyle(el).cursor !== 'pointer') continue;
        const r = el.getBoundingClientRect();
        if (r.width < 20 || r.y < 50) continue;
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        const rr = el.getBoundingClientRect();
        const opts = { bubbles: true, cancelable: true, clientX: rr.x + 40, clientY: rr.y + rr.height / 2, view: window };
        el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
        el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
        el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
        el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
        el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
        el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
        el.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
        break;
      }
    }, cat);
    await delay(2500);

    // Check for font button state
    const fontState = await page.evaluate(() => {
      // Look for "selected" button or "Choose a font"
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label.includes('selected') && label.includes('Choose a font')) {
          return label.split(' selected')[0];
        }
        if (label === 'Choose a font') {
          return '(not set)';
        }
      }
      return '(no button)';
    });
    console.log(`  ${cat}: ${fontState}`);

    // Collapse by clicking back/discard or navigating
    await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) { btn.click(); return; }
      }
    });
    await delay(1500);
  }

  // ===== PART 2: Caption - search for "mono" to find any monospace font =====
  console.log('\n=== CAPTION MONOSPACE SEARCH ===');
  
  // Navigate fresh
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
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

  // Expand Caption
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Caption') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 50) continue;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rr = el.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: rr.x + 40, clientY: rr.y + rr.height / 2, view: window };
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
  await delay(3000);

  // Open font picker
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Choose a font"]');
    if (!btn) return;
    btn.scrollIntoView({ behavior: 'instant', block: 'center' });
    const r = btn.getBoundingClientRect();
    const cx = r.x + r.width / 2; const cy = r.y + r.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
    btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
    btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
    btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
    btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
    btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
    btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
  });
  await delay(2500);

  const si = await page.evaluate(() => {
    for (const inp of document.querySelectorAll('input[type="search"]')) {
      const r = inp.getBoundingClientRect();
      if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });

  if (!si) {
    console.log('Picker not open for Caption');
  } else {
    // Try different search terms
    const searches = ['mono', 'courier', 'code', 'monospace', 'consolas'];
    for (const term of searches) {
      await page.mouse.click(si.x, si.y);
      await delay(200);
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
      await page.keyboard.type(term, { delay: 30 });
      await delay(3000);

      const fonts = await page.evaluate(() => {
        return [...document.querySelectorAll('img[title]')]
          .filter(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100 && r.y < 900; })
          .map(i => i.title);
      });
      console.log(`  Search "${term}": ${fonts.length > 0 ? fonts.join(', ') : '(none matched)'}`);
      
      // Check if any of these look like a monospace font
      const monoMatch = fonts.find(f => {
        const fl = f.toLowerCase();
        return fl.includes('mono') || fl.includes('courier') || fl.includes('code') || fl.includes('consola');
      });
      
      if (monoMatch) {
        console.log(`  Found monospace: ${monoMatch} — Selecting...`);
        const sel = await page.evaluate((fontTitle) => {
          const img = [...document.querySelectorAll(`img[title="${fontTitle}"]`)]
            .find(i => i.getBoundingClientRect().width > 10 && i.getBoundingClientRect().y > 100);
          if (!img) return 'no img';
          let el = img;
          for (let d = 0; d < 12; d++) {
            const fk = Object.keys(el).find(k => k.startsWith('__reactFiber'));
            if (fk) {
              let fiber = el[fk];
              while (fiber) {
                if (fiber.memoizedProps?.onClick?.toString().includes('[native code]')) {
                  try { fiber.memoizedProps.onClick(); return 'selected'; } catch(e) {}
                }
                fiber = fiber.return;
              }
            }
            if (!el.parentElement) break;
            el = el.parentElement;
          }
          return 'no handler';
        }, monoMatch);
        console.log(`  Select result: ${sel}`);
        if (sel === 'selected') {
          await delay(3000);
          await page.evaluate(() => {
            for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
              const r = btn.getBoundingClientRect();
              if (r.width > 10) { btn.click(); return; }
            }
          });
          console.log(`  ✓ Caption saved with: ${monoMatch}`);
          break;
        }
      }
    }
  }

  console.log('\nDONE');
  process.exit(0);
})();
