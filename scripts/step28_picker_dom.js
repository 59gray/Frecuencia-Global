const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 90000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) break;
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

  // Find and click "Choose a font" via dispatchEvent
  const fontBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font') {
        const r = btn.getBoundingClientRect();
        if (r.width > 40) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      }
    }
    return null;
  });
  if (!fontBtn) { console.log('No font button'); process.exit(1); }

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
  if (!searchInput) { console.log('No search input'); process.exit(1); }
  console.log('Search input at', searchInput);

  await page.mouse.click(searchInput.x, searchInput.y);
  await delay(300);
  await page.keyboard.type('Space Grotesk', { delay: 30 });
  await delay(4000); // Wait for search

  // Now dump ALL elements in the font picker area (x < 400, y > 120)
  const pickerItems = await page.evaluate(() => {
    const items = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const r = el.getBoundingClientRect();
      // Focus on picker panel area
      if (r.x > 400 || r.width < 20 || r.height < 10 || r.y < 120 || r.y > 900) continue;
      if (r.width > 350) continue; // Skip containers

      const attrs = {};
      for (const attr of el.attributes) {
        if (['aria-label', 'title', 'data-font-family', 'data-testid', 'role', 'class', 'alt', 'src'].includes(attr.name)) {
          attrs[attr.name] = attr.value.substring(0, 100);
        }
      }
      // Only include elements that are likely interactive or have relevant attributes
      const isClickable = el.tagName === 'BUTTON' || el.getAttribute('role') === 'option' || el.getAttribute('role') === 'button' || window.getComputedStyle(el).cursor === 'pointer';
      const hasLabel = el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('data-font-family');
      
      if (isClickable || hasLabel || el.tagName === 'IMG' || el.tagName === 'CANVAS' || el.tagName === 'SVG') {
        items.push({
          tag: el.tagName,
          text: (el.textContent || '').trim().substring(0, 60),
          ownText: [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean).join('').substring(0, 60),
          attrs,
          x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
          cursor: window.getComputedStyle(el).cursor,
          children: el.children.length,
        });
      }
    }
    return items;
  });

  console.log(`\n=== Font picker items (${pickerItems.length}) ===`);
  for (const item of pickerItems) {
    const attrStr = Object.entries(item.attrs).map(([k,v]) => `${k}="${v}"`).join(' ');
    console.log(`  <${item.tag}> ${item.w}x${item.h} (${item.x},${item.y}) cursor=${item.cursor} children=${item.children}`);
    if (attrStr) console.log(`    attrs: ${attrStr}`);
    if (item.text) console.log(`    text: "${item.text}"`);
    if (item.ownText) console.log(`    ownText: "${item.ownText}"`);
  }

  // Also check for elements that have font-related data attributes
  const fontData = await page.evaluate(() => {
    const results = [];
    for (const el of document.querySelectorAll('[data-font-family], [data-testid*="font"], [aria-label*="font" i], [aria-label*="grotesk" i], [aria-label*="bebas" i], [title*="font" i], [title*="grotesk" i]')) {
      const r = el.getBoundingClientRect();
      results.push({
        tag: el.tagName,
        label: el.getAttribute('aria-label') || '',
        title: el.getAttribute('title') || '',
        dataFont: el.getAttribute('data-font-family') || '',
        testId: el.getAttribute('data-testid') || '',
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      });
    }
    return results;
  });
  console.log(`\n=== Font-related data attributes (${fontData.length}) ===`);
  for (const f of fontData) {
    console.log(`  <${f.tag}> (${f.x},${f.y}) ${f.w}x${f.h} label="${f.label}" title="${f.title}" data-font="${f.dataFont}" testId="${f.testId}"`);
  }

  await browser.disconnect();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
