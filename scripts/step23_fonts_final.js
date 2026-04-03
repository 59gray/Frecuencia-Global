const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONT_CONFIG = [
  { category: 'Title',          font: 'Bebas Neue' },
  { category: 'Subtitle',       font: 'Space Grotesk' },
  { category: 'Heading',        font: 'Bebas Neue' },
  { category: 'Subheading',     font: 'Space Grotesk' },
  { category: 'Section header', font: 'Space Grotesk' },
  { category: 'Body',           font: 'Space Grotesk' },
  { category: 'Quote',          font: 'Space Grotesk' },
  { category: 'Caption',        font: 'JetBrains Mono' },
];

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

async function waitForFontsPage(page) {
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) { await delay(2000); return true; }
  }
  return false;
}

async function findCategorySpan(page, category) {
  return page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== cat) continue;
      const cs = window.getComputedStyle(el);
      if (cs.cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 100 || r.y > 1200) continue;
      return { x: r.x + 40, y: r.y + r.height / 2 };
    }
    return null;
  }, category);
}

async function scrollToCategoryIfNeeded(page, category) {
  // Reset scroll
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  
  let span = await findCategorySpan(page, category);
  if (span && span.y > 100 && span.y < 650) return span;
  
  // Scroll down in increments
  for (let scrollY = 200; scrollY <= 1000; scrollY += 200) {
    await page.evaluate(y => window.scrollTo(0, y), scrollY);
    await delay(500);
    span = await findCategorySpan(page, category);
    if (span && span.y > 100 && span.y < 650) return span;
  }
  return span;
}

async function discardIfOpen(page) {
  const disc = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      if ((btn.getAttribute('aria-label') || '') === 'Discard') {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
    }
    return null;
  });
  if (disc) {
    await page.mouse.click(disc.x, disc.y);
    await delay(1500);
  }
}

