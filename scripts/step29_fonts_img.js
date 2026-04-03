const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

const FONTS = [
  { category: 'Title', font: 'Bebas Neue' },
  { category: 'Subtitle', font: 'Space Grotesk' },
  { category: 'Heading', font: 'Bebas Neue' },
  { category: 'Subheading', font: 'Space Grotesk' },
  { category: 'Section header', font: 'Space Grotesk' },
  { category: 'Body', font: 'Space Grotesk' },
  { category: 'Quote', font: 'Space Grotesk' },
  { category: 'Caption', font: 'JetBrains Mono' },
];

setTimeout(() => { console.log('TIMEOUT: Force exit'); process.exit(1); }, 300000);

async function waitForPage(page) {
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) break;
  }
  await delay(2000);
}

async function discardAll(page) {
  for (let i = 0; i < 5; i++) {
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
}

async function expandCategory(page, category) {
  // First scroll into view if off-screen
  await page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own === cat) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        break;
      }
    }
  }, category);
  await delay(500);

  // Now expand via dispatchEvent dblclick
  return await page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== cat) continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20) continue;
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
  }, category);
}

async function findFontButton(page) {
  return await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font:')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 40 && r.height > 10) return { label, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      }
    }
    return null;
  });
}

async function openFontPicker(page, cx, cy) {
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
  }, cx, cy);
  await delay(2000);

  return await page.evaluate(() => {
    for (const inp of document.querySelectorAll('input[type="search"]')) {
      const r = inp.getBoundingClientRect();
      if (r.width > 50 && r.height > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
}

async function searchAndSelectFont(page, searchInput, fontName) {
  // Click and clear search input
  await page.mouse.click(searchInput.x, searchInput.y);
  await delay(300);
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await delay(200);
  await page.keyboard.type(fontName, { delay: 30 });
  await delay(4000);

  // Find font by IMG title attribute (font names are rendered as images)
  const fontRow = await page.evaluate((fontName) => {
    const nameLC = fontName.toLowerCase();
    const candidates = [];

    // Search for IMG elements with title matching the font name
    for (const img of document.querySelectorAll('img[title]')) {
      const title = img.getAttribute('title') || '';
      const titleLC = title.toLowerCase();
      const r = img.getBoundingClientRect();
      if (r.width < 10 || r.height < 10 || r.x > 400) continue;

      // Find the clickable parent row (DIV.dR_Nag or similar)
      let rowEl = img;
      for (let i = 0; i < 5; i++) {
        if (!rowEl.parentElement) break;
        rowEl = rowEl.parentElement;
        const rr = rowEl.getBoundingClientRect();
        if (rr.width > 300 && rr.height >= 35 && rr.height <= 50) break;
      }
      const rowR = rowEl.getBoundingClientRect();

      let score = 0;
      if (titleLC === nameLC) score = 100;
      else if (titleLC === nameLC + ' light' || titleLC === nameLC + ' regular') score = 95;
      else if (titleLC.startsWith(nameLC)) score = 80;
      else if (titleLC.includes(nameLC)) score = 60;

      if (score > 0) {
        candidates.push({
          title,
          score,
          cx: rowR.x + rowR.width / 2,
          cy: rowR.y + rowR.height / 2,
          y: Math.round(rowR.y),
        });
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }, fontName);

  if (!fontRow) {
    // Dump what fonts are visible for debugging
    const visible = await page.evaluate(() => {
      const fonts = [];
      for (const img of document.querySelectorAll('img[title]')) {
        const r = img.getBoundingClientRect();
        if (r.width > 10 && r.x < 400 && r.y > 100 && r.y < 900) {
          fonts.push(img.getAttribute('title'));
        }
      }
      return [...new Set(fonts)];
    });
    console.log(`  Visible fonts: ${visible.join(', ')}`);
    return null;
  }

  console.log(`  Match: "${fontRow.title}" (score: ${fontRow.score}) at y=${fontRow.y}`);

  // Click the font row
  await page.mouse.click(fontRow.cx, fontRow.cy);
  await delay(2000);

  // Check if font was selected
  let btn = await findFontButton(page);
  if (btn && btn.label.startsWith('Font:')) return btn.label;

  // Fallback: try dispatchEvent click
  console.log('  Mouse click did not select, trying dispatchEvent...');
  await page.evaluate((cx, cy) => {
    const el = document.elementFromPoint(cx, cy);
    if (!el) return;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
    el.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
    el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
    el.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
    el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
    el.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
    el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
  }, fontRow.cx, fontRow.cy);
  await delay(2000);

  btn = await findFontButton(page);
  if (btn && btn.label.startsWith('Font:')) return btn.label;

  // Second fallback: click the IMG directly
  console.log('  Trying direct IMG click...');
  const imgClick = await page.evaluate((fontTitle) => {
    for (const img of document.querySelectorAll('img[title]')) {
      if ((img.getAttribute('title') || '').toLowerCase().startsWith(fontTitle.toLowerCase())) {
        const r = img.getBoundingClientRect();
        if (r.width < 10) continue;
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
        img.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
        img.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
        img.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
        img.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
        img.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
        img.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
        return true;
      }
    }
    return false;
  }, fontRow.title);
  await delay(2000);

  btn = await findFontButton(page);
  if (btn && btn.label.startsWith('Font:')) return btn.label;

  return null;
}

async function saveChanges(page) {
  // Find save button as sibling of Discard
  const saveBtn = await page.evaluate(() => {
    const discard = document.querySelector('button[aria-label="Discard"]');
    if (!discard) return null;
    const parent = discard.parentElement;
    if (!parent) return null;
    for (const btn of parent.querySelectorAll('button')) {
      if (btn === discard) continue;
      const r = btn.getBoundingClientRect();
      if (r.width > 20 && r.height > 15 && !btn.disabled) {
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: btn.getAttribute('aria-label') || btn.textContent?.trim() || '' };
      }
    }
    return null;
  });

  if (saveBtn) {
    console.log(`  Save button: "${saveBtn.label}"`);
    await page.mouse.click(saveBtn.x, saveBtn.y);
    await delay(3000);
    return true;
  }
  return false;
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  const results = [];

  for (const { category, font } of FONTS) {
    console.log(`\n${'='.repeat(55)}`);
    console.log(`  ${category} → ${font}`);
    console.log(`${'='.repeat(55)}`);

    await waitForPage(page);
    await discardAll(page);

    // Expand
    const expanded = await expandCategory(page, category);
    if (!expanded) {
      console.log(`  ✗ Failed to expand`);
      results.push({ category, status: 'FAIL', reason: 'Expansion failed' });
      continue;
    }
    console.log(`  Expanded at y=${Math.round(expanded.y)}`);
    await delay(2500);

    // Find font button
    const fontBtn = await findFontButton(page);
    if (!fontBtn) {
      console.log(`  ✗ Font button not found`);
      results.push({ category, status: 'FAIL', reason: 'Font button not found' });
      continue;
    }
    console.log(`  Font button: "${fontBtn.label}"`);

    // Already correct?
    if (fontBtn.label.startsWith('Font:')) {
      const current = fontBtn.label.replace('Font: ', '').trim();
      if (current.toLowerCase().includes(font.split(' ')[0].toLowerCase())) {
        console.log(`  ✓ Already "${current}"`);
        results.push({ category, status: 'OK', reason: `Already ${current}` });
        continue;
      }
    }

    // Open picker
    const searchInput = await openFontPicker(page, fontBtn.cx, fontBtn.cy);
    if (!searchInput) {
      console.log(`  ✗ Picker did not open`);
      results.push({ category, status: 'FAIL', reason: 'Picker failed' });
      continue;
    }
    console.log(`  Picker opened`);

    // Search and select
    const selected = await searchAndSelectFont(page, searchInput, font);
    if (!selected) {
      console.log(`  ✗ Font selection failed`);
      results.push({ category, status: 'FAIL', reason: 'Selection failed' });
      continue;
    }
    console.log(`  Selected: ${selected}`);

    // Save
    const saved = await saveChanges(page);
    if (saved) {
      console.log(`  ✓ SAVED!`);
      results.push({ category, status: 'OK', reason: 'Configured' });
    } else {
      console.log(`  ⚠ Save not found`);
      results.push({ category, status: 'PARTIAL', reason: 'Font set, save failed' });
    }

    await delay(2000);
  }

  // Report
  console.log(`\n${'='.repeat(55)}`);
  console.log('  FINAL RESULTS');
  console.log(`${'='.repeat(55)}`);
  const ok = results.filter(r => r.status === 'OK').length;
  for (const r of results) {
    const icon = r.status === 'OK' ? '✓' : r.status === 'PARTIAL' ? '⚠' : '✗';
    console.log(`  ${icon} ${r.category}: ${r.reason}`);
  }
  console.log(`\n  ${ok}/${FONTS.length} configured`);

  await browser.disconnect();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
