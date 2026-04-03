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

// Force exit after 5 minutes
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
}

async function scrollToCategory(page, category) {
  return await page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== cat) continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20) continue;
      // If below viewport, scroll it into view
      if (r.y > window.innerHeight - 100 || r.y < 50) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        return 'scrolled';
      }
      return 'visible';
    }
    return null;
  }, category);
}

async function expandCategory(page, category) {
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
  // Use dispatchEvent with PointerEvent — the ONLY method that works
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

  // Check if search input appeared
  const searchInput = await page.evaluate(() => {
    for (const inp of document.querySelectorAll('input[type="search"]')) {
      const r = inp.getBoundingClientRect();
      if (r.width > 50 && r.height > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  return searchInput;
}

async function searchAndSelectFont(page, searchInput, fontName) {
  // Click search input
  await page.mouse.click(searchInput.x, searchInput.y);
  await delay(500);
  // Clear any existing text
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await delay(200);
  // Type font name
  await page.keyboard.type(fontName, { delay: 30 });
  await delay(3000); // Wait for search results to load

  // Find the best matching font result
  const fontResult = await page.evaluate((fontName) => {
    const nameLC = fontName.toLowerCase();
    const candidates = [];
    
    // Look for clickable elements containing the font name
    for (const el of document.querySelectorAll('button, [role="option"], [role="button"], span, div')) {
      const r = el.getBoundingClientRect();
      // Only look in the picker panel area (left side, below search at y~90)
      if (r.x > 400 || r.width < 30 || r.height < 15 || r.y < 120) continue;
      
      const text = (el.textContent || '').trim();
      const textLC = text.toLowerCase();
      
      // Skip if it's a container that has nested clickable children
      if (el.children.length > 3) continue;
      
      if (textLC === nameLC) {
        candidates.push({ x: r.x + r.width / 2, y: r.y + r.height / 2, score: 100, text });
      } else if (textLC === nameLC + ' regular' || textLC === nameLC + ' light') {
        candidates.push({ x: r.x + r.width / 2, y: r.y + r.height / 2, score: 90, text });
      } else if (textLC.startsWith(nameLC)) {
        candidates.push({ x: r.x + r.width / 2, y: r.y + r.height / 2, score: 70, text });
      } else if (textLC.includes(nameLC)) {
        candidates.push({ x: r.x + r.width / 2, y: r.y + r.height / 2, score: 50, text });
      }
    }
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }, fontName);

  if (!fontResult) {
    // Dump what we CAN see in the picker panel for debugging
    const visible = await page.evaluate(() => {
      const items = [];
      for (const el of document.querySelectorAll('button, [role="option"]')) {
        const r = el.getBoundingClientRect();
        if (r.x < 400 && r.width > 30 && r.height > 15 && r.y > 120 && r.y < 800) {
          items.push({ text: (el.textContent || '').trim().substring(0, 50), y: Math.round(r.y) });
        }
      }
      return items.slice(0, 10);
    });
    console.log('  Visible items in picker:', JSON.stringify(visible));
    return null;
  }

  console.log(`  Best match: "${fontResult.text}" (score: ${fontResult.score}) at (${fontResult.x}, ${fontResult.y})`);

  // Try page.mouse.click first
  await page.mouse.click(fontResult.x, fontResult.y);
  await delay(1000);

  // Check if font was selected (button label should change)
  const afterClick = await findFontButton(page);
  if (afterClick && afterClick.label.startsWith('Font:')) {
    return afterClick.label;
  }

  // If mouse click didn't work, try dispatchEvent
  console.log('  Trying dispatchEvent on font result...');
  await page.evaluate((x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window };
    el.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
    el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
    el.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
    el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
    el.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
    el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
  }, fontResult.x, fontResult.y);
  await delay(2000);

  const afterDispatch = await findFontButton(page);
  if (afterDispatch && afterDispatch.label.startsWith('Font:')) {
    return afterDispatch.label;
  }

  return null; // Font selection failed
}

async function saveChanges(page) {
  // Method 1: Find save button that's a sibling of Discard
  const saveBtn = await page.evaluate(() => {
    const discard = document.querySelector('button[aria-label="Discard"]');
    if (!discard) return null;
    const parent = discard.parentElement;
    if (!parent) return null;
    for (const btn of parent.querySelectorAll('button')) {
      if (btn === discard) continue;
      const r = btn.getBoundingClientRect();
      const label = btn.getAttribute('aria-label') || btn.textContent?.trim() || '';
      if (r.width > 20 && r.height > 15) return { x: r.x + r.width / 2, y: r.y + r.height / 2, label };
    }
    return null;
  });

  if (saveBtn) {
    console.log(`  Save button: "${saveBtn.label}" at (${saveBtn.x}, ${saveBtn.y})`);
    await page.mouse.click(saveBtn.x, saveBtn.y);
    await delay(3000);
    return true;
  }

  // Method 2: Look for any save button
  const saveAny = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const text = (btn.textContent || '').trim();
      const label = btn.getAttribute('aria-label') || '';
      if ((text === 'Save' || label === 'Save') && !btn.disabled) {
        const r = btn.getBoundingClientRect();
        if (r.width > 20) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
    }
    return null;
  });

  if (saveAny) {
    await page.mouse.click(saveAny.x, saveAny.y);
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

    // Navigate fresh each time
    await waitForPage(page);
    await discardAll(page);

    // Scroll to category if needed
    const scrollResult = await scrollToCategory(page, category);
    if (!scrollResult) {
      console.log(`  ✗ Category "${category}" not found on page`);
      results.push({ category, status: 'FAIL', reason: 'Category not found' });
      continue;
    }
    if (scrollResult === 'scrolled') {
      await delay(1000);
    }

    // Expand category row
    const expanded = await expandCategory(page, category);
    if (!expanded) {
      console.log(`  ✗ Failed to expand row`);
      results.push({ category, status: 'FAIL', reason: 'Expansion failed' });
      continue;
    }
    console.log(`  Expanded at y=${Math.round(expanded.y)}`);
    await delay(2500);

    // Find font button
    const fontBtn = await findFontButton(page);
    if (!fontBtn) {
      console.log(`  ✗ Font button not found after expansion`);
      results.push({ category, status: 'FAIL', reason: 'Font button not found' });
      continue;
    }
    console.log(`  Font button: "${fontBtn.label}"`);

    // Check if correct font is already set
    if (fontBtn.label.startsWith('Font:')) {
      const current = fontBtn.label.replace('Font: ', '').trim();
      if (current.toLowerCase().includes(font.split(' ')[0].toLowerCase())) {
        console.log(`  ✓ Already set to "${current}"`);
        results.push({ category, status: 'OK', reason: `Already set to ${current}` });
        continue;
      }
      console.log(`  Current font: "${current}" — need to change to "${font}"`);
    }

    // Open font picker
    const searchInput = await openFontPicker(page, fontBtn.cx, fontBtn.cy);
    if (!searchInput) {
      console.log(`  ✗ Font picker did not open (no search input found)`);
      results.push({ category, status: 'FAIL', reason: 'Picker did not open' });
      continue;
    }
    console.log(`  Font picker opened, search at (${searchInput.x}, ${searchInput.y})`);

    // Search and select font
    const selected = await searchAndSelectFont(page, searchInput, font);
    if (!selected) {
      console.log(`  ✗ Could not select font "${font}"`);
      results.push({ category, status: 'FAIL', reason: 'Font selection failed' });
      continue;
    }
    console.log(`  Font selected: ${selected}`);

    // Save changes
    const saved = await saveChanges(page);
    if (saved) {
      console.log(`  ✓ SAVED!`);
      results.push({ category, status: 'OK', reason: 'Configured and saved' });
    } else {
      console.log(`  ⚠ Could not find save button`);
      results.push({ category, status: 'PARTIAL', reason: 'Font selected but save failed' });
    }

    await delay(2000);
  }

  // Final report
  console.log(`\n${'='.repeat(55)}`);
  console.log('  FINAL RESULTS');
  console.log(`${'='.repeat(55)}`);
  const ok = results.filter(r => r.status === 'OK').length;
  const partial = results.filter(r => r.status === 'PARTIAL').length;
  for (const r of results) {
    const icon = r.status === 'OK' ? '✓' : r.status === 'PARTIAL' ? '⚠' : '✗';
    console.log(`  ${icon} ${r.category}: ${r.status} — ${r.reason}`);
  }
  console.log(`\n  ${ok}/${FONTS.length} fonts configured (${partial} partial)`);

  await browser.disconnect();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
