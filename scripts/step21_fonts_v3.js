const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Process ONE font at a time, reload page between each
const FONT_CONFIG = [
  { category: 'Subtitle',       font: 'Space Grotesk' },
  { category: 'Heading',        font: 'Bebas Neue' },
  { category: 'Subheading',     font: 'Space Grotesk' },
  { category: 'Section header', font: 'Space Grotesk' },
  { category: 'Body',           font: 'Space Grotesk' },
  { category: 'Quote',          font: 'Space Grotesk' },
  { category: 'Caption',        font: 'JetBrains Mono' },
];

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  let successCount = 0;

  for (const { category, font } of FONT_CONFIG) {
    console.log(`\n========== ${category} → ${font} ==========`);
    
    // Fresh navigation for EACH font to avoid dirty state
    await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(4000);

    // Step 1: Find the row for this category
    const rowInfo = await page.evaluate((category) => {
      const allSpans = document.querySelectorAll('span');
      for (const span of allSpans) {
        if (span.textContent.trim() === category) {
          const r = span.getBoundingClientRect();
          if (r.x > 250 && r.width > 50) {
            // Find clickable parent
            let p = span;
            while (p.parentElement) {
              p = p.parentElement;
              if (window.getComputedStyle(p).cursor === 'pointer') {
                const pr = p.getBoundingClientRect();
                return { cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2, text: span.textContent };
              }
            }
            return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, text: span.textContent };
          }
        }
      }
      return null;
    }, category);

    if (!rowInfo) {
      // Scroll down and try again
      await page.evaluate(() => window.scrollBy(0, 400));
      await delay(1000);
      const rowInfo2 = await page.evaluate((category) => {
        const allSpans = document.querySelectorAll('span');
        for (const span of allSpans) {
          if (span.textContent.trim() === category) {
            const r = span.getBoundingClientRect();
            if (r.x > 250) {
              let p = span;
              while (p.parentElement) {
                p = p.parentElement;
                if (window.getComputedStyle(p).cursor === 'pointer') {
                  const pr = p.getBoundingClientRect();
                  return { cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2 };
                }
              }
              return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
            }
          }
        }
        return null;
      }, category);
      if (!rowInfo2) {
        console.log(`  ✗ Row "${category}" not found even after scroll`);
        continue;
      }
      Object.assign(rowInfo || {}, rowInfo2);
    }

    console.log(`  Row found at (${Math.round(rowInfo.cx)}, ${Math.round(rowInfo.cy)})`);

    // Step 2: Click to expand the row
    await page.mouse.move(rowInfo.cx, rowInfo.cy);
    await delay(300);
    await page.mouse.click(rowInfo.cx, rowInfo.cy);
    await delay(2000);

    // Step 3: Find the "Choose a font" button (polls up to 6s)
    let fontBtn = null;
    for (let attempt = 0; attempt < 12; attempt++) {
      fontBtn = await page.evaluate(() => {
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
      if (fontBtn) break;
      await delay(500);
    }

    if (!fontBtn) {
      console.log(`  ✗ "Choose a font" button not found after 6s`);
      await page.screenshot({ path: `scripts/fail21_${category.replace(/ /g, '_')}.png` });
      continue;
    }

    // Check if already correct
    const alreadyCorrect = fontBtn.text && fontBtn.text.toLowerCase().includes(font.split(' ')[0].toLowerCase());
    if (alreadyCorrect) {
      console.log(`  ✓ Already set to "${fontBtn.text}" — saving`);
      // Click the save/checkmark button
      const saved = await clickSave(page);
      if (saved) successCount++;
      continue;
    }

    console.log(`  Current font: "${fontBtn.text}" — opening picker`);
    await page.mouse.click(fontBtn.cx, fontBtn.cy);
    await delay(2000);

    // Step 4: Find and click in the search input
    const searchInput = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 100 && r.y > 30) {
          return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
        }
      }
      return null;
    });

    if (!searchInput) {
      console.log(`  ✗ Search input not found`);
      await page.keyboard.press('Escape');
      await delay(500);
      continue;
    }

    await page.mouse.click(searchInput.cx, searchInput.cy, { clickCount: 3 });
    await delay(200);
    await page.keyboard.type(font, { delay: 50 });
    await delay(3000); // Wait for search results to load

    // Step 5: Find the font result using MULTIPLE strategies
    // Strategy A: Look for elements with textContent matching (case-insensitive)
    // Strategy B: Look for elements with role="option" 
    // Strategy C: Look for clickable elements inside the picker list
    const fontResult = await page.evaluate((fontName) => {
      const fontLower = fontName.toLowerCase();
      const firstWord = fontName.split(' ')[0].toLowerCase();
      
      // Collect ALL elements in the picker area that contain the font name
      const candidates = [];
      const allElements = document.querySelectorAll('*');
      
      for (const el of allElements) {
        const r = el.getBoundingClientRect();
        // Must be in the picker dropdown area (x < 550, y between 60 and 800)
        if (r.width < 30 || r.height < 10 || r.height > 100 || r.x > 550 || r.y < 60 || r.y > 800) continue;
        
        const tc = el.textContent?.toLowerCase() || '';
        if (!tc.includes(firstWord)) continue;
        
        // Check if this element's DIRECT textContent includes the font
        const ownText = [...el.childNodes]
          .filter(n => n.nodeType === 3)
          .map(n => n.textContent.trim())
          .join(' ')
          .toLowerCase();
        
        const isDirectMatch = ownText.includes(firstWord);
        const hasSmallChildren = el.children.length < 5;
        const cs = window.getComputedStyle(el);
        const isClickable = cs.cursor === 'pointer' || el.tagName === 'BUTTON' || el.getAttribute('role') === 'option';
        
        // Score: prefer direct text match, clickable, smaller elements (more specific)
        let score = 0;
        if (isDirectMatch) score += 100;
        if (isClickable) score += 50;
        if (hasSmallChildren) score += 20;
        if (el.children.length === 0) score += 30; // leaf node
        score -= r.height; // prefer smaller height (more specific)
        
        // Exact match bonus
        if (ownText.includes(fontLower) || tc.trim() === fontLower) score += 200;
        
        candidates.push({
          tag: el.tagName,
          role: el.getAttribute('role'),
          text: el.textContent?.trim().substring(0, 80),
          ownText: ownText.substring(0, 80),
          cx: r.x + r.width / 2,
          cy: r.y + r.height / 2,
          w: Math.round(r.width),
          h: Math.round(r.height),
          score,
          isClickable,
          cursor: cs.cursor,
        });
      }
      
      // Sort by score descending
      candidates.sort((a, b) => b.score - a.score);
      
      // Return top 10 for debugging + the best one
      return {
        best: candidates[0] || null,
        top10: candidates.slice(0, 10),
      };
    }, font);

    console.log(`  Search results (top matches):`);
    if (fontResult.top10.length === 0) {
      console.log(`    No elements found containing "${font}"`);
      await page.screenshot({ path: `scripts/noresult21_${category.replace(/ /g, '_')}.png` });
      await page.keyboard.press('Escape');
      await delay(500);
      await clickDiscard(page);
      continue;
    }

    for (const c of fontResult.top10.slice(0, 5)) {
      console.log(`    ${c.tag} score=${c.score} click=${c.isClickable} (${c.cx|0},${c.cy|0}) ${c.w}x${c.h} text="${c.text}" own="${c.ownText}"`);
    }

    // Click the best match
    const best = fontResult.best;
    if (!best) {
      console.log(`  ✗ No usable font result`);
      await page.keyboard.press('Escape');
      await delay(500);
      await clickDiscard(page);
      continue;
    }

    // If best has a parent with cursor:pointer, try to find and click it
    // Otherwise click the best element directly
    let clickTarget = best;
    
    // If the best element is NOT clickable, try to find its clickable parent
    if (!best.isClickable) {
      const clickableParent = await page.evaluate((cx, cy) => {
        const el = document.elementFromPoint(cx, cy);
        if (!el) return null;
        let p = el;
        while (p) {
          const cs = window.getComputedStyle(p);
          if (cs.cursor === 'pointer') {
            const r = p.getBoundingClientRect();
            return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, tag: p.tagName, w: r.width, h: r.height };
          }
          p = p.parentElement;
        }
        return null;
      }, best.cx, best.cy);
      
      if (clickableParent) {
        console.log(`  Using clickable parent: ${clickableParent.tag} (${clickableParent.cx|0},${clickableParent.cy|0})`);
        clickTarget = clickableParent;
      }
    }

    console.log(`  Clicking font result at (${clickTarget.cx|0}, ${clickTarget.cy|0})`);
    await page.mouse.move(clickTarget.cx, clickTarget.cy);
    await delay(200);
    await page.mouse.click(clickTarget.cx, clickTarget.cy);
    await delay(2000);

    // Check if the picker closed (font was selected) or if we need to pick a variant
    const pickerStillOpen = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 100 && r.y > 30) return true;
      }
      return false;
    });

    if (pickerStillOpen) {
      console.log(`  Picker still open — might need to select a variant`);
      // The ">" arrow was clicked, expanding the font family. Look for the first variant
      await delay(1000);
      
      // Try clicking the font name text directly (not the expand arrow)
      const variant = await page.evaluate((fontName) => {
        const firstWord = fontName.split(' ')[0].toLowerCase();
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const r = el.getBoundingClientRect();
          if (r.x > 550 || r.y < 60 || r.y > 800 || r.width < 50 || r.height < 15 || r.height > 60) continue;
          
          const tc = el.textContent?.trim().toLowerCase() || '';
          // Look for the exact font name (e.g., "Bebas Neue" or "Space Grotesk")
          // These might be weight variants like "Bebas Neue Regular", "Space Grotesk Light"
          if (!tc.includes(firstWord)) continue;
          
          const cs = window.getComputedStyle(el);
          if (cs.cursor === 'pointer' || el.tagName === 'BUTTON') {
            return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, text: tc, tag: el.tagName };
          }
        }
        return null;
      }, font);

      if (variant) {
        console.log(`  Clicking variant: "${variant.text}" at (${variant.cx|0},${variant.cy|0})`);
        await page.mouse.click(variant.cx, variant.cy);
        await delay(2000);
      }
    }

    // Step 6: Save the font selection
    const saved = await clickSave(page);
    if (saved) {
      successCount++;
      console.log(`  ✓ ${category} → ${font} SAVED`);
    } else {
      console.log(`  ✗ Could not save`);
      await clickDiscard(page);
    }

    await delay(1500);
  }

  console.log(`\n\n====== SUMMARY: ${successCount}/${FONT_CONFIG.length} fonts configured ======`);
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });

