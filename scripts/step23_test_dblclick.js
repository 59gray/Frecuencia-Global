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

  // Find Title span position dynamically
  const titleSpan = await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Title') continue;
      if (window.getComputedStyle(el).cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      return { x: r.x + 40, y: r.y + r.height / 2, rx: Math.round(r.x), ry: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    }
    return null;
  });

  console.log(`Title span: ${JSON.stringify(titleSpan)}`);

  // TEST A: Direct double-click without move (same pattern as working test)
  console.log('\n=== TEST A: Direct double-click at Title position ===');
  await page.mouse.click(titleSpan.x, titleSpan.y, { clickCount: 2 });
  await delay(3000);

  let fontBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label === 'Choose a font' || label.startsWith('Font:')) {
        return label;
      }
    }
    return null;
  });
  console.log(`Test A result: fontBtn = ${fontBtn}`);
  if (fontBtn) {
    await page.screenshot({ path: 'scripts/diag23_testA_success.png' });
    console.log('TEST A SUCCEEDED!');
    // Discard and continue
    const disc = await page.evaluate(() => {
      for (const b of document.querySelectorAll('button[aria-label="Discard"]')) {
        const r = b.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });
    if (disc) { await page.mouse.click(disc.x, disc.y); await delay(2000); }
  } else {
    // Try TEST B: two separate clicks
    console.log('\n=== TEST B: Two separate clicks with 200ms gap ===');
    await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    for (let i = 0; i < 20; i++) {
      await delay(1000);
      const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
      if (ready) { await delay(3000); break; }
    }

    const span2 = await page.evaluate(() => {
      for (const el of document.querySelectorAll('span')) {
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (own !== 'Title') continue;
        if (window.getComputedStyle(el).cursor !== 'pointer') continue;
        const r = el.getBoundingClientRect();
        return { x: r.x + 40, y: r.y + r.height / 2 };
      }
      return null;
    });

    await page.mouse.click(span2.x, span2.y);
    await delay(200);
    await page.mouse.click(span2.x, span2.y);
    await delay(3000);

    fontBtn = await page.evaluate(() => {
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Choose a font' || label.startsWith('Font:')) return label;
      }
      return null;
    });
    console.log(`Test B result: fontBtn = ${fontBtn}`);
    await page.screenshot({ path: 'scripts/diag23_testB.png' });

    if (!fontBtn) {
      // TEST C: CDP dispatchEvent
      console.log('\n=== TEST C: CDP Input.dispatchMouseEvent double-click ===');
      await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
      for (let i = 0; i < 20; i++) {
        await delay(1000);
        const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
        if (ready) { await delay(3000); break; }
      }

      const span3 = await page.evaluate(() => {
        for (const el of document.querySelectorAll('span')) {
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
          if (own !== 'Title') continue;
          if (window.getComputedStyle(el).cursor !== 'pointer') continue;
          const r = el.getBoundingClientRect();
          return { x: r.x + 40, y: r.y + r.height / 2 };
        }
        return null;
      });

      const cdp = await page.target().createCDPSession();
      const x = span3.x, y = span3.y;
      // Simulate double-click via CDP
      await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
      await delay(100);
      await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 2 });
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 2 });
      await delay(3000);

      fontBtn = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button')) {
          const label = btn.getAttribute('aria-label') || '';
          if (label === 'Choose a font' || label.startsWith('Font:')) return label;
        }
        return null;
      });
      console.log(`Test C result: fontBtn = ${fontBtn}`);
      await page.screenshot({ path: 'scripts/diag23_testC.png' });
    }
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
