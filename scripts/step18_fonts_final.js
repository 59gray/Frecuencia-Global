const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONT_CONFIG = [
  { category: 'Subtitle',       font: 'Space Grotesk' },
  { category: 'Heading',        font: 'Bebas Neue' },
  { category: 'Subheading',     font: 'Space Grotesk' },
  { category: 'Section header', font: 'Space Grotesk' },
  { category: 'Body',           font: 'Space Grotesk' },
  { category: 'Quote',          font: 'Space Grotesk' },
  { category: 'Caption',        font: 'JetBrains Mono' },
];

async function getRowCenter(page, label) {
  return page.evaluate((label) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (ownText === label && el.tagName === 'SPAN') {
        const r = el.getBoundingClientRect();
        if (r.x > 300 && r.width > 100) {
          let p = el.parentElement;
          while (p) {
            if (window.getComputedStyle(p).cursor === 'pointer') {
              const pr = p.getBoundingClientRect();
              return { cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2, y: pr.y, h: pr.height };
            }
            p = p.parentElement;
          }
        }
      }
    }
    return null;
  }, label);
}

async function findConfirmButton(page) {
  // Look for ✓ and ✕ icons - they're usually SVG-based buttons
  // They should be at x > 1400 in the expanded row area
  return page.evaluate(() => {
    // Strategy 1: Look for all small clickable elements with SVG at x > 1350
    const candidates = [];
    const allEls = document.querySelectorAll('button, [role="button"], span, div, a');
    for (const el of allEls) {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (r.x > 1350 && r.x < 1550 && r.width > 10 && r.width < 60 && r.height > 10 && r.height < 60 && r.y > 300 && r.y < 500) {
        const hasSvg = el.querySelector('svg') || el.tagName === 'svg';
        const label = el.getAttribute('aria-label') || '';
        if ((hasSvg || style.cursor === 'pointer' || el.tagName === 'BUTTON') && !label.includes('Delete')) {
          candidates.push({
            x: r.x + r.width / 2,
            y: r.y + r.height / 2,
            w: r.width, h: r.height,
            tag: el.tagName, label,
            cursor: style.cursor,
          });
        }
      }
    }
    // Sort by x - first one should be ✓, second ✕
    candidates.sort((a, b) => a.x - b.x);
    // Deduplicate (nested elements produce duplicates)
    const unique = [];
    for (const c of candidates) {
      if (!unique.some(u => Math.abs(u.x - c.x) < 10 && Math.abs(u.y - c.y) < 10)) {
        unique.push(c);
      }
    }
    return unique;
  });
}