async function clickSave(page) {
  // Look for checkmark/save button near the expanded row
  for (let i = 0; i < 6; i++) {
    const saveBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        const r = btn.getBoundingClientRect();
        // Save button has a checkmark icon, x > 1200, small button
        if (r.x > 1200 && r.width > 20 && r.width < 80 && r.y > 200 && r.y < 1000) {
          // Exclude discard, delete buttons
          if (label.includes('Discard') || label.includes('Delete') || label.includes('delete')) continue;
          // The save button might say "Save" or have a check icon or no label
          // It should NOT say "Please select a font before saving"
          if (label.includes('Please select a font before saving')) continue;
          if (label.includes('Save') || label === '' || label.includes('Confirm') || label.includes('check')) {
            return { x: r.x + r.width / 2, y: r.y + r.height / 2, label, w: r.width };
          }
        }
      }
      return null;
    });
    
    if (saveBtn) {
      console.log(`  Save button: label="${saveBtn.label}" at (${saveBtn.x|0},${saveBtn.y|0})`);
      await page.mouse.click(saveBtn.x, saveBtn.y);
      await delay(2000);
      return true;
    }
    await delay(500);
  }
  
  // Fallback: try clicking the checkmark at approximate location (right side of expanded row)
  // From step19: checkmark was at x=1451, but this varies
  return false;
}

async function clickDiscard(page) {
  const discardBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
      const r = btn.getBoundingClientRect();
      if (r.width > 20) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (discardBtn) {
    await page.mouse.click(discardBtn.x, discardBtn.y);
    await delay(1500);
  }
}
