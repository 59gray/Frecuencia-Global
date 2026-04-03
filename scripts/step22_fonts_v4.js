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

const BRAND_KIT_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0';

async function navigateToFonts(page) {
  // Go to brand kit main
  await page.goto(BRAND_KIT_URL, { waitUntil: 'networkidle2', timeout: 45000 });
  await delay(5000);
  
  // Click the "Fonts" card
  const fontsCard = await page.evaluate(() => {
    // Find the "Fonts" text label and click near it (the card above it)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent?.trim() === 'Fonts') {
        const range = document.createRange();
        range.selectNode(walker.currentNode);
        const r = range.getBoundingClientRect();
        if (r.x > 200 && r.y > 300) {
          // Click the card area (above the text label)
          return { x: r.x + 50, y: r.y - 80 };
        }
      }
    }
    return null;
  });

  if (!fontsCard) {
    console.log('ERROR: Fonts card not found on brand kit page');
    return false;
  }

  console.log(`Clicking Fonts card at (${fontsCard.x}, ${fontsCard.y})`);
  await page.mouse.click(fontsCard.x, fontsCard.y);
  await delay(5000);

  // Verify we're on the fonts page by checking for font category rows
  const hasFontRows = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return text.includes('Title') && (text.includes('Subtitle') || text.includes('Heading'));
  });

  if (!hasFontRows) {
    console.log('WARNING: Fonts page may not have loaded correctly');
    await page.screenshot({ path: 'scripts/diag22_fonts_page.png' });
    return false;
  }
  
  return true;
}

async function findRow(page, category) {
  // First try without scroll
  let row = await page.evaluate((cat) => {
    const allEls = document.querySelectorAll('span, p, div');
    for (const el of allEls) {
      // Check own text
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').trim();
      if (ownText !== cat) continue;
      const r = el.getBoundingClientRect();
      if (r.x < 200 || r.width < 30) continue;
      
      // Find clickable parent
      let p = el;
      while (p.parentElement) {
        p = p.parentElement;
        const cs = window.getComputedStyle(p);
        if (cs.cursor === 'pointer') {
          const pr = p.getBoundingClientRect();
          return { cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2, w: pr.width };
        }
      }
      // Fallback: return the element center but at a wider x
      return { cx: Math.max(r.x + 400, 900), cy: r.y + r.height / 2, w: r.width };
    }
    return null;
  }, category);
  
  if (row) return row;
  
  // Try scrolling
  for (let scroll = 200; scroll <= 800; scroll += 200) {
    await page.evaluate((s) => window.scrollBy(0, s), 200);
    await delay(500);
    row = await page.evaluate((cat) => {
      const allEls = document.querySelectorAll('span, p, div');
      for (const el of allEls) {
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').trim();
        if (ownText !== cat) continue;
        const r = el.getBoundingClientRect();
        if (r.x < 200 || r.width < 30 || r.y < 50 || r.y > 900) continue;
        let p = el;
        while (p.parentElement) {
          p = p.parentElement;
          const cs = window.getComputedStyle(p);
          if (cs.cursor === 'pointer') {
            const pr = p.getBoundingClientRect();
            return { cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2, w: pr.width };
          }
        }
        return { cx: Math.max(r.x + 400, 900), cy: r.y + r.height / 2, w: r.width };
      }
      return null;
    }, category);
    if (row) return row;
  }
  
  return null;
}

async function waitForButton(page, ariaLabels, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const btn = await page.evaluate((labels) => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (labels.some(l => label === l || label.startsWith(l))) {
          const r = btn.getBoundingClientRect();
          if (r.width > 30 && r.y > 100) {
            return { label, text: btn.textContent?.trim().substring(0, 60), cx: r.x + r.width / 2, cy: r.y + r.height / 2, w: r.width, h: r.height };
          }
        }
      }
      return null;
    }, ariaLabels);
    if (btn) return btn;
    await delay(500);
  }
  return null;
}

