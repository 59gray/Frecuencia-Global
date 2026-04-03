const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com'));
  if (!page) { console.log('No Canva page'); process.exit(1); }
  await page.bringToFront();

  // Current URL and state
  console.log('Current URL:', page.url());
  
  // Screenshot BEFORE any action
  await page.screenshot({ path: 'scripts/debug_before.png' });
  
  // Navigate
  console.log('\nNavigating to fonts page...');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait generously
  console.log('Waiting 8 seconds...');
  await delay(8000);
  
  // Screenshot after load
  await page.screenshot({ path: 'scripts/debug_after_load.png' });
  console.log('URL after load:', page.url());
  
  // Check for dialogs
  const dialogBtns = await page.evaluate(() => {
    const btns = [];
    for (const b of document.querySelectorAll('button')) {
      const text = b.textContent?.trim();
      if (text && ['Leave', 'Discard', 'Stay', 'Cancel', 'OK', 'Save', 'Don\'t save'].includes(text)) {
        const r = b.getBoundingClientRect();
        btns.push({ text, x: r.x + r.width/2, y: r.y + r.height/2, w: r.width });
      }
    }
    return btns;
  });
  console.log('Dialog buttons:', dialogBtns);
  
  if (dialogBtns.length > 0) {
    // Click Leave/Discard
    const dismiss = dialogBtns.find(b => b.text === 'Leave' || b.text === 'Discard');
    if (dismiss) {
      console.log(`Clicking "${dismiss.text}"`);
      await page.mouse.click(dismiss.x, dismiss.y);
      await delay(5000);
      await page.screenshot({ path: 'scripts/debug_after_dismiss.png' });
    }
  }
  
  // Find Subtitle row
  const row = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (ownText === 'Subtitle' && el.tagName === 'SPAN') {
        const r = el.getBoundingClientRect();
        if (r.x > 300 && r.width > 100) {
          let p = el.parentElement;
          let parentInfo = null;
          while (p) {
            if (window.getComputedStyle(p).cursor === 'pointer') {
              const pr = p.getBoundingClientRect();
              parentInfo = { x: pr.x, y: pr.y, w: pr.width, h: pr.height, cx: pr.x + pr.width/2, cy: pr.y + pr.height/2 };
              break;
            }
            p = p.parentElement;
          }
          return { span: { x: r.x, y: r.y, w: r.width, h: r.height }, parent: parentInfo };
        }
      }
    }
    return null;
  });
  
  console.log('\nSubtitle row:', JSON.stringify(row));
  
  if (!row || !row.parent) { console.log('Row not found!'); process.exit(1); }
  
  // Click with a pause and logging
  const cx = row.parent.cx;
  const cy = row.parent.cy;
  console.log(`\nClicking center (${Math.round(cx)}, ${Math.round(cy)})`);
  
  // Use page.click with specific coordinates
  await page.mouse.move(cx, cy);
  await delay(500);
  await page.mouse.down();
  await delay(100);
  await page.mouse.up();
  await delay(3000);
  
  // Screenshot after click
  await page.screenshot({ path: 'scripts/debug_after_click.png' });
  
  // Check ALL buttons on the page 
  const allBtns = await page.evaluate(() => {
    const btns = [];
    for (const btn of document.querySelectorAll('button')) {
      const r = btn.getBoundingClientRect();
      const label = btn.getAttribute('aria-label') || '';
      if (r.width > 20 && r.height > 10) {
        btns.push({
          text: btn.textContent?.trim()?.substring(0, 30),
          label: label.substring(0, 40),
          x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        });
      }
    }
    return btns.sort((a, b) => a.y - b.y);
  });
  
  console.log('\nALL buttons after click (sorted by y):');
  allBtns.forEach(b => console.log(`  y=${b.y} x=${b.x} ${b.w}x${b.h} text="${b.text}" label="${b.label}"`));
  
  process.exit(0);
})();
