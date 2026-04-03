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

async function findFontRows(page) {
  return page.evaluate(() => {
    const results = [];
    const labels = ['Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (labels.includes(ownText) && el.tagName === 'SPAN') {
        const rect = el.getBoundingClientRect();
        if (rect.x > 300 && rect.width > 100) {
          results.push({ label: ownText, x: Math.round(rect.x + rect.width / 2), y: Math.round(rect.y + rect.height / 2) });
        }
      }
    }
    return results;
  });
}

async function setFont(page, categoryLabel, fontName) {
  console.log(`\n========== ${categoryLabel} → ${fontName} ==========`);
  
  // 1. Scroll to top and find row
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  
  let rows = await findFontRows(page);
  let row = rows.find(r => r.label === categoryLabel);
  if (!row) {
    await page.evaluate(() => window.scrollBy(0, 300));
    await delay(500);
    rows = await findFontRows(page);
    row = rows.find(r => r.label === categoryLabel);
  }
  if (!row) { console.log(`  ✗ Row not found`); return false; }
  
  // 2. Click row to expand
  console.log(`  → Click row at (${row.x}, ${row.y})`);
  await page.mouse.click(row.x, row.y);
  await delay(2000);
  
  // 3. Find "Choose a font" button (or current font name button)
  const fontBtn = await page.evaluate(() => {
    const btns = document.querySelectorAll('button[aria-label]');
    for (const btn of btns) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font: ')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 60 && r.width < 250) {
          return { text: btn.textContent?.trim(), label, x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
      }
    }
    return null;
  });
  
  if (!fontBtn) { console.log('  ✗ Font button not found'); return false; }
  console.log(`  → Font btn: "${fontBtn.text}" (${fontBtn.label})`);
  
  // Check if already correct
  if (fontBtn.text && fontBtn.text.toLowerCase().includes(fontName.split(' ')[0].toLowerCase())) {
    console.log(`  ✓ Already set to "${fontBtn.text}"`);
    // Close by clicking ✓
    await clickCheckmark(page);
    return true;
  }
  
  // 4. Click font button to open picker
  await page.mouse.click(fontBtn.x, fontBtn.y);
  await delay(2000);
  
  // 5. Find search input (type="search" with font placeholder)
  const searchInput = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="search"]');
    for (const inp of inputs) {
      if (inp.placeholder.includes('Calligraphy') || inp.placeholder.includes('Open Sans')) {
        const r = inp.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
    }
    return null;
  });
  
  if (!searchInput) { console.log('  ✗ Search input not found'); return false; }
  console.log(`  → Search at (${Math.round(searchInput.x)}, ${Math.round(searchInput.y)})`);

  // 6. Click search, clear, type font name
  await page.mouse.click(searchInput.x, searchInput.y);
  await delay(300);
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await delay(100);
  await page.keyboard.type(fontName, { delay: 80 });
  await delay(2500);
  
  // 7. Find matching font result and click it
  // Look for clickable elements containing the font name (broader selector)
  const fontResult = await page.evaluate((fontName) => {
    const firstWord = fontName.split(' ')[0]; // e.g. "Space" or "Bebas" or "JetBrains"
    // Walk through all elements that could be font list items
    const candidates = document.querySelectorAll('button, div[role="option"], li, [role="option"], [role="menuitem"]');
    for (const el of candidates) {
      const text = el.textContent?.trim() || '';
      if (text.includes(fontName) && !text.includes('Upload')) {
        const r = el.getBoundingClientRect();
        // Filter: must be visible, reasonable size, in the picker area
        if (r.width > 100 && r.height > 20 && r.height < 80 && r.y > 300) {
          // Skip if it has an input inside (the search container)
          if (!el.querySelector('input')) {
            return { text: text.substring(0, 60), x: r.x + r.width / 2, y: r.y + r.height / 2 };
          }
        }
      }
    }
    // Fallback: find any element with cursor:pointer containing font name
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const text = el.textContent?.trim() || '';
      const style = window.getComputedStyle(el);
      if (text.includes(fontName) && !text.includes('Upload') && style.cursor === 'pointer') {
        const r = el.getBoundingClientRect();
        if (r.width > 100 && r.width < 400 && r.height > 20 && r.height < 60 && r.y > 400) {
          return { text: text.substring(0, 60), x: r.x + r.width / 2, y: r.y + r.height / 2, fb: true };
        }
      }
    }
    return null;
  }, fontName);
  
  if (fontResult) {
    console.log(`  → Result: "${fontResult.text}" at (${Math.round(fontResult.x)}, ${Math.round(fontResult.y)})${fontResult.fb ? ' [fallback]' : ''}`);
    await page.mouse.click(fontResult.x, fontResult.y);
    await delay(2000);
  } else {
    console.log('  ✗ No font result found!');
    await page.screenshot({ path: `scripts/debug_${categoryLabel.replace(/ /g, '_')}.png` });
    
    // Dump what's visible in the picker for debugging
    const visible = await page.evaluate((fontName) => {
      const items = [];
      const firstWord = fontName.split(' ')[0];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (ownText.length > 2 && (ownText.includes(firstWord) || ownText.includes(fontName))) {
          const r = el.getBoundingClientRect();
          if (r.width > 20 && r.height > 10) {
            items.push({
              text: ownText.substring(0, 40), tag: el.tagName,
              x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
              cursor: window.getComputedStyle(el).cursor,
            });
          }
        }
      }
      return items;
    }, fontName);
    console.log('  Visible elements with font name:', JSON.stringify(visible, null, 2));
    
    // Press Escape to close picker
    await page.keyboard.press('Escape');
    await delay(1000);
    // Press Escape again or click X to close expanded row
    await page.keyboard.press('Escape');
    await delay(1000);
    return false;
  }
  
  // 8. Click ✓ checkmark to confirm
  await clickCheckmark(page);
  
  console.log(`  ✓ Done`);
  return true;
}