async function findAndClickFont(page, fontName) {
  const fontLower = fontName.toLowerCase();
  
  // Strategy 1: Use querySelectorAll to find elements with role="option" or listitem containing font name
  let result = await page.evaluate((fontLower) => {
    // Look for items in the font picker list
    const candidates = [];
    const allEls = document.querySelectorAll('[role="option"], [role="listitem"], li, [data-testid]');
    for (const el of allEls) {
      const tc = el.textContent?.toLowerCase() || '';
      if (!tc.includes(fontLower)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 30 || r.height < 10 || r.y < 50 || r.y > 900 || r.x > 600) continue;
      const cs = window.getComputedStyle(el);
      candidates.push({
        cx: r.x + r.width / 2, cy: r.y + r.height / 2,
        w: r.width, h: r.height,
        tag: el.tagName, role: el.getAttribute('role'),
        text: el.textContent?.trim().substring(0, 60),
        clickable: cs.cursor === 'pointer',
      });
    }
    if (candidates.length > 0) {
      // Prefer clickable + smallest
      candidates.sort((a, b) => {
        if (a.clickable && !b.clickable) return -1;
        if (!a.clickable && b.clickable) return 1;
        return a.h - b.h; // smaller = more specific
      });
      return candidates[0];
    }
    return null;
  }, fontLower);
  
  if (result) return result;
  
  // Strategy 2: Look for ANY element with textContent containing the font name
  result = await page.evaluate((fontLower, fontName) => {
    const candidates = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      const tc = el.textContent?.trim().toLowerCase() || '';
      if (!tc.includes(fontLower)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 15 || r.height > 80 || r.y < 50 || r.y > 900 || r.x > 600) continue;
      
      // Skip if it's the search input itself
      if (el.tagName === 'INPUT') continue;
      // Skip if it's a huge container
      if (r.width > 500 && r.height > 200) continue;
      
      const cs = window.getComputedStyle(el);
      const isLeaf = el.children.length === 0;
      const isClickable = cs.cursor === 'pointer' || el.tagName === 'BUTTON';
      
      let score = 0;
      if (isClickable) score += 100;
      if (isLeaf) score += 50;
      if (tc.length < 40) score += 30;
      // Exact match on the text
      if (tc === fontLower) score += 200;
      if (tc.startsWith(fontLower)) score += 100;
      
      candidates.push({
        cx: r.x + r.width / 2, cy: r.y + r.height / 2,
        w: Math.round(r.width), h: Math.round(r.height),
        tag: el.tagName, text: tc.substring(0, 60),
        clickable: isClickable, score, cursor: cs.cursor,
      });
    }
    
    candidates.sort((a, b) => b.score - a.score);
    return candidates.length > 0 ? { best: candidates[0], debug: candidates.slice(0, 8) } : null;
  }, fontLower, fontName);
  
  if (result) {
    if (result.debug) {
      console.log('  Font candidates:');
      for (const c of result.debug) {
        console.log(`    score=${c.score} ${c.tag} click=${c.clickable} (${c.cx|0},${c.cy|0}) ${c.w}x${c.h} "${c.text}"`);
      }
      return result.best;
    }
    return result;
  }
  
  return null;
}

async function clickSave(page) {
  // The save/confirm is a checkmark button, typically > x=1200
  for (let i = 0; i < 10; i++) {
    const saveBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        const r = btn.getBoundingClientRect();
        if (r.x < 1100 || r.width > 100 || r.y < 150) continue;
        if (label.includes('Discard') || label.includes('Delete') || label.includes('delete')) continue;
        if (label.includes('Please select a font before saving')) continue;
        if (label.includes('Please save/discard')) continue;
        // The save button should be a small button (checkmark icon)
        if (r.width >= 20 && r.width <= 80 && r.height >= 20 && r.height <= 80) {
          // Could have aria-label "Save" or empty (just a checkmark icon)
          return { x: r.x + r.width / 2, y: r.y + r.height / 2, label, w: r.width };
        }
      }
      return null;
    });
    
    if (saveBtn) {
      console.log(`  Save → label="${saveBtn.label}" at (${saveBtn.x|0},${saveBtn.y|0})`);
      await page.mouse.click(saveBtn.x, saveBtn.y);
      await delay(2000);
      return true;
    }
    await delay(500);
  }
  return false;
}

