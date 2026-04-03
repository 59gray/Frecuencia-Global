const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(3000);

  // Discard any pending
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

  // Expand Caption
  console.log('Expanding Caption...');
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

  // Open picker
  console.log('Opening picker...');
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Choose a font"]');
      if (!btn) return;
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
    });
    await delay(2500);
    const hasSearch = await page.evaluate(() => {
      for (const inp of document.querySelectorAll('input[type="search"]')) {
        if (inp.getBoundingClientRect().width > 50) return true;
      }
      return false;
    });
    if (hasSearch) break;
    console.log(`  Retry ${attempt + 1}...`);
    await delay(1000);
  }

  // Search for JetBrains Mono using nativeInputValueSetter
  console.log('Searching for JetBrains Mono...');
  await page.evaluate(() => {
    const inp = [...document.querySelectorAll('input[type="search"]')]
      .find(i => i.getBoundingClientRect().width > 50);
    if (!inp) return;
    inp.focus();
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inp, 'JetBrains Mono');
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await delay(3000);

  // Find and select JetBrains Mono
  const result = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img[title]')]
      .filter(i => { const r = i.getBoundingClientRect(); return r.width > 10 && r.y > 100 && r.y < 900; });
    const names = imgs.map(i => i.title);
    
    const target = imgs.find(i => i.title === 'JetBrains Mono');
    if (!target) return { ok: false, reason: 'not found', available: names };
    
    // Walk React fiber tree
    let el = target;
    for (let d = 0; d < 12; d++) {
      const fk = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      if (fk) {
        let fiber = el[fk];
        while (fiber) {
          if (fiber.memoizedProps?.onClick?.toString().includes('[native code]')) {
            try { 
              fiber.memoizedProps.onClick(); 
              return { ok: true, font: 'JetBrains Mono' }; 
            } catch(e) { 
              return { ok: false, reason: e.message }; 
            }
          }
          fiber = fiber.return;
        }
      }
      if (!el.parentElement) break;
      el = el.parentElement;
    }
    return { ok: false, reason: 'no handler', available: names };
  });

  console.log(`Selection: ${JSON.stringify(result)}`);

  if (result.ok) {
    await delay(2000);
    // Verify selection
    const label = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const l = btn.getAttribute('aria-label') || '';
        if (l.includes('selected') && l.includes('Choose a font')) return l;
      }
      return null;
    });
    console.log(`Button label: ${label}`);

    // Save
    const saved = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Save"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) { btn.click(); return true; }
      }
      return false;
    });
    console.log(`Saved: ${saved}`);
    await delay(3000);
  }

  // ===== FINAL VERIFICATION =====
  console.log('\n=== FINAL VERIFICATION ===');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'))) break;
  }
  await delay(3000);

  const categories = ['Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];

  for (const cat of categories) {
    // Expand
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
        break;
      }
    }, cat);
    await delay(2500);

    const fontState = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label.includes('selected') && label.includes('Choose a font')) {
          return label.split(' selected')[0];
        }
        if (label === 'Choose a font') return '(not set)';
      }
      return '(no button)';
    });
    console.log(`  ${cat}: ${fontState}`);

    // Discard/collapse
    await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) { btn.click(); return; }
      }
    });
    await delay(1500);
  }

  console.log('\nALL DONE');
  process.exit(0);
})();