async function setFont(page, category, fontName) {
  console.log(`\n===== ${category} → ${fontName} =====`);
  
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(800);
  
  // Find and click row CENTER
  let row = await getRowCenter(page, category);
  if (!row) {
    await page.evaluate(() => window.scrollBy(0, 300));
    await delay(800);
    row = await getRowCenter(page, category);
  }
  if (!row) { console.log('  ✗ Row not found'); return false; }
  
  console.log(`  Click row center (${Math.round(row.cx)}, ${Math.round(row.cy)})`);
  await page.mouse.click(row.cx, row.cy);
  await delay(2000);
  
  // Find font dropdown button
  const fontBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font:')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 60 && r.width < 300) {
          return { text: btn.textContent?.trim(), label, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
        }
      }
    }
    return null;
  });
  
  if (!fontBtn) { console.log('  ✗ Font button not found'); return false; }
  
  // Check if already set correctly
  if (fontBtn.text && fontBtn.text.toLowerCase().includes(fontName.split(' ')[0].toLowerCase())) {
    console.log(`  Already "${fontBtn.text}" - confirming`);
    const btns = await findConfirmButton(page);
    if (btns.length > 0) {
      await page.mouse.click(btns[0].x, btns[0].y);
      await delay(1500);
      console.log('  ✓ Confirmed');
    }
    return true;
  }
  
  // Click font dropdown
  console.log(`  Font: "${fontBtn.text}" → clicking to open picker`);
  await page.mouse.click(fontBtn.cx, fontBtn.cy);
  await delay(2000);
  
  // Find search input
  const searchInput = await page.evaluate(() => {
    for (const inp of document.querySelectorAll('input[type="search"]')) {
      if (inp.placeholder && (inp.placeholder.includes('Calligraphy') || inp.placeholder.includes('Open Sans'))) {
        const r = inp.getBoundingClientRect();
        return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      }
    }
    return null;
  });
  
  if (!searchInput) { console.log('  ✗ No search input'); return false; }
  
  // Type font name
  await page.mouse.click(searchInput.cx, searchInput.cy);
  await delay(300);
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await delay(100);
  await page.keyboard.type(fontName, { delay: 60 });
  await delay(3000);
  
  // Take screenshot to see search results
  await page.screenshot({ path: `scripts/search_${category.replace(/ /g, '_')}.png` });
  
  // Find matching font result in the picker
  // The picker shows results as divs with font sample text, inside a scrollable list
  const result = await page.evaluate((fontName) => {
    const first = fontName.split(' ')[0]; // "Space", "Bebas", "JetBrains"
    
    // Walk ALL elements looking for one that contains the exact font name
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    const matches = [];
    while (walker.nextNode()) {
      const el = walker.currentNode;
      // Check own text (not children's text)
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
      if (!ownText) continue;
      
      // Match font name
      if (ownText.includes(first) || ownText.includes(fontName)) {
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        if (r.width > 50 && r.height > 10 && r.height < 80 && r.y > 300) {
          matches.push({
            text: ownText.substring(0, 60),
            tag: el.tagName,
            x: r.x, y: r.y, w: r.width, h: r.height,
            cx: r.x + r.width / 2, cy: r.y + r.height / 2,
            cursor: cs.cursor,
            clickable: cs.cursor === 'pointer' || el.tagName === 'BUTTON' || el.closest('button') !== null,
          });
        }
      }
    }
    
    // Prefer clickable items that exactly match the font name
    const exact = matches.filter(m => m.text.includes(fontName));
    const clickable = exact.filter(m => m.clickable);
    if (clickable.length > 0) return clickable[0];
    if (exact.length > 0) return exact[0];
    
    // Fallback: any match
    const anyClick = matches.filter(m => m.clickable);
    if (anyClick.length > 0) return anyClick[0];
    return matches.length > 0 ? matches[0] : null;
  }, fontName);
  
  if (!result) {
    console.log('  ✗ No search result found!');
    // Debug: dump all visible text in picker area
    const visible = await page.evaluate(() => {
      const items = [];
      for (const el of document.querySelectorAll('div, span, button, li')) {
        const r = el.getBoundingClientRect();
        if (r.x > 220 && r.x < 620 && r.y > 450 && r.y < 900 && r.height > 15 && r.height < 60) {
          const text = el.textContent?.trim();
          if (text && text.length < 40 && text.length > 1) {
            items.push(`"${text}" at (${Math.round(r.x)},${Math.round(r.y)}) ${el.tagName}`);
          }
        }
      }
      // Deduplicate
      return [...new Set(items)].slice(0, 20);
    });
    console.log('  Picker content:', visible.join('\n    '));
    
    await page.keyboard.press('Escape');
    await delay(1000);
    await page.keyboard.press('Escape');
    await delay(1000);
    return false;
  }
  
  console.log(`  Result: "${result.text}" (${result.tag}) at (${Math.round(result.cx)},${Math.round(result.cy)}) clickable=${result.clickable}`);
  
  // Click the result - if it's not clickable, try clicking its parent or nearby
  await page.mouse.click(result.cx, result.cy);
  await delay(2000);
  
  // Verify font was selected - the dropdown should now show the font name
  const afterSelect = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font:')) {
        return btn.textContent?.trim();
      }
    }
    return null;
  });
  console.log(`  After select: font button shows "${afterSelect}"`);
  
  // Click confirm ✓
  const confirmBtns = await findConfirmButton(page);
  console.log(`  Confirm candidates: ${confirmBtns.map(b => `(${Math.round(b.x)},${Math.round(b.y)}) ${b.tag} "${b.label}" cursor=${b.cursor}`).join('; ')}`);
  
  if (confirmBtns.length > 0) {
    // Click the first one (leftmost = ✓)
    await page.mouse.click(confirmBtns[0].x, confirmBtns[0].y);
    await delay(2000);
    console.log('  ✓ Confirmed');
  } else {
    console.log('  ✗ No confirm button found, trying visual coordinates...');
    // From screenshots: ✓ is at approximately (1451, 392) for Subtitle
    // But y varies by row. Let me use the row's Y position as reference
    // The ✓ is at the same Y as the preview text row, which is ~23px below the controls
    // Let me use the expanded row area
    await page.screenshot({ path: `scripts/noconfirm_${category.replace(/ /g, '_')}.png` });
  }
  
  return true;
}

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('canva.com'));
    if (!page) { console.log('No Canva page'); process.exit(1); }
    await page.bringToFront();

    // Navigate fresh
    console.log('Loading fonts page...');
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(5000);

    // Dismiss any dialog
    const dialog = await page.evaluate(() => {
      for (const b of document.querySelectorAll('button')) {
        if (['Leave', 'Discard'].includes(b.textContent?.trim())) {
          const r = b.getBoundingClientRect();
          return r.width > 30 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
        }
      }
      return null;
    });
    if (dialog) { await page.mouse.click(dialog.x, dialog.y); await delay(3000); }

    await delay(2000);

    let ok = 0;
    for (const cfg of FONT_CONFIG) {
      const success = await setFont(page, cfg.category, cfg.font);
      if (success) ok++;
      await delay(500);
    }

    await page.screenshot({ path: 'scripts/fonts_result.png' });
    console.log(`\n===== RESULT: ${ok}/${FONT_CONFIG.length} =====`);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