async function clickCheckmark(page) {
  // The ✓ button:
  // From screenshot, it's at the right side of the expanded font row
  // It has NO text, just an SVG checkmark icon
  // aria-label might be empty or specific
  // Let me look for small buttons at the right side of the font row area
  
  const checkBtn = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    // Find all small buttons grouped at the right of the expanded area
    // They should be ~32x32 or similar, at x > 1300
    const rightBtns = [];
    for (const btn of btns) {
      const r = btn.getBoundingClientRect();
      const label = btn.getAttribute('aria-label') || '';
      // Skip if it's a delete/trash button or has "discard" label
      if (label.includes('Delete') || label.includes('delete') || label.includes('Manage')) continue;
      // Small buttons at the right of the page
      if (r.x > 1200 && r.width < 80 && r.height < 80 && r.width > 15 && r.height > 15 && r.y > 250 && r.y < 600) {
        rightBtns.push({
          label,
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
          cx: r.x + r.width / 2, cy: r.y + r.height / 2,
          svg: btn.querySelector('svg') ? true : false,
          text: btn.textContent?.trim()?.substring(0, 20),
        });
      }
    }
    // Sort by x position - the first one (leftmost) should be ✓, second is ✕
    rightBtns.sort((a, b) => a.x - b.x);
    return rightBtns;
  });
  
  console.log(`  → Right buttons: ${checkBtn.map(b => `"${b.label || b.text || 'icon'}" (${b.x},${b.y}) ${b.w}x${b.h} svg=${b.svg}`).join('; ')}`);
  
  // The ✓ should be the first small button with an SVG, not the trash/delete icon
  // Typically: ✓ is leftmost, ✕ is to its right, 🗑 is further right
  const confirm = checkBtn.find(b => b.svg && !b.label.includes('discard') && !b.label.includes('Delete'));
  if (confirm) {
    console.log(`  → Check ✓ at (${Math.round(confirm.cx)}, ${Math.round(confirm.cy)})`);
    await page.mouse.click(confirm.cx, confirm.cy);
    await delay(2000);
  } else {
    console.log('  ✗ Checkmark not found');
  }
}

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('canva.com'));
    if (!page) { console.log('No Canva page'); process.exit(1); }
    await page.bringToFront();

    // Navigate to fonts page fresh
    console.log('Navigating to fonts page...');
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(5000);

    // Handle any dialog
    const dialogBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const t = btn.textContent?.trim();
        if (t === 'Leave' || t === 'Discard') {
          const r = btn.getBoundingClientRect();
          if (r.width > 40) return { x: r.x + r.width / 2, y: r.y + r.height / 2, t };
        }
      }
      return null;
    });
    if (dialogBtn) {
      console.log(`Dismissing "${dialogBtn.t}" dialog`);
      await page.mouse.click(dialogBtn.x, dialogBtn.y);
      await delay(3000);
    }

    // Verify rows are loaded
    await delay(2000);
    const rows = await findFontRows(page);
    console.log(`Found rows: ${rows.map(r => r.label).join(', ')}`);
    if (rows.length < 8) {
      console.log('Not all rows loaded, waiting more...');
      await delay(5000);
    }

    // Process each font
    let success = 0;
    for (const config of FONT_CONFIG) {
      const ok = await setFont(page, config.category, config.font);
      if (ok) success++;
    }

    await page.screenshot({ path: 'scripts/fonts_final.png' });
    console.log(`\n========== RESULT: ${success}/${FONT_CONFIG.length} fonts configured ==========`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
