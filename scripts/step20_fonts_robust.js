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
              return { cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2 };
            }
            p = p.parentElement;
          }
        }
      }
    }
    return null;
  }, label);
}

async function waitForFontButton(page, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const btn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Choose a font' || label.startsWith('Font:')) {
          const r = btn.getBoundingClientRect();
          if (r.width > 60 && r.width < 300 && r.y > 200) {
            return { text: btn.textContent?.trim(), label, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
          }
        }
      }
      return null;
    });
    if (btn) return btn;
    await delay(500);
  }
  return null;
}

async function waitForSearchInput(page, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const inp = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        if (inp.placeholder?.includes('Calligraphy') || inp.placeholder?.includes('Open Sans')) {
          const r = inp.getBoundingClientRect();
          if (r.width > 100) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
        }
      }
      return null;
    });
    if (inp) return inp;
    await delay(500);
  }
  return null;
}

async function discardAllDirty(page) {
  // Click all "Discard" buttons to clean up dirty rows
  let found = true;
  while (found) {
    found = false;
    const discardBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 20) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (discardBtn) {
      found = true;
      await page.mouse.click(discardBtn.x, discardBtn.y);
      await delay(1500);
    }
  }
}

async function setFont(page, category, fontName) {
  console.log(`\n===== ${category} → ${fontName} =====`);
  
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  
  let row = await getRowCenter(page, category);
  if (!row) {
    await page.evaluate(() => window.scrollBy(0, 300));
    await delay(500);
    row = await getRowCenter(page, category);
  }
  if (!row) { console.log('  ✗ Row not found'); return false; }
  
  // Click row - use mouse move then click for reliability
  console.log(`  Click (${Math.round(row.cx)}, ${Math.round(row.cy)})`);
  await page.mouse.move(row.cx, row.cy);
  await delay(300);
  await page.mouse.click(row.cx, row.cy);
  
  // Poll for font button
  const fontBtn = await waitForFontButton(page, 5000);
  if (!fontBtn) { 
    console.log('  ✗ Font button not found after 5s');
    await page.screenshot({ path: `scripts/fail_${category.replace(/ /g,'_')}.png` });
    return false; 
  }
  
  // Check if already correct
  if (fontBtn.text && fontBtn.text.toLowerCase().includes(fontName.split(' ')[0].toLowerCase())) {
    console.log(`  Already "${fontBtn.text}"`);
    // Find and click the save/confirm button
    const saveBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label.includes('save') && !label.includes('discard') && !label.includes('Delete')) {
          const r = btn.getBoundingClientRect();
          if (r.x > 1200 && r.width < 80) return { x: r.x + r.width / 2, y: r.y + r.height / 2, label };
        }
      }
      return null;
    });
    if (saveBtn) {
      await page.mouse.click(saveBtn.x, saveBtn.y);
      await delay(1500);
    }
    return true;
  }
  
  // Open font picker
  console.log(`  Font: "${fontBtn.text}" → opening picker`);
  await page.mouse.click(fontBtn.cx, fontBtn.cy);
  
  // Wait for search input
  const searchInput = await waitForSearchInput(page, 5000);
  if (!searchInput) { console.log('  ✗ Search not found'); return false; }
  
  // Type font name
  await page.mouse.click(searchInput.cx, searchInput.cy);
  await delay(200);
  // Triple click to select all
  await page.mouse.click(searchInput.cx, searchInput.cy, { clickCount: 3 });
  await delay(100);
  await page.keyboard.type(fontName, { delay: 60 });
  await delay(3000);
  
  // Find font result
  const result = await page.evaluate((fontName) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    const matches = [];
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
      if (!ownText) continue;
      if (ownText.includes(fontName) || (fontName.includes(' ') && ownText.includes(fontName.split(' ')[0]) && ownText.includes(fontName.split(' ')[1]))) {
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        // Must be in the picker area (y > 400) and reasonable size
        if (r.width > 50 && r.height > 15 && r.height < 80 && r.y > 350) {
          matches.push({
            text: ownText.substring(0, 60), tag: el.tagName,
            cx: r.x + r.width / 2, cy: r.y + r.height / 2,
            w: r.width, h: r.height,
            clickable: cs.cursor === 'pointer' || el.tagName === 'BUTTON',
          });
        }
      }
    }
    // Prefer clickable, then largest height (the actual item row)
    const clickable = matches.filter(m => m.clickable);
    if (clickable.length > 0) return clickable.sort((a, b) => b.h - a.h)[0];
    return matches.sort((a, b) => b.h - a.h)[0] || null;
  }, fontName);
  
  if (!result) {
    console.log('  ✗ No font result');
    await page.screenshot({ path: `scripts/noresult_${category.replace(/ /g, '_')}.png` });
    await page.keyboard.press('Escape');
    await delay(500);
    // Discard changes
    const discardBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.x > 1200) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (discardBtn) { await page.mouse.click(discardBtn.x, discardBtn.y); await delay(1000); }
    return false;
  }
  
  console.log(`  Result: "${result.text}" at (${Math.round(result.cx)},${Math.round(result.cy)}) ${result.clickable?'clickable':'not-clickable'}`);
  await page.mouse.click(result.cx, result.cy);
  await delay(2000);
  
  // Verify: check if font button now shows the font name
  const newFontBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label.startsWith('Font:') || label === 'Choose a font') {
        return { text: btn.textContent?.trim(), label };
      }
    }
    return null;
  });
  console.log(`  After: "${newFontBtn?.text || 'null'}" label="${newFontBtn?.label || 'null'}"`);
  
  // Click save/confirm button
  // From debug: y=457 x=1756  label="Please select a font before saving" (when no font selected)
  // After selecting: the label should change to allow saving
  await delay(500);
  const saveBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      const r = btn.getBoundingClientRect();
      // The confirm/save button: at x > 1600, y > 300, y < 600, small size, NOT "Discard" and NOT "Delete"
      if (r.x > 1600 && r.x < 1850 && r.width < 80 && r.height < 80 && r.y > 300 && r.y < 600) {
        if (!label.includes('Discard') && !label.includes('Delete') && !label.includes('Please save/discard')) {
          return { x: r.x + r.width / 2, y: r.y + r.height / 2, label, w: r.width, h: r.height };
        }
      }
    }
    return null;
  });
  
  if (saveBtn) {
    console.log(`  Save btn: label="${saveBtn.label}" at (${Math.round(saveBtn.x)},${Math.round(saveBtn.y)}) ${saveBtn.w}x${saveBtn.h}`);
    await page.mouse.click(saveBtn.x, saveBtn.y);
    await delay(2000);
    console.log('  ✓ Saved');
  } else {
    console.log('  ⚠ No explicit save button found - checking all buttons in confirm area');
    const btnsInArea = await page.evaluate(() => {
      const results = [];
      for (const btn of document.querySelectorAll('button')) {
        const r = btn.getBoundingClientRect();
        const label = btn.getAttribute('aria-label') || '';
        if (r.x > 1600 && r.y > 300 && r.y < 600 && r.width < 80) {
          results.push({ label, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
      return results;
    });
    console.log('  Buttons:', btnsInArea.map(b => `(${b.x},${b.y}) "${b.label}" ${b.w}x${b.h}`).join('; '));
    
    // Try to click the first one that's not Discard or Delete
    const confirm = btnsInArea.find(b => !b.label.includes('Discard') && !b.label.includes('Delete') && !b.label.includes('Please save/discard'));
    if (confirm) {
      await page.mouse.click(confirm.x + confirm.w / 2, confirm.y + confirm.h / 2);
      await delay(2000);
      console.log('  ✓ Clicked confirm');
    }
  }
  
  return true;
}

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('canva.com'));
    if (!page) { console.log('No Canva'); process.exit(1); }
    await page.bringToFront();

    // Fresh load
    console.log('Loading fonts page...');
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(8000);

    // Handle Leave/Discard dialog
    const dlg = await page.evaluate(() => {
      for (const b of document.querySelectorAll('button')) {
        if (['Leave', 'Discard'].includes(b.textContent?.trim())) {
          const r = b.getBoundingClientRect();
          return r.width > 30 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
        }
      }
      return null;
    });
    if (dlg) { await page.mouse.click(dlg.x, dlg.y); await delay(5000); }

    // Discard all dirty rows first
    console.log('Discarding dirty rows...');
    await discardAllDirty(page);
    await delay(2000);
    console.log('Clean state');

    let ok = 0;
    for (const cfg of FONT_CONFIG) {
      const success = await setFont(page, cfg.category, cfg.font);
      if (success) ok++;
      await delay(1000);
    }

    await page.screenshot({ path: 'scripts/fonts_final_v2.png' });
    console.log(`\n===== RESULT: ${ok}/${FONT_CONFIG.length} =====`);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
