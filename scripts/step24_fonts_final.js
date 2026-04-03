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
    if (ready) { await delay(2500); return true; }
  }
  return false;
}

// Double-click a category row using JS dispatchEvent (works with React synthetic events)
async function dblClickCategory(page, category) {
  return page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== cat) continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 100 || r.y > 1500) continue;
      
      const opts = { bubbles: true, cancelable: true, clientX: r.x + 40, clientY: r.y + r.height / 2 };
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
      return true;
    }
    return false;
  }, category);
}

async function scrollToCategory(page, category) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  
  // Check if visible
  let found = await page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== cat) continue;
      const r = el.getBoundingClientRect();
      return r.y > 100 && r.y < 650;
    }
    return false;
  }, category);
  
  if (found) return true;
  
  for (let scrollY = 200; scrollY <= 1000; scrollY += 200) {
    await page.evaluate(y => window.scrollTo(0, y), scrollY);
    await delay(500);
    found = await page.evaluate((cat) => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== cat) continue;
        const r = el.getBoundingClientRect();
        return r.y > 100 && r.y < 650;
      }
      return false;
    }, category);
    if (found) return true;
  }
  return false;
}

async function discardIfOpen(page) {
  const disc = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
      const r = btn.getBoundingClientRect();
      if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (disc) {
    await page.mouse.click(disc.x, disc.y);
    await delay(2000);
  }
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

    // Step 2: Scroll to category if needed
    const inView = await scrollToCategory(page, category);
    if (!inView) { console.log(`  ✗ "${category}" not in view`); continue; }

    // Step 3: Double-click via JS dispatchEvent
    const clicked = await dblClickCategory(page, category);
    if (!clicked) { console.log('  ✗ dblclick dispatch failed'); continue; }
    await delay(3000);

    // Step 4: Find font button
    let fontBtn = null;
    for (let i = 0; i < 10; i++) {
      fontBtn = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button')) {
          const label = btn.getAttribute('aria-label') || '';
          if (label === 'Choose a font' || label.startsWith('Font:')) {
            const r = btn.getBoundingClientRect();
            if (r.width > 40 && r.y > 100 && r.y < 900)
              return { label, cx: r.x + r.width / 2, cy: r.y + r.height / 2, text: btn.textContent?.trim().substring(0, 40) };
          }
        }
        return null;
      });
      if (fontBtn) break;
      await delay(500);
    }

    if (!fontBtn) {
      console.log('  ✗ Font button not found');
      await page.screenshot({ path: `scripts/fail24_${category.replace(/ /g, '_')}.png` });
      await discardIfOpen(page);
      continue;
    }
    console.log(`  Font button: "${fontBtn.label}" text="${fontBtn.text}"`);

    // Check if already correct
    if (fontBtn.label.startsWith('Font:')) {
      const currentFont = fontBtn.label.replace('Font: ', '').toLowerCase();
      const wanted = font.split(' ')[0].toLowerCase();
      if (currentFont.includes(wanted)) {
        console.log(`  Already correct — saving`);
        // Find and click save (checkmark) button
        const saved = await clickSaveButton(page);
        if (saved) { successCount++; console.log('  ✓ SAVED (already correct)'); }
        else { console.log('  ✗ Save failed'); await discardIfOpen(page); }
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
    await delay(300);
    await page.keyboard.type(font, { delay: 40 });
    await delay(3000);

    // Step 8: Find and click font result
    const pickResult = await page.evaluate((fontName) => {
      const fl = fontName.toLowerCase();
      const fw = fontName.split(' ')[0].toLowerCase();
      const candidates = [];
      
      for (const el of document.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.x > 550 || r.y < 50 || r.y > 900 || r.width < 40 || r.height < 12 || r.height > 70) continue;
        if (el.tagName === 'INPUT') continue;
        if (r.width > 350 && r.height > 200) continue;
        
        const tc = (el.textContent || '').trim().toLowerCase();
        if (!tc.includes(fw)) continue;
        
        const cs = window.getComputedStyle(el);
        const isClickable = cs.cursor === 'pointer' || el.tagName === 'BUTTON';
        
        let score = 0;
        if (tc === fl) score += 500;
        if (tc.startsWith(fl) && tc.length < fl.length + 15) score += 350;
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
      return { best: candidates[0] || null, top3: candidates.slice(0, 3) };
    }, font);

    if (pickResult.top3.length > 0) {
      console.log('  Font candidates:');
      for (const c of pickResult.top3) {
        console.log(`    score=${c.score} ${c.tag} click=${c.clickable} (${c.cx|0},${c.cy|0}) ${c.w}x${c.h} "${c.text}"`);
      }
    }

    if (!pickResult.best) {
      console.log(`  ✗ No font result for "${font}"`);
      await page.screenshot({ path: `scripts/noresult24_${category.replace(/ /g, '_')}.png` });
      await page.keyboard.press('Escape');
      await delay(500);
      await discardIfOpen(page);
      continue;
    }

    // Click the best result - use elementFromPoint for precise clicking
    let clickX = pickResult.best.cx, clickY = pickResult.best.cy;
    if (!pickResult.best.clickable) {
      const clickable = await page.evaluate((x, y) => {
        let el = document.elementFromPoint(x, y);
        while (el) {
          if (window.getComputedStyle(el).cursor === 'pointer') {
            const r = el.getBoundingClientRect();
            return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
          }
          el = el.parentElement;
        }
        return null;
      }, clickX, clickY);
      if (clickable) { clickX = clickable.cx; clickY = clickable.cy; }
    }

    console.log(`  Clicking font at (${clickX|0}, ${clickY|0})`);
    await page.mouse.click(clickX, clickY);
    await delay(2000);

    // Check if picker is still open (might need second click for variant selection)
    const pickerOpen = await page.evaluate(() => {
      return [...document.querySelectorAll('input[type="search"]')].some(i => {
        const r = i.getBoundingClientRect();
        return r.width > 80 && r.y > 50;
      });
    });

    if (pickerOpen) {
      console.log('  Picker still open, re-searching for clickable font...');
      await delay(1500);
      // Re-search and click. The expanded section might show weight variants.
      const result2 = await page.evaluate((fontName) => {
        const fl = fontName.toLowerCase();
        const fw = fontName.split(' ')[0].toLowerCase();
        // Look for elements that contain the font name and are clickable
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.x > 550 || r.y < 50 || r.y > 900 || r.width < 40 || r.height < 12 || r.height > 55) continue;
          const tc = (el.textContent || '').trim().toLowerCase();
          if (!tc.includes(fw) || tc.length > fl.length + 25) continue;
          const cs = window.getComputedStyle(el);
          if (cs.cursor === 'pointer' || el.tagName === 'BUTTON') {
            return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, text: tc.substring(0, 50) };
          }
        }
        return null;
      }, font);
      
      if (result2) {
        console.log(`  Re-clicking: "${result2.text}" at (${result2.cx|0}, ${result2.cy|0})`);
        await page.mouse.click(result2.cx, result2.cy);
        await delay(2500);
      }
    }

    // Step 9: Save
    const saved = await clickSaveButton(page);
    if (saved) {
      successCount++;
      console.log(`  ✓ SAVED: ${category} → ${font}`);
    } else {
      console.log('  ✗ Save failed');
      await page.screenshot({ path: `scripts/fail24_save_${category.replace(/ /g, '_')}.png` });
      await discardIfOpen(page);
    }

    await delay(1000);
  }

  console.log(`\n${'='.repeat(55)}`);
  console.log(`  FINAL RESULT: ${successCount}/${FONT_CONFIG.length} fonts configured`);
  console.log(`${'='.repeat(55)}`);

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });

async function clickSaveButton(page) {
  // The save button is a checkmark (✓), to the left of "Discard"
  // It might have different aria-labels depending on state
  for (let attempt = 0; attempt < 8; attempt++) {
    const saveBtn = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      // First, check if "Please select a font before saving" exists (means font not selected)
      const disabled = btns.find(b => (b.getAttribute('aria-label') || '').includes('Please select a font before saving'));
      if (disabled) return { status: 'disabled' };
      
      // Find Discard button, then look for its sibling save button
      const discardBtn = btns.find(b => (b.getAttribute('aria-label') || '') === 'Discard');
      if (!discardBtn) return null;
      
      const dr = discardBtn.getBoundingClientRect();
      // Save button should be near Discard (same y, to the left)
      for (const btn of btns) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Discard' || label === 'Delete' || label.includes('Please select')) continue;
        const r = btn.getBoundingClientRect();
        if (Math.abs(r.y - dr.y) < 20 && r.x < dr.x && r.x > dr.x - 100 && r.width > 10) {
          return { status: 'found', x: r.x + r.width / 2, y: r.y + r.height / 2, label };
        }
      }
      
      // Fallback: estimated position left of Discard
      return { status: 'estimated', x: dr.x - 30, y: dr.y + dr.height / 2 };
    });

    if (!saveBtn) { await delay(500); continue; }
    if (saveBtn.status === 'disabled') { return false; }
    
    await page.mouse.click(saveBtn.x, saveBtn.y);
    await delay(2000);
    
    // Verify save happened (Discard button should be gone)
    const discardGone = await page.evaluate(() => {
      return !document.querySelector('button[aria-label="Discard"]');
    });
    if (discardGone) return true;
    
    // Might need another click
    await delay(500);
  }
  return false;
}
