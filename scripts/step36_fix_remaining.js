const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

async function expandCategory(page, catName) {
  await page.evaluate((cat) => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== cat) continue;
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
      return true;
    }
    return false;
  }, catName);
  await delay(3000);
}

async function openPicker(page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const opened = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Choose a font"]');
      if (!btn) return 'no_button';
      btn.scrollIntoView({ behavior: 'instant', block: 'center' });
      const r = btn.getBoundingClientRect();
      const cx = r.x + r.width / 2; const cy = r.y + r.height / 2;
      const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window };
      btn.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      btn.dispatchEvent(new PointerEvent('click', { ...opts, pointerId: 1 }));
      btn.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      return 'dispatched';
    });
    if (opened === 'no_button') return false;
    await delay(2500);
    const hasSearch = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        if (inp.getBoundingClientRect().width > 50) return true;
      }
      return false;
    });
    if (hasSearch) return true;
    console.log(`  Picker retry ${attempt + 1}...`);
    await delay(1000);
  }
  return false;
}

async function searchAndSelectFont(page, fontName) {
  // Focus and type into search using evaluate to set value directly + trigger React events
  await page.evaluate((name) => {
    const inp = [...document.querySelectorAll('input[type="search"]')]
      .find(i => i.getBoundingClientRect().width > 50);
    if (!inp) return;
    // Focus
    inp.focus();
    inp.click();
    // Clear current value
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inp, name);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, fontName);
  await delay(3000);

  // Get results
  const fonts = await page.evaluate(() => {
    return [...document.querySelectorAll('img[title]')]
      .filter(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100 && r.y < 900; })
      .map(i => i.title);
  });
  console.log(`  Search results: ${fonts.join(', ')}`);

  // Look for the desired font
  const match = fonts.find(f => f.toLowerCase() === fontName.toLowerCase());
  if (!match) {
    // Try partial match
    const partial = fonts.find(f => f.toLowerCase().includes(fontName.toLowerCase()));
    if (!partial) return { found: false, fonts };
    return await selectFontByTitle(page, partial);
  }
  return await selectFontByTitle(page, match);
}

async function selectFontByTitle(page, fontTitle) {
  const result = await page.evaluate((fontTitle) => {
    const img = [...document.querySelectorAll(`img[title="${fontTitle}"]`)]
      .find(i => i.getBoundingClientRect().width > 10 && i.getBoundingClientRect().y > 100);
    if (!img) return { ok: false, reason: 'no img' };
    let el = img;
    for (let d = 0; d < 12; d++) {
      const fk = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      if (fk) {
        let fiber = el[fk];
        while (fiber) {
          if (fiber.memoizedProps?.onClick?.toString().includes('[native code]')) {
            try { fiber.memoizedProps.onClick(); return { ok: true, font: fontTitle }; } catch(e) { return { ok: false, reason: e.message }; }
          }
          fiber = fiber.return;
        }
      }
      if (!el.parentElement) break;
      el = el.parentElement;
    }
    return { ok: false, reason: 'no handler found' };
  }, fontTitle);
  return result;
}

async function saveFont(page) {
  await delay(2000);
  const saved = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
      const r = btn.getBoundingClientRect();
      if (r.width > 10) { btn.click(); return true; }
    }
    return false;
  });
  await delay(2000);
  return saved;
}

