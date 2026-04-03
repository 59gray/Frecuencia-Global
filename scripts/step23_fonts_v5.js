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

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

async function navigateToFonts(page) {
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  // Poll until content appears (up to 20s)
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Subtitle') && text.includes('Heading');
    });
    if (ready) {
      console.log(`  Page ready after ${i + 1}s`);
      // Extra wait for rendering
      await delay(2000);
      return true;
    }
  }
  console.log('  Page not ready after 20s');
  return false;
}

async function findRow(page, category) {
  return page.evaluate((cat) => {
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      // Check own text nodes
      const ownText = [...el.childNodes]
        .filter(n => n.nodeType === 3)
        .map(n => n.textContent.trim())
        .join('')
        .trim();
      if (ownText !== cat) continue;
      
      const r = el.getBoundingClientRect();
      // Font labels are at x ≈ 130, visible area
      if (r.x < 70 || r.y < 100 || r.y > 1500 || r.width < 20) continue;
      
      // Find clickable parent with cursor:pointer
      let p = el;
      while (p.parentElement) {
        p = p.parentElement;
        const cs = window.getComputedStyle(p);
        if (cs.cursor === 'pointer') {
          const pr = p.getBoundingClientRect();
          return { cx: pr.x + pr.width / 2, cy: pr.y + pr.height / 2, w: pr.width, h: pr.height, method: 'pointer-parent' };
        }
      }
      
      // No cursor:pointer parent found - use the row visually
      // The row cards are full-width, click at center of estimated row
      return { cx: 400, cy: r.y + r.height / 2, w: 600, h: 56, method: 'estimated' };
    }
    return null;
  }, category);
}

