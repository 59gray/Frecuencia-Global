const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

const FONT_MAP = [
  { category: 'Section header', font: 'Space Grotesk', search: 'Space Grotesk' },
  { category: 'Quote', font: 'Space Grotesk', search: 'Space Grotesk' },
  { category: 'Caption', font: 'Source Code Pro', search: 'Source Code Pro' },
  { category: 'Title', font: 'Bebas Neue', search: 'Bebas Neue' },
  { category: 'Body', font: 'Space Grotesk', search: 'Space Grotesk' },
];

async function expandCategory(page, cat) {
  return page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== cat) continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 50) continue;
      // Scroll into view first
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      return { y: Math.round(r.y) };
    }
    return null;
  }, cat);
}

async function dblClickExpand(page, cat) {
  return page.evaluate((cat) => {
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
      return { y: Math.round(rr.y) };
    }
    return null;
  }, cat);
}

async function findFontButton(page) {
  return page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font') {
        const r = btn.getBoundingClientRect();
        if (r.width > 40 && r.height > 10) {
          btn.scrollIntoView({ behavior: 'instant', block: 'center' });
          const rr = btn.getBoundingClientRect();
          return { cx: rr.x + rr.width / 2, cy: rr.y + rr.height / 2 };
        }
      }
    }
    return null;
  });
}

async function openPicker(page, fontBtn) {
  for (let attempt = 0; attempt < 3; attempt++) {
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

    const searchInput = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });

    if (searchInput) return searchInput;
    console.log(`    Retry opening picker (attempt ${attempt + 1})...`);

    // Try dispatching directly on the button element instead of elementFromPoint
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Choose a font"]');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
      btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
    });
    await delay(2500);

    const s2 = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (s2) return s2;
  }
  return null;
}

async function selectFont(page, searchInput, searchTerm) {
  await page.mouse.click(searchInput.x, searchInput.y);
  await delay(300);
  await page.keyboard.type(searchTerm, { delay: 25 });
  await delay(4000);

  return page.evaluate((searchFont) => {
    const imgs = [...document.querySelectorAll('img[title]')]
      .filter(img => {
        const r = img.getBoundingClientRect();
        return r.width > 10 && r.y > 100 && r.y < 900;
      });

    let bestImg = null;
    let bestScore = 0;
    for (const img of imgs) {
      const title = img.title.toLowerCase();
      const target = searchFont.toLowerCase();
      if (title === target) { bestImg = img; bestScore = 100; break; }
      if (title.startsWith(target)) { if (90 > bestScore) { bestImg = img; bestScore = 90; } }
      if (title.includes(target)) { if (80 > bestScore) { bestImg = img; bestScore = 80; } }
    }

    if (!bestImg) {
      return { ok: false, reason: 'font not found', available: imgs.map(i => i.title).slice(0, 10) };
    }

    // Walk React fiber tree to find bound onClick handler
    let el = bestImg;
    for (let depth = 0; depth < 12; depth++) {
      const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
      if (fiberKey) {
        let fiber = el[fiberKey];
        while (fiber) {
          if (fiber.memoizedProps?.onClick) {
            const fnStr = fiber.memoizedProps.onClick.toString();
            if (fnStr.includes('[native code]')) {
              try {
                fiber.memoizedProps.onClick();
                return { ok: true, font: bestImg.title, score: bestScore };
              } catch (e) {}
            }
          }
          fiber = fiber.return;
        }
      }
      if (!el.parentElement) break;
      el = el.parentElement;
    }

    return { ok: false, reason: 'no working onClick' };
  }, searchTerm);
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  let configured = 0;
  let failed = [];

  for (const entry of FONT_MAP) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`CONFIGURING: ${entry.category} → ${entry.font}`);

    // Navigate fresh
    await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    for (let i = 0; i < 25; i++) {
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

    // First scroll to the category so it's visible
    const scrollResult = await expandCategory(page, entry.category);
    if (!scrollResult) {
      console.log(`  ✗ Category span not found: ${entry.category}`);
      
      // Debug: dump all span texts
      const spans = await page.evaluate(() => {
        return [...document.querySelectorAll('span')].filter(s => {
          const r = s.getBoundingClientRect();
          return r.width > 20 && r.y > 50 && window.getComputedStyle(s).cursor === 'pointer';
        }).map(s => ({
          text: [...s.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(''),
          y: Math.round(s.getBoundingClientRect().y)
        })).filter(s => s.text.length > 0);
      });
      console.log('  Available categories:', JSON.stringify(spans));
      failed.push({ category: entry.category, reason: 'span not found' });
      continue;
    }
    await delay(500);

    // Now dblclick to expand
    const expanded = await dblClickExpand(page, entry.category);
    if (!expanded) {
      console.log(`  ✗ Could not expand ${entry.category}`);
      failed.push({ category: entry.category, reason: 'expand failed' });
      continue;
    }
    console.log(`  Expanded at y=${expanded.y}`);
    await delay(3000);

    // Find font button
    const fontBtn = await findFontButton(page);
    if (!fontBtn) {
      console.log(`  ✗ No "Choose a font" button`);
      
      // Debug: check what buttons exist near the expanded area
      const nearButtons = await page.evaluate((expandY) => {
        return [...document.querySelectorAll('button')]
          .map(b => {
            const r = b.getBoundingClientRect();
            return { label: b.getAttribute('aria-label'), text: b.textContent.substring(0, 40), y: Math.round(r.y) };
          })
          .filter(b => Math.abs(b.y - expandY) < 200 && (b.label || b.text));
      }, expanded.y);
      console.log('  Buttons near expanded area:', JSON.stringify(nearButtons));
      failed.push({ category: entry.category, reason: 'no font button' });
      continue;
    }

    // Open picker with retry
    const searchInput = await openPicker(page, fontBtn);
    if (!searchInput) {
      console.log(`  ✗ Picker did not open after retries`);
      failed.push({ category: entry.category, reason: 'picker did not open' });
      continue;
    }

    // Select font
    const result = await selectFont(page, searchInput, entry.search);
    console.log(`  Select:`, JSON.stringify(result));

    if (!result.ok) {
      failed.push({ category: entry.category, reason: result.reason, available: result.available });
      continue;
    }

    await delay(3000);

    // Verify
    const verified = await page.evaluate((fontName) => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label.includes('selected') && label.includes('Choose a font')) return label;
      }
      for (const btn of document.querySelectorAll('button')) {
        if (btn.textContent.includes(fontName)) return 'text:' + btn.textContent.substring(0, 40);
      }
      return null;
    }, result.font);

    if (verified) {
      console.log(`  ✓ VERIFIED: ${verified}`);

      // Save
      const saved = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button')) {
          const text = (btn.textContent || '').toLowerCase().trim();
          if (text === 'save' || text === 'done' || text === 'apply') {
            const r = btn.getBoundingClientRect();
            if (r.width > 20) { btn.click(); return text; }
          }
        }
        return null;
      });
      if (saved) console.log(`  Saved: ${saved}`);
      await delay(2000);
      configured++;
    } else {
      console.log(`  ✗ Not verified`);
      failed.push({ category: entry.category, reason: 'not verified' });
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS: ${configured}/5 remaining fonts configured`);
  if (failed.length > 0) {
    console.log('FAILED:');
    for (const f of failed) console.log(`  - ${f.category}: ${f.reason}`, f.available ? `(available: ${f.available.join(', ')})` : '');
  }
  process.exit(0);
})();