async function discardIfNeeded(page) {
  for (let i = 0; i < 3; i++) {
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
}

async function configureFont(page, catName, fontName) {
  console.log(`\nConfiguring ${catName} → ${fontName}`);
  
  await expandCategory(page, catName);
  
  // Check if already configured
  const currentFont = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label.includes('selected') && label.includes('Choose a font')) {
        return label.split(' selected')[0];
      }
    }
    return null;
  });
  
  if (currentFont && currentFont.toLowerCase() === fontName.toLowerCase()) {
    console.log(`  Already set to ${currentFont} ✓`);
    await discardIfNeeded(page);
    return true;
  }
  
  if (currentFont) {
    console.log(`  Currently: ${currentFont}, changing...`);
  }
  
  const pickerOpen = await openPicker(page);
  if (!pickerOpen) {
    console.log(`  ✗ Could not open picker`);
    await discardIfNeeded(page);
    return false;
  }
  
  const result = await searchAndSelectFont(page, fontName);
  if (result.ok) {
    console.log(`  Selected: ${result.font}`);
    const saved = await saveFont(page);
    console.log(`  ${saved ? '✓ Saved' : '✗ Save failed'}`);
    return saved;
  } else {
    console.log(`  ✗ Font not found: ${result.reason || 'not in list'}`);
    await discardIfNeeded(page);
    return false;
  }
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate to fonts page fresh
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(3000);
  await discardIfNeeded(page);

  // Re-configure Section header and Quote
  await configureFont(page, 'Section header', 'Space Grotesk');
  
  // Reload between categories to avoid stale state
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(3000);
  await discardIfNeeded(page);
  
  await configureFont(page, 'Quote', 'Space Grotesk');

  // Reload for Caption
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(3000);
  await discardIfNeeded(page);

  // ===== CAPTION: Scroll through full font list to find monospace =====
  console.log('\n=== CAPTION: Looking for monospace font ===');
  await expandCategory(page, 'Caption');
  const pickerOpen = await openPicker(page);
  
  if (pickerOpen) {
    // First, let's see what the search input actually does
    // Try React-level input update
    console.log('  Trying React nativeInputValueSetter...');
    await page.evaluate(() => {
      const inp = [...document.querySelectorAll('input[type="search"]')]
        .find(i => i.getBoundingClientRect().width > 50);
      if (!inp) return;
      inp.focus();
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(inp, 'mono');
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await delay(3000);
    
    let fonts = await page.evaluate(() => {
      return [...document.querySelectorAll('img[title]')]
        .filter(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100 && r.y < 900; })
        .map(i => i.title);
    });
    console.log(`  After nativeInputValueSetter: ${fonts.join(', ')}`);

    // Also try keyboard typing directly with page.type
    console.log('  Trying page.type approach...');
    const searchBox = await page.$('input[type="search"]');
    if (searchBox) {
      await searchBox.click({ clickCount: 3 });
      await delay(200);
      await searchBox.type('mono', { delay: 100 });
      await delay(3000);
      
      fonts = await page.evaluate(() => {
        return [...document.querySelectorAll('img[title]')]
          .filter(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100 && r.y < 900; })
          .map(i => i.title);
      });
      console.log(`  After page.type "mono": ${fonts.join(', ')}`);

      // Check input value
      const inputVal = await page.evaluate(() => {
        const inp = [...document.querySelectorAll('input[type="search"]')]
          .find(i => i.getBoundingClientRect().width > 50);
        return inp ? { value: inp.value, placeholder: inp.placeholder } : null;
      });
      console.log(`  Input state: ${JSON.stringify(inputVal)}`);
    }
    
    // Now try scrolling the font list to find monospace fonts
    console.log('  Scrolling through font list...');
    const allFonts = await page.evaluate(async () => {
      // Find the scrollable container of the font list
      const treeItems = document.querySelectorAll('[role="treeitem"]');
      if (treeItems.length === 0) return { method: 'no_treeitems' };
      
      // Find the scrollable parent
      let scrollContainer = treeItems[0].parentElement;
      while (scrollContainer && scrollContainer.scrollHeight <= scrollContainer.clientHeight) {
        scrollContainer = scrollContainer.parentElement;
      }
      if (!scrollContainer) return { method: 'no_scroll_container' };
      
      const fonts = new Set();
      // Scroll through and collect all font names
      for (let i = 0; i < 30; i++) {
        for (const img of document.querySelectorAll('img[title]')) {
          const r = img.getBoundingClientRect();
          if (r.width > 10 && r.y > 100) fonts.add(img.title);
        }
        scrollContainer.scrollTop += 500;
        await new Promise(r => setTimeout(r, 300));
      }
      
      return { 
        method: 'scrolled',
        total: fonts.size,
        all: [...fonts],
        mono: [...fonts].filter(f => {
          const fl = f.toLowerCase();
          return fl.includes('mono') || fl.includes('courier') || fl.includes('code') || 
                 fl.includes('consol') || fl.includes('fixed') || fl.includes('terminal');
        })
      };
    });
    
    console.log(`  Total fonts found: ${allFonts.total || 0}`);
    console.log(`  Method: ${allFonts.method}`);
    if (allFonts.mono && allFonts.mono.length > 0) {
      console.log(`  Monospace fonts: ${allFonts.mono.join(', ')}`);
    } else {
      console.log(`  No monospace fonts found`);
      // List some of the fonts as sample
      if (allFonts.all) {
        console.log(`  Sample: ${allFonts.all.slice(0, 30).join(', ')}`);
      }
    }

    // Also check for "Upload a font" button
    const uploadInfo = await page.evaluate(() => {
      const btns = [];
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        const text = btn.textContent || '';
        if (label.includes('upload') || label.includes('Upload') || 
            text.includes('Upload') || text.includes('upload') ||
            label.includes('Manage') || text.includes('Manage')) {
          btns.push({ label, text: text.substring(0, 50), rect: btn.getBoundingClientRect() });
        }
      }
      return btns;
    });
    console.log(`  Upload/Manage buttons: ${JSON.stringify(uploadInfo)}`);
  }

  await discardIfNeeded(page);
  console.log('\nDONE');
  process.exit(0);
})();
