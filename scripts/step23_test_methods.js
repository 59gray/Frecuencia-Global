const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  console.log('Navigating to fonts page...');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) { console.log(`Content ready after ${i + 1}s`); await delay(3000); break; }
  }

  // Method 1: JS dispatchEvent dblclick on the Subtitle SPAN element
  console.log('\n=== Method 1: JS dispatchEvent dblclick on SPAN ===');
  const method1 = await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Subtitle') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      
      // Dispatch mousedown, mouseup, click, mousedown, mouseup, click, dblclick
      const opts = { bubbles: true, cancelable: true, clientX: r.x + 40, clientY: r.y + r.height / 2 };
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
      el.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
      el.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
      return 'dispatched';
    }
    return 'not found';
  });
  console.log(`  Result: ${method1}`);
  await delay(3000);

  let fontBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font:')) return label;
    }
    return null;
  });
  console.log(`  fontBtn = ${fontBtn || 'null'}`);
  await page.screenshot({ path: 'scripts/diag23_method1.png' });

  if (!fontBtn) {
    // Method 2: Try on the parent DIV with cursor:pointer
    console.log('\n=== Method 2: JS dblclick on parent DIV ===');
    await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    for (let i = 0; i < 20; i++) {
      await delay(1000);
      const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
      if (ready) { await delay(3000); break; }
    }

    const method2 = await page.evaluate(() => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== 'Subtitle') continue;
        if (window.getComputedStyle(el).cursor !== 'pointer') continue;
        
        // Find cursor:pointer parent DIV
        let target = el.parentElement;
        while (target && window.getComputedStyle(target).cursor !== 'pointer') {
          target = target.parentElement;
        }
        if (!target) target = el; // fallback to span
        
        const r = target.getBoundingClientRect();
        const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 };
        target.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 1 }));
        target.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 1 }));
        target.dispatchEvent(new MouseEvent('click', { ...opts, detail: 1 }));
        target.dispatchEvent(new MouseEvent('mousedown', { ...opts, detail: 2 }));
        target.dispatchEvent(new MouseEvent('mouseup', { ...opts, detail: 2 }));
        target.dispatchEvent(new MouseEvent('click', { ...opts, detail: 2 }));
        target.dispatchEvent(new MouseEvent('dblclick', { ...opts, detail: 2 }));
        return `dispatched on ${target.tagName} (${Math.round(r.x)}, ${Math.round(r.y)}) ${Math.round(r.width)}x${Math.round(r.height)}`;
      }
      return 'not found';
    });
    console.log(`  Result: ${method2}`);
    await delay(3000);

    fontBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Choose a font' || label.startsWith('Font:')) return label;
      }
      return null;
    });
    console.log(`  fontBtn = ${fontBtn || 'null'}`);
    await page.screenshot({ path: 'scripts/diag23_method2.png' });
  }

  if (!fontBtn) {
    // Method 3: page.click on the element directly using selector
    console.log('\n=== Method 3: page.click + Puppeteer element handle ===');
    await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    for (let i = 0; i < 20; i++) {
      await delay(1000);
      const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
      if (ready) { await delay(3000); break; }
    }

    // Find the element handle
    const elementHandle = await page.evaluateHandle(() => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== 'Subtitle') continue;
        if (window.getComputedStyle(el).cursor !== 'pointer') continue;
        return el;
      }
      return null;
    });

    if (elementHandle) {
      console.log('  Clicking element handle with clickCount: 2');
      await elementHandle.click({ clickCount: 2 });
      await delay(3000);

      fontBtn = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button')) {
          const label = btn.getAttribute('aria-label') || '';
          if (label === 'Choose a font' || label.startsWith('Font:')) return label;
        }
        return null;
      });
      console.log(`  fontBtn = ${fontBtn || 'null'}`);
      await page.screenshot({ path: 'scripts/diag23_method3.png' });
    }
  }

  if (!fontBtn) {
    // Method 4: Single click first, wait, see what happens
    console.log('\n=== Method 4: Single click on Subtitle, then check ===');
    await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    for (let i = 0; i < 20; i++) {
      await delay(1000);
      const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
      if (ready) { await delay(3000); break; }
    }

    const span4 = await page.evaluate(() => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== 'Subtitle') continue;
        if (window.getComputedStyle(el).cursor !== 'pointer') continue;
        const r = el.getBoundingClientRect();
        return { x: r.x + 40, y: r.y + r.height / 2 };
      }
      return null;
    });

    console.log(`  Single click at (${span4.x|0}, ${span4.y|0})`);
    await page.mouse.click(span4.x, span4.y);
    await delay(4000);
    await page.screenshot({ path: 'scripts/diag23_method4_after_single.png' });

    // Check all buttons
    const allBtns = await page.evaluate(() => {
      return [...document.querySelectorAll('button')].map(b => {
        const r = b.getBoundingClientRect();
        return {
          label: (b.getAttribute('aria-label') || '').substring(0, 60),
          x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width),
        };
      }).filter(b => b.w > 10 && b.y > 100 && b.y < 900);
    });
    console.log('  Buttons after single click:');
    for (const b of allBtns) console.log(`    (${b.x},${b.y}) w=${b.w} "${b.label}"`);
    
    // Check URL
    console.log(`  URL: ${page.url()}`);
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