async function clickFontResult(page, fontName) {
  // Use textContent-based matching to find and click the font item
  const fontLower = fontName.toLowerCase();
  const firstWord = fontName.split(' ')[0].toLowerCase();
  
  return page.evaluate((fl, fw) => {
    const allEls = document.querySelectorAll('*');
    const candidates = [];
    
    for (const el of allEls) {
      const r = el.getBoundingClientRect();
      // Font picker is a dropdown, items should be in left portion, reasonable size
      if (r.x > 550 || r.y < 50 || r.y > 900 || r.width < 40 || r.height < 12 || r.height > 70) continue;
      if (el.tagName === 'INPUT') continue;
      // Skip very large containers
      if (r.width > 350 && r.height > 200) continue;
      
      const tc = (el.textContent || '').trim().toLowerCase();
      if (!tc.includes(fw)) continue;
      
      const cs = window.getComputedStyle(el);
      const isClickable = cs.cursor === 'pointer' || el.tagName === 'BUTTON';
      
      // Prefer exact text match, clickable, leaf elements
      let score = 0;
      if (tc === fl) score += 500;
      if (tc.startsWith(fl)) score += 300;
      if (tc.includes(fl) && tc.length < fl.length + 20) score += 200;
      if (isClickable) score += 150;
      if (el.children.length === 0) score += 50;
      if (el.children.length <= 2) score += 30;
      if (r.height > 50) score -= 30;
      if (r.width > 300) score -= 20;
      
      candidates.push({
        score, tag: el.tagName, text: tc.substring(0, 50),
        cx: r.x + r.width / 2, cy: r.y + r.height / 2,
        w: Math.round(r.width), h: Math.round(r.height),
        clickable: isClickable,
      });
    }
    
    candidates.sort((a, b) => b.score - a.score);
    return { best: candidates[0] || null, count: candidates.length, top3: candidates.slice(0, 3) };
  }, fontLower, firstWord);
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  let successCount = 0;

  for (const { category, font } of FONT_CONFIG) {
    console.log(`\n${'='.repeat(55)}`);
    console.log(`  ${category} → ${font}`);
    console.log(`${'='.repeat(55)}`);

    // Step 1: Navigate fresh
    const navOk = await waitForFontsPage(page);
    if (!navOk) { console.log('  ✗ Nav failed'); continue; }

    // Step 2: Find and scroll to category
    const span = await scrollToCategoryIfNeeded(page, category);
    if (!span) { console.log(`  ✗ "${category}" span not found`); continue; }
    console.log(`  Span at (${span.x|0}, ${span.y|0})`);

    // Step 3: DOUBLE-CLICK to expand the row
    await page.mouse.move(span.x, span.y);
    await delay(200);
    await page.mouse.click(span.x, span.y, { clickCount: 2 });
    await delay(2500);

    // Step 4: Find the font button ("Choose a font" or "Font: xxx")
    let fontBtn = null;
    for (let i = 0; i < 12; i++) {
      fontBtn = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button')) {
          const label = btn.getAttribute('aria-label') || '';
          if (label === 'Choose a font' || label.startsWith('Font:')) {
            const r = btn.getBoundingClientRect();
            if (r.width > 40 && r.y > 100 && r.y < 900) {
              return { label, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
            }
          }
        }
        return null;
      });
      if (fontBtn) break;
      await delay(500);
    }

    if (!fontBtn) {
      console.log('  ✗ Font button not found');
      await page.screenshot({ path: `scripts/fail_final_${category.replace(/ /g, '_')}.png` });
      await discardIfOpen(page);
      continue;
    }
    console.log(`  Font button: "${fontBtn.label}"`);

    // Check if already correct
    if (fontBtn.label.startsWith('Font:')) {
      const currentFont = fontBtn.label.replace('Font: ', '').toLowerCase();
      const wantedFont = font.toLowerCase();
      if (currentFont.includes(wantedFont.split(' ')[0])) {
        console.log(`  Already set to "${fontBtn.label}" — saving`);
        // Click save (checkmark)
        const saveBtn = await page.evaluate(() => {
          for (const btn of document.querySelectorAll('button')) {
            const label = btn.getAttribute('aria-label') || '';
            if (label.includes('Save') && !label.includes('Please select')) {
              const r = btn.getBoundingClientRect();
              if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            }
          }
          // Also look for checkmark button (✓) — it won't say "Save", look near discard
          for (const btn of document.querySelectorAll('button')) {
            const label = btn.getAttribute('aria-label') || '';
            if (label === 'Discard') {
              const r = btn.getBoundingClientRect();
              // Save button should be just to the left of Discard
              return { x: r.x - 30, y: r.y + r.height / 2, estimated: true };
            }
          }
          return null;
        });
        if (saveBtn) {
          await page.mouse.click(saveBtn.x, saveBtn.y);
          await delay(2000);
          successCount++;
          console.log('  ✓ SAVED (already correct)');
        }
        continue;
      }
    }

    // Step 5: Open font picker
    await page.mouse.click(fontBtn.cx, fontBtn.cy);
    await delay(2500);

    // Step 6: Find search input
    const searchInp = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 80) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      }
      return null;
    });

    if (!searchInp) {
      console.log('  ✗ Search input not found');
      await page.keyboard.press('Escape');
      await delay(500);
      await discardIfOpen(page);
      continue;
    }

    // Step 7: Type font name
    await page.mouse.click(searchInp.cx, searchInp.cy, { clickCount: 3 });
    await delay(200);
    await page.keyboard.type(font, { delay: 40 });
    await delay(3000);

    // Step 8: Find and click font result
    const result = await clickFontResult(page, font);
    if (result.top3.length > 0) {
      console.log('  Font candidates:');
      for (const c of result.top3) {
        console.log(`    score=${c.score} ${c.tag} click=${c.clickable} (${c.cx|0},${c.cy|0}) ${c.w}x${c.h} "${c.text}"`);
      }
    }

    if (!result.best) {
      console.log(`  ✗ No font result for "${font}"`);
      await page.screenshot({ path: `scripts/noresult_final_${category.replace(/ /g, '_')}.png` });
      await page.keyboard.press('Escape');
      await delay(500);
      await discardIfOpen(page);
      continue;
    }

    // Click the best result
    let clickX = result.best.cx, clickY = result.best.cy;
    
    // If it's not clickable, use elementFromPoint to find the clickable ancestor
    if (!result.best.clickable) {
      const clickable = await page.evaluate((x, y) => {
        let el = document.elementFromPoint(x, y);
        while (el) {
          const cs = window.getComputedStyle(el);
          if (cs.cursor === 'pointer') {
            const r = el.getBoundingClientRect();
            return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
          }
          el = el.parentElement;
        }
        return null;
      }, clickX, clickY);
      if (clickable) {
        clickX = clickable.cx;
        clickY = clickable.cy;
      }
    }

    console.log(`  Clicking font at (${clickX|0}, ${clickY|0})`);
    await page.mouse.click(clickX, clickY);
    await delay(2000);

    // Check if the picker closed and font was selected
    // The font button label should now say "Font: [selected font]" 
    const pickerStillOpen = await page.evaluate(() => {
      return [...document.querySelectorAll('input[type="search"]')].some(i => {
        const r = i.getBoundingClientRect();
        return r.width > 80 && r.y > 50;
      });
    });

    if (pickerStillOpen) {
      console.log('  Picker still open — might have clicked expand arrow. Trying again...');
      await delay(1000);
      
      // Re-search for the font with updated results (expanded variants might show)
      const result2 = await clickFontResult(page, font);
      if (result2.best) {
        let cx2 = result2.best.cx, cy2 = result2.best.cy;
        if (!result2.best.clickable) {
          const cl = await page.evaluate((x, y) => {
            let el = document.elementFromPoint(x, y);
            while (el) {
              if (window.getComputedStyle(el).cursor === 'pointer') {
                const r = el.getBoundingClientRect();
                return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
              }
              el = el.parentElement;
            }
            return null;
          }, cx2, cy2);
          if (cl) { cx2 = cl.cx; cy2 = cl.cy; }
        }
        console.log(`  Re-clicking at (${cx2|0}, ${cy2|0}) text="${result2.best.text}"`);
        await page.mouse.click(cx2, cy2);
        await delay(2000);
      }
    }

    // Step 9: Check save button state and click
    const saveResult = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        const label = btn.getAttribute('aria-label') || '';
        // "Please select a font before saving" means no font selected yet
        if (label === 'Please select a font before saving') {
          return { status: 'no-font-selected' };
        }
      }
      // Look for active save button (checkmark)
      for (const btn of btns) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Discard') {
          const r = btn.getBoundingClientRect();
          // Save is to the left of Discard, same row
          // Find previous sibling button
          const parent = btn.parentElement;
          if (parent) {
            for (const sib of parent.querySelectorAll('button')) {
              const sl = sib.getAttribute('aria-label') || '';
              if (sl !== 'Discard' && sl !== 'Delete') {
                const sr = sib.getBoundingClientRect();
                if (Math.abs(sr.y - r.y) < 20 && sr.x < r.x) {
                  return { status: 'save-available', x: sr.x + sr.width / 2, y: sr.y + sr.height / 2, label: sl };
                }
              }
            }
          }
          // Fallback: estimated position left of Discard
          return { status: 'save-estimated', x: r.x - 30, y: r.y + r.height / 2 };
        }
      }
      return { status: 'unknown' };
    });

    console.log(`  Save status: ${saveResult.status}`);
    
    if (saveResult.status === 'no-font-selected') {
      console.log('  ✗ Font was not selected');
      await page.screenshot({ path: `scripts/fail_final_nosel_${category.replace(/ /g, '_')}.png` });
      await discardIfOpen(page);
      continue;
    }

    if (saveResult.x) {
      await page.mouse.click(saveResult.x, saveResult.y);
      await delay(2000);
      successCount++;
      console.log(`  ✓ SAVED: ${category} → ${font}`);
    } else {
      console.log('  ✗ Save button not found');
      await discardIfOpen(page);
    }

    await delay(1000);
  }

  console.log(`\n${'='.repeat(55)}`);
  console.log(`  FINAL RESULT: ${successCount}/${FONT_CONFIG.length} fonts configured`);
  console.log(`${'='.repeat(55)}`);

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