async function clickDiscard(page) {
  const btn = await page.evaluate(() => {
    for (const b of document.querySelectorAll('button[aria-label="Discard"]')) {
      const r = b.getBoundingClientRect();
      if (r.width > 15) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (btn) {
    await page.mouse.click(btn.x, btn.y);
    await delay(1500);
  }
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  let successCount = 0;

  for (const { category, font } of FONT_CONFIG) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`  ${category} → ${font}`);
    console.log(`${'='.repeat(50)}`);
    
    // Fresh navigation to Fonts page for EACH font
    const navOk = await navigateToFonts(page);
    if (!navOk) {
      console.log('  ✗ Could not navigate to Fonts page');
      continue;
    }
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(1000);

    // Find and click the category row
    const row = await findRow(page, category);
    if (!row) {
      console.log(`  ✗ Row "${category}" not found`);
      await page.screenshot({ path: `scripts/fail22_row_${category.replace(/ /g, '_')}.png` });
      continue;
    }

    console.log(`  Row at (${Math.round(row.cx)}, ${Math.round(row.cy)}), w=${Math.round(row.w)}`);
    await page.mouse.move(row.cx, row.cy);
    await delay(200);
    await page.mouse.click(row.cx, row.cy);
    await delay(3000);

    // Wait for "Choose a font" or "Font:*" button
    const fontBtn = await waitForButton(page, ['Choose a font', 'Font:'], 8000);
    if (!fontBtn) {
      console.log(`  ✗ Font button not found after 8s`);
      await page.screenshot({ path: `scripts/fail22_btn_${category.replace(/ /g, '_')}.png` });
      await clickDiscard(page);
      continue;
    }

    console.log(`  Font button: "${fontBtn.text}" [${fontBtn.label}]`);
    
    // Check if already correct
    if (fontBtn.text && fontBtn.text.toLowerCase().includes(font.split(' ')[0].toLowerCase())) {
      console.log(`  ✓ Already set to "${fontBtn.text}"`);
      const saved = await clickSave(page);
      if (saved) successCount++;
      continue;
    }

    // Open font picker
    await page.mouse.click(fontBtn.cx, fontBtn.cy);
    await delay(2500);

    // Find search input
    const searchInput = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 100) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      }
      return null;
    });

    if (!searchInput) {
      console.log(`  ✗ Search input not found`);
      await page.keyboard.press('Escape');
      await delay(500);
      await clickDiscard(page);
      continue;
    }

    // Type font name
    await page.mouse.click(searchInput.cx, searchInput.cy, { clickCount: 3 });
    await delay(200);
    await page.keyboard.type(font, { delay: 40 });
    await delay(3000);

    // Find and click the font result
    const fontResult = await findAndClickFont(page, font);
    if (!fontResult) {
      console.log(`  ✗ Font "${font}" not found in picker`);
      await page.screenshot({ path: `scripts/noresult22_${category.replace(/ /g, '_')}.png` });
      await page.keyboard.press('Escape');
      await delay(500);
      await clickDiscard(page);
      continue;
    }

    console.log(`  Clicking font: "${fontResult.text}" at (${fontResult.cx|0},${fontResult.cy|0})`);
    await page.mouse.move(fontResult.cx, fontResult.cy);
    await delay(200);
    await page.mouse.click(fontResult.cx, fontResult.cy);
    await delay(2000);

    // Check if picker is still open (may need to select variant)
    const pickerOpen = await page.evaluate(() => {
      return document.querySelectorAll('input[type="search"]').length > 0 &&
        [...document.querySelectorAll('input[type="search"]')].some(i => {
          const r = i.getBoundingClientRect();
          return r.width > 100;
        });
    });

    if (pickerOpen) {
      console.log('  Picker still open — selecting first variant...');
      await delay(1500);
      
      // The expand arrow was clicked, now find the font variant
      const variant = await page.evaluate((fontLower) => {
        const allEls = document.querySelectorAll('*');
        for (const el of allEls) {
          const r = el.getBoundingClientRect();
          if (r.x > 550 || r.y < 80 || r.y > 800 || r.width < 40 || r.height < 15 || r.height > 60) continue;
          const tc = el.textContent?.trim().toLowerCase() || '';
          if (!tc.includes(fontLower.split(' ')[0])) continue;
          const cs = window.getComputedStyle(el);
          if (cs.cursor === 'pointer' || el.tagName === 'BUTTON') {
            const isExpandArrow = el.textContent?.trim().length < 5; // not the ">" arrow
            if (!isExpandArrow) {
              return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, text: tc.substring(0, 40) };
            }
          }
        }
        return null;
      }, font.toLowerCase());

      if (variant) {
        console.log(`  Clicking variant: "${variant.text}" at (${variant.cx|0},${variant.cy|0})`);
        await page.mouse.click(variant.cx, variant.cy);
        await delay(2000);
      } else {
        console.log('  No variant found, trying first clickable in results...');
        // Just click the first item after the search input
        const firstItem = await page.evaluate(() => {
          const searchInputs = document.querySelectorAll('input[type="search"]');
          let searchY = 0;
          for (const inp of searchInputs) {
            const r = inp.getBoundingClientRect();
            if (r.width > 100) { searchY = r.y + r.height; break; }
          }
          // Find first clickable element below the search
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            const r = el.getBoundingClientRect();
            if (r.y < searchY + 20 || r.y > searchY + 200 || r.x > 500 || r.width < 50 || r.height < 15 || r.height > 60) continue;
            const cs = window.getComputedStyle(el);
            if (cs.cursor === 'pointer') {
              return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, text: el.textContent?.trim().substring(0, 40) };
            }
          }
          return null;
        });
        if (firstItem) {
          console.log(`  Clicking first item: "${firstItem.text}" at (${firstItem.cx|0},${firstItem.cy|0})`);
          await page.mouse.click(firstItem.cx, firstItem.cy);
          await delay(2000);
        }
      }
    }

    // Try to save
    const saved = await clickSave(page);
    if (saved) {
      successCount++;
      console.log(`  ✓ SAVED: ${category} → ${font}`);
    } else {
      console.log(`  ✗ Could not save (font possibly not selected)`);
      await page.screenshot({ path: `scripts/fail22_save_${category.replace(/ /g, '_')}.png` });
      await clickDiscard(page);
    }

    await delay(1000);
  }

  console.log(`\n\n${'='.repeat(50)}`);
  console.log(`  RESULT: ${successCount}/${FONT_CONFIG.length} fonts configured`);
  console.log(`${'='.repeat(50)}`);
  
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