async function scrollToRow(page, category) {
  // Try without scroll first
  let row = await findRow(page, category);
  if (row && row.cy > 100 && row.cy < 700) return row;
  
  // Scroll in increments
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  
  for (let scrollY = 0; scrollY <= 1200; scrollY += 200) {
    if (scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await delay(500);
    }
    row = await findRow(page, category);
    if (row && row.cy > 100 && row.cy < 700) return row;
  }
  
  return row; // Might still be usable even if out of ideal viewport
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
    
    // Fresh navigation
    const navOk = await navigateToFonts(page);
    if (!navOk) {
      console.log('  ✗ Navigation failed');
      continue;
    }

    // Find the row
    const row = await scrollToRow(page, category);
    if (!row) {
      console.log(`  ✗ Row "${category}" not found`);
      await page.screenshot({ path: `scripts/fail23_${category.replace(/ /g, '_')}.png` });
      continue;
    }

    console.log(`  Row at (${row.cx|0}, ${row.cy|0}) ${row.w|0}x${row.h|0} [${row.method}]`);
    
    // Click to expand
    await page.mouse.move(row.cx, row.cy);
    await delay(300);
    await page.mouse.click(row.cx, row.cy);
    await delay(3000);

    // Look for "Choose a font" or "Font:" button
    let fontBtn = null;
    for (let i = 0; i < 16; i++) {
      fontBtn = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button')) {
          const label = btn.getAttribute('aria-label') || '';
          if (label === 'Choose a font' || label.startsWith('Font:')) {
            const r = btn.getBoundingClientRect();
            if (r.width > 40 && r.y > 100 && r.y < 900) {
              return { 
                label, 
                text: btn.textContent?.trim().substring(0, 40),
                cx: r.x + r.width / 2, 
                cy: r.y + r.height / 2 
              };
            }
          }
        }
        return null;
      });
      if (fontBtn) break;
      await delay(500);
    }

    if (!fontBtn) {
      console.log(`  ✗ Font button not found after 8s`);
      await page.screenshot({ path: `scripts/fail23_btn_${category.replace(/ /g, '_')}.png` });
      // Try discarding
      const disc = await page.evaluate(() => {
        for (const b of document.querySelectorAll('button[aria-label="Discard"]')) {
          const r = b.getBoundingClientRect();
          if (r.width > 15) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
        return null;
      });
      if (disc) { await page.mouse.click(disc.x, disc.y); await delay(1500); }
      continue;
    }

    console.log(`  Font button: "${fontBtn.text}" [${fontBtn.label}]`);

    // Check if already correct
    if (fontBtn.text && fontBtn.text.toLowerCase().includes(font.split(' ')[0].toLowerCase())) {
      console.log(`  Already "${fontBtn.text}" — saving`);
      const saved = await doSave(page);
      if (saved) { successCount++; console.log('  ✓ SAVED'); }
      continue;
    }

    // Open font picker
    await page.mouse.click(fontBtn.cx, fontBtn.cy);
    await delay(2500);

    // Find search input
    const searchBox = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 80) return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      }
      return null;
    });

    if (!searchBox) {
      console.log('  ✗ Search input not found');
      await page.keyboard.press('Escape');
      await delay(500);
      await doDiscard(page);
      continue;
    }

    // Type font name
    await page.mouse.click(searchBox.cx, searchBox.cy, { clickCount: 3 });
    await delay(200);
    await page.keyboard.type(font, { delay: 40 });
    await delay(3000);

    // Find font result - use broad textContent matching
    const pickResult = await page.evaluate((fontName) => {
      const fl = fontName.toLowerCase();
      const firstWord = fontName.split(' ')[0].toLowerCase();
      
      // Gather all elements whose textContent contains the first word of the font
      const candidates = [];
      const allEls = document.querySelectorAll('*');
      
      for (const el of allEls) {
        const r = el.getBoundingClientRect();
        // Picker area: left side, reasonable size
        if (r.x > 600 || r.y < 50 || r.y > 900 || r.width < 30 || r.height < 10 || r.height > 100) continue;
        
        // Skip the input itself and very large containers
        if (el.tagName === 'INPUT') continue;
        if (r.width > 500 && r.height > 300) continue;
        
        const tc = (el.textContent || '').trim().toLowerCase();
        if (!tc.includes(firstWord)) continue;
        
        // Score this element
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').toLowerCase().trim();
        const cs = window.getComputedStyle(el);
        const isClickable = cs.cursor === 'pointer' || el.tagName === 'BUTTON';
        const childCount = el.children.length;
        
        let score = 0;
        // Exact text match
        if (ownText === fl || tc === fl) score += 300;
        // Starts with font name
        if (ownText.startsWith(fl) || tc.startsWith(fl)) score += 200;
        // Contains font name
        if (ownText.includes(fl)) score += 150;
        if (tc.includes(fl)) score += 50;
        // Clickable bonus
        if (isClickable) score += 100;
        // Leaf/small element bonus
        if (childCount === 0) score += 40;
        if (childCount <= 2) score += 20;
        // Penalize huge containers
        if (r.height > 50) score -= 30;
        if (r.width > 400) score -= 20;
        
        candidates.push({
          score, tag: el.tagName,
          text: tc.substring(0, 60), ownText: ownText.substring(0, 60),
          cx: r.x + r.width / 2, cy: r.y + r.height / 2,
          w: Math.round(r.width), h: Math.round(r.height),
          cursor: cs.cursor, clickable: isClickable,
        });
      }
      
      candidates.sort((a, b) => b.score - a.score);
      return { best: candidates[0] || null, top5: candidates.slice(0, 5) };
    }, font);

    if (pickResult.top5.length > 0) {
      console.log('  Font candidates:');
      for (const c of pickResult.top5) {
        console.log(`    score=${c.score} ${c.tag} click=${c.clickable} (${c.cx|0},${c.cy|0}) ${c.w}x${c.h} text="${c.text}" own="${c.ownText}"`);
      }
    }

    const best = pickResult.best;
    if (!best) {
      console.log(`  ✗ No font result for "${font}"`);
      await page.screenshot({ path: `scripts/noresult23_${category.replace(/ /g, '_')}.png` });
      await page.keyboard.press('Escape');
      await delay(500);
      await doDiscard(page);
      continue;
    }

    // If best is not clickable, find clickable parent via elementFromPoint
    let clickX = best.cx, clickY = best.cy;
    if (!best.clickable) {
      const parent = await page.evaluate((x, y) => {
        const el = document.elementFromPoint(x, y);
        if (!el) return null;
        let p = el;
        while (p) {
          if (window.getComputedStyle(p).cursor === 'pointer') {
            const r = p.getBoundingClientRect();
            return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
          }
          p = p.parentElement;
        }
        return null;
      }, clickX, clickY);
      if (parent) { clickX = parent.cx; clickY = parent.cy; }
    }

    console.log(`  Clicking font at (${clickX|0}, ${clickY|0})`);
    await page.mouse.move(clickX, clickY);
    await delay(200);
    await page.mouse.click(clickX, clickY);
    await delay(2500);

    // Check if picker is still open (might need to pick variant after expanding)
    const stillOpen = await page.evaluate(() => {
      return [...document.querySelectorAll('input[type="search"]')].some(i => {
        const r = i.getBoundingClientRect();
        return r.width > 80;
      });
    });

    if (stillOpen) {
      console.log('  Picker still open, looking for font variant to click...');
      await delay(1000);
      
      // Try clicking the first font item below the one we just clicked
      // (The expand arrow was clicked, showing variants like "Regular", "Bold", etc.)
      const variant = await page.evaluate((fontLower) => {
        const firstWord = fontLower.split(' ')[0];
        const allEls = document.querySelectorAll('*');
        const candidates = [];
        for (const el of allEls) {
          const r = el.getBoundingClientRect();
          if (r.x > 500 || r.y < 80 || r.y > 800 || r.width < 40 || r.height < 12 || r.height > 55) continue;
          const tc = (el.textContent || '').trim().toLowerCase();
          if (!tc.includes(firstWord)) continue;
          const cs = window.getComputedStyle(el);
          if (cs.cursor === 'pointer' || el.tagName === 'BUTTON') {
            candidates.push({
              cx: r.x + r.width / 2, cy: r.y + r.height / 2,
              text: tc.substring(0, 40), h: r.height,
            });
          }
        }
        // Sort by Y position, pick the first one that's probably a weight variant
        candidates.sort((a, b) => a.cy - b.cy);
        return candidates[0] || null;
      }, font.toLowerCase());

      if (variant) {
        console.log(`  Clicking variant: "${variant.text}" at (${variant.cx|0},${variant.cy|0})`);
        await page.mouse.click(variant.cx, variant.cy);
        await delay(2500);
      } else {
        // Maybe we can just click the first font result again more precisely
        console.log('  No variant found, trying Escape + re-select');
      }
    }

    // Save
    const saved = await doSave(page);
    if (saved) {
      successCount++;
      console.log(`  ✓ DONE: ${category} → ${font}`);
    } else {
      console.log(`  ✗ Save failed`);
      await page.screenshot({ path: `scripts/fail23_save_${category.replace(/ /g, '_')}.png` });
      await doDiscard(page);
    }

    await delay(1000);
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`  RESULT: ${successCount}/${FONT_CONFIG.length} fonts configured`);
  console.log(`${'='.repeat(50)}`);

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });

async function doSave(page) {
  for (let i = 0; i < 10; i++) {
    const btn = await page.evaluate(() => {
      for (const b of document.querySelectorAll('button')) {
        const label = b.getAttribute('aria-label') || '';
        const r = b.getBoundingClientRect();
        if (r.x < 500 || r.width > 100 || r.y < 100) continue;
        if (label.includes('Discard') || label.includes('Delete')) continue;
        if (label.includes('Please select a font before saving')) continue;
        if (label.includes('Please save/discard')) continue;
        // Small button on the right side
        if (r.width >= 15 && r.width <= 80 && r.height >= 15 && r.height <= 80) {
          return { x: r.x + r.width / 2, y: r.y + r.height / 2, label };
        }
      }
      return null;
    });
    if (btn) {
      await page.mouse.click(btn.x, btn.y);
      await delay(2000);
      return true;
    }
    await delay(500);
  }
  return false;
}

async function doDiscard(page) {
  const btn = await page.evaluate(() => {
    for (const b of document.querySelectorAll('button[aria-label="Discard"]')) {
      const r = b.getBoundingClientRect();
      if (r.width > 15) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (btn) { await page.mouse.click(btn.x, btn.y); await delay(1500); }
}
