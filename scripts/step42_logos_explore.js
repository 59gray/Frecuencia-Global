const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Try clicking "Brand Kit actions" button
  console.log('=== BRAND KIT ACTIONS ===');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Brand Kit actions"]');
    if (btn) btn.click();
  });
  await delay(2000);

  let menuItems = await page.evaluate(() => {
    return [...document.querySelectorAll('[role="menuitem"], [role="option"], [role="menu"] li, [role="listbox"] [role="option"]')]
      .filter(e => e.getBoundingClientRect().width > 30)
      .map(e => ({
        text: e.textContent.trim().substring(0, 50),
        label: e.getAttribute('aria-label') || '',
        tag: e.tagName
      }));
  });
  console.log('Menu items:', JSON.stringify(menuItems, null, 2));
  
  // Close menu
  await page.keyboard.press('Escape');
  await delay(500);

  // Check all "More" buttons - click each one and see what menu appears
  console.log('\n=== MORE BUTTONS ROWS ===');
  const moreButtons = await page.evaluate(() => {
    return [...document.querySelectorAll('button[aria-label="More"]')]
      .filter(b => b.getBoundingClientRect().width > 10)
      .map(b => {
        const r = b.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), left: Math.round(r.x) };
      })
      .sort((a, b) => a.y - b.y || a.x - b.x);
  });
  console.log(`Found ${moreButtons.length} More buttons`);

  // Categorize them by row
  const rows = {};
  moreButtons.forEach(b => {
    const rowKey = Math.round(b.y / 50) * 50;
    if (!rows[rowKey]) rows[rowKey] = [];
    rows[rowKey].push(b);
  });

  for (const [rowY, btns] of Object.entries(rows)) {
    console.log(`\nRow y~${rowY}: ${btns.length} buttons`);
    // Click the first button in each row to see what menu appears
    if (btns.length > 0) {
      // Click the leftmost button
      const leftmost = btns.sort((a, b) => a.x - b.x)[0];
      await page.mouse.click(leftmost.x, leftmost.y);
      await delay(1500);
      
      const items = await page.evaluate(() => {
        return [...document.querySelectorAll('[role="menuitem"], [role="menu"] button, [role="menu"] [role="option"]')]
          .filter(e => e.getBoundingClientRect().width > 30)
          .map(e => e.textContent.trim().substring(0, 50));
      });
      console.log(`  Menu: ${items.join(', ') || '(empty)'}`);
      
      await page.keyboard.press('Escape');
      await delay(500);
    }
  }

  // Let me also scroll ALL the way down and look for upload buttons
  console.log('\n=== SCROLLING PAGE ===');
  const scrollContent = await page.evaluate(async () => {
    const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
    let scrollEl = main;
    // Find scrollable element
    const elems = document.querySelectorAll('*');
    for (const el of elems) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 200 && el.scrollHeight - el.clientHeight > 100) {
        if (el.getBoundingClientRect().x > 60) {
          scrollEl = el;
          break;
        }
      }
    }
    
    const texts = new Set();
    for (let i = 0; i < 10; i++) {
      for (const el of document.querySelectorAll('p, span, h3, h4, button')) {
        const text = el.textContent.trim();
        const r = el.getBoundingClientRect();
        if (text && r.width > 10 && r.y > 50 && r.y < 900 && r.x > 60) {
          texts.add(`y=${Math.round(r.y)}: ${text.substring(0, 50)}`);
        }
      }
      scrollEl.scrollTop += 300;
      await new Promise(r => setTimeout(r, 300));
    }
    
    return [...texts].sort();
  });
  scrollContent.forEach(t => console.log(`  ${t}`));

  // Look specifically for any file input (hidden or not)
  console.log('\n=== ALL FILE INPUTS ===');
  const fileInputs = await page.evaluate(() => {
    return [...document.querySelectorAll('input[type="file"]')].map(inp => ({
      accept: inp.accept,
      name: inp.name,
      id: inp.id,
      display: window.getComputedStyle(inp).display,
      visibility: window.getComputedStyle(inp).visibility,
      classes: inp.className?.substring(0, 50) || ''
    }));
  });
  console.log(JSON.stringify(fileInputs, null, 2));

  process.exit(0);
})();
