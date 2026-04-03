const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // ===== PART 1: Save Title (already has Bebas Neue selected) =====
  console.log('\n=== SAVING TITLE (Bebas Neue) ===');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(2000);

  // Discard any stale changes first
  for (let i = 0; i < 5; i++) {
    const d = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (!d) break;
    await page.mouse.click(d.x, d.y);
    await delay(1500);
  }

  // Expand Title
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Title') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 50) continue;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rr = el.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: rr.x + 40, clientY: rr.y + rr.height / 2, view: window };
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
      break;
    }
  });
  await delay(3000);

  // Check current state of Title
  let titleState = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')]
      .map(b => ({ label: b.getAttribute('aria-label'), text: b.textContent.substring(0, 40), y: Math.round(b.getBoundingClientRect().y) }))
      .filter(b => b.label && (b.label.includes('font') || b.label.includes('Font') || b.label.includes('Choose') || b.label.includes('Save') || b.label.includes('Discard') || b.label.includes('selected')));
    return btns;
  });
  console.log('Title buttons:', JSON.stringify(titleState));

  // Check if Title already has a font selected
  const titleHasFont = titleState.find(b => b.label.includes('selected'));
  if (titleHasFont) {
    console.log('Title already has font:', titleHasFont.label);
    // Click Save
    const saveBtn = titleState.find(b => b.label === 'Save');
    if (saveBtn) {
      await page.evaluate((y) => {
        for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
          const r = btn.getBoundingClientRect();
          if (Math.abs(r.y - y) < 20) { btn.click(); return; }
        }
      }, saveBtn.y);
      console.log('Title: Save clicked');
      await delay(3000);
    }
  } else {
    // Need to select font for Title
    console.log('Title needs font selection...');
    // Check if there's a "Choose a font" button with different label
    const chooseBtn = titleState.find(b => b.label === 'Choose a font');
    if (chooseBtn) {
      console.log('Found Choose a font button, selecting Bebas Neue...');
      // Open picker
      await page.evaluate((y) => {
        const btn = [...document.querySelectorAll('button[aria-label="Choose a font"]')]
          .find(b => Math.abs(b.getBoundingClientRect().y - y) < 20);
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
        btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      }, chooseBtn.y);
      await delay(2500);

      const searchInput = await page.evaluate(() => {
        for (const inp of document.querySelectorAll('input[type="search"]')) {
          const r = inp.getBoundingClientRect();
          if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
        return null;
      });

      if (searchInput) {
        await page.mouse.click(searchInput.x, searchInput.y);
        await delay(300);
        await page.keyboard.type('Bebas Neue', { delay: 25 });
        await delay(4000);

        const sel = await page.evaluate(() => {
          const img = [...document.querySelectorAll('img[title="Bebas Neue"]')]
            .find(i => i.getBoundingClientRect().width > 10 && i.getBoundingClientRect().y > 100);
          if (!img) return 'no img';
          let el = img;
          for (let d = 0; d < 12; d++) {
            const fk = Object.keys(el).find(k => k.startsWith('__reactFiber'));
            if (fk) {
              let fiber = el[fk];
              while (fiber) {
                if (fiber.memoizedProps?.onClick?.toString().includes('[native code]')) {
                  try { fiber.memoizedProps.onClick(); return 'selected'; } catch(e) {}
                }
                fiber = fiber.return;
              }
            }
            if (!el.parentElement) break;
            el = el.parentElement;
          }
          return 'no handler';
        });
        console.log('Title select result:', sel);
        await delay(3000);

        // Save
        await page.evaluate(() => {
          for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
            const r = btn.getBoundingClientRect();
            if (r.width > 10) { btn.click(); return; }
          }
        });
        console.log('Title: Save clicked');
        await delay(3000);
      }
    } else {
      console.log('Title: No font selection button found!');
    }
  }

  // ===== PART 2: Save Body (already has Space Grotesk selected) =====
  console.log('\n=== SAVING BODY (Space Grotesk) ===');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(2000);

  for (let i = 0; i < 5; i++) {
    const d = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (!d) break;
    await page.mouse.click(d.x, d.y);
    await delay(1500);
  }

  // Expand Body
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Body') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 50) continue;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rr = el.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: rr.x + 40, clientY: rr.y + rr.height / 2, view: window };
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
      break;
    }
  });
  await delay(3000);

  let bodyState = await page.evaluate(() => {
    return [...document.querySelectorAll('button')]
      .map(b => ({ label: b.getAttribute('aria-label'), text: b.textContent.substring(0, 40), y: Math.round(b.getBoundingClientRect().y) }))
      .filter(b => b.label && (b.label.includes('font') || b.label.includes('Font') || b.label.includes('Choose') || b.label.includes('Save') || b.label.includes('Discard') || b.label.includes('selected')));
  });
  console.log('Body buttons:', JSON.stringify(bodyState));

  const bodyHasFont = bodyState.find(b => b.label.includes('selected'));
  if (bodyHasFont) {
    console.log('Body already has font:', bodyHasFont.label);
    const saveBtn = bodyState.find(b => b.label === 'Save');
    if (saveBtn) {
      await page.evaluate((y) => {
        for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
          const r = btn.getBoundingClientRect();
          if (Math.abs(r.y - y) < 20) { btn.click(); return; }
        }
      }, saveBtn.y);
      console.log('Body: Save clicked');
      await delay(3000);
    }
  } else {
    // Need to select Space Grotesk for Body
    console.log('Body needs font selection...');
    const chooseBtn = bodyState.find(b => b.label === 'Choose a font');
    if (chooseBtn) {
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Choose a font"]');
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const cx = r.x + r.width / 2; const cy = r.y + r.height / 2;
        const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
        btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      });
      await delay(2500);
      const si = await page.evaluate(() => {
        for (const inp of document.querySelectorAll('input[type="search"]')) {
          const r = inp.getBoundingClientRect();
          if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
        return null;
      });
      if (si) {
        await page.mouse.click(si.x, si.y);
        await delay(300);
        await page.keyboard.type('Space Grotesk', { delay: 25 });
        await delay(4000);
        const sel = await page.evaluate(() => {
          const imgs = [...document.querySelectorAll('img[title]')]
            .filter(i => i.getBoundingClientRect().y > 100 && i.title.startsWith('Space Grotesk'));
          if (!imgs[0]) return 'no match';
          let el = imgs[0];
          for (let d = 0; d < 12; d++) {
            const fk = Object.keys(el).find(k => k.startsWith('__reactFiber'));
            if (fk) {
              let fiber = el[fk];
              while (fiber) {
                if (fiber.memoizedProps?.onClick?.toString().includes('[native code]')) {
                  try { fiber.memoizedProps.onClick(); return 'selected'; } catch(e) {}
                }
                fiber = fiber.return;
              }
            }
            if (!el.parentElement) break;
            el = el.parentElement;
          }
          return 'no handler';
        });
        console.log('Body select result:', sel);
        await delay(3000);
        await page.evaluate(() => {
          for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
            const r = btn.getBoundingClientRect();
            if (r.width > 10) { btn.click(); return; }
          }
        });
        console.log('Body: Save clicked');
        await delay(3000);
      }
    }
  }

  // ===== PART 3: Caption — try multiple monospace fonts =====
  console.log('\n=== CONFIGURING CAPTION (monospace font) ===');
  const monoFonts = ['Source Code Pro', 'Roboto Mono', 'Fira Mono', 'Space Mono', 'IBM Plex Mono', 'PT Mono', 'Ubuntu Mono', 'Courier Prime'];

  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(2000);

  for (let i = 0; i < 5; i++) {
    const d = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (!d) break;
    await page.mouse.click(d.x, d.y);
    await delay(1500);
  }

  // Expand Caption
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Caption') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.y < 50) continue;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rr = el.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: rr.x + 40, clientY: rr.y + rr.height / 2, view: window };
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
      break;
    }
  });
  await delay(3000);

  const captionBtn = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Choose a font"]');
    if (!btn) return null;
    btn.scrollIntoView({ behavior: 'instant', block: 'center' });
    const r = btn.getBoundingClientRect();
    return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  });

  if (!captionBtn) {
    console.log('Caption: No font button found');
  } else {
    let captionDone = false;
    for (const monoFont of monoFonts) {
      console.log(`  Trying "${monoFont}"...`);

      // Open picker
      await page.evaluate((cx, cy) => {
        const btn = document.querySelector('button[aria-label="Choose a font"]') ||
          document.querySelector('button[aria-label*="selected, Choose a font"]');
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const bcx = r.x + r.width / 2; const bcy = r.y + r.height / 2;
        const opts = { bubbles: true, cancelable: true, clientX: bcx, clientY: bcy, view: window };
        btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
        btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
        btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      }, captionBtn.cx, captionBtn.cy);
      await delay(2500);

      const si = await page.evaluate(() => {
        for (const inp of document.querySelectorAll('input[type="search"]')) {
          const r = inp.getBoundingClientRect();
          if (r.width > 50) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
        return null;
      });

      if (!si) { console.log('    Picker not open'); continue; }

      await page.mouse.click(si.x, si.y);
      await delay(200);
      // Clear and type
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
      await page.keyboard.type(monoFont, { delay: 25 });
      await delay(4000);

      // Check if font exists
      const found = await page.evaluate((fontName) => {
        const imgs = [...document.querySelectorAll('img[title]')]
          .filter(i => {
            const r = i.getBoundingClientRect();
            return r.width > 10 && r.y > 100 && r.y < 900;
          });
        const target = fontName.toLowerCase();
        const match = imgs.find(i => i.title.toLowerCase().includes(target) || i.title.toLowerCase().startsWith(target.split(' ')[0]));
        if (!match) return { found: false, available: imgs.map(i => i.title).slice(0, 5) };

        // Select via React fiber
        let el = match;
        for (let d = 0; d < 12; d++) {
          const fk = Object.keys(el).find(k => k.startsWith('__reactFiber'));
          if (fk) {
            let fiber = el[fk];
            while (fiber) {
              if (fiber.memoizedProps?.onClick?.toString().includes('[native code]')) {
                try { fiber.memoizedProps.onClick(); return { found: true, font: match.title }; } catch(e) {}
              }
              fiber = fiber.return;
            }
          }
          if (!el.parentElement) break;
          el = el.parentElement;
        }
        return { found: true, font: match.title, selected: false };
      }, monoFont);

      console.log(`    Result:`, JSON.stringify(found));

      if (found.found && found.font) {
        await delay(3000);
        // Save
        await page.evaluate(() => {
          for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
            const r = btn.getBoundingClientRect();
            if (r.width > 10) { btn.click(); return; }
          }
          // Also try text-based save
          for (const btn of document.querySelectorAll('button')) {
            if (btn.textContent.trim().toLowerCase() === 'save') { btn.click(); return; }
          }
        });
        console.log(`  ✓ Caption configured with: ${found.font}`);
        captionDone = true;
        await delay(2000);
        break;
      }
    }
    if (!captionDone) console.log('  ✗ No monospace font found in Canva');
  }

  // ===== FINAL: Check all fonts =====
  console.log('\n=== FINAL VERIFICATION ===');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(3000);

  const allFonts = await page.evaluate(() => {
    const results = [];
    const categories = ['Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];
    for (const cat of categories) {
      for (const span of document.querySelectorAll('span')) {
        const own = [...span.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own === cat) {
          const parent = span.parentElement;
          const text = parent ? parent.textContent.substring(0, 80) : '';
          results.push({ category: cat, text: text.trim() });
          break;
        }
      }
    }
    return results;
  });
  console.log('Font status:');
  for (const f of allFonts) {
    console.log(`  ${f.category}: ${f.text}`);
  }

  console.log('\nDONE');
  process.exit(0);
})();
