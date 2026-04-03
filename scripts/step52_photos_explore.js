const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Go to Photos ingredient page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  console.log('=== PHOTOS PAGE ===');
  console.log('URL:', page.url());

  // First, try clicking "Manage category" button to see menu options
  console.log('\n--- Clicking "Manage category" ---');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => 
      b.getAttribute('aria-label') === 'Manage category'
    );
    if (btn) {
      const r = btn.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
      btn.dispatchEvent(new PointerEvent('pointerdown', opts));
      btn.dispatchEvent(new MouseEvent('mousedown', opts));
      btn.dispatchEvent(new PointerEvent('pointerup', opts));
      btn.dispatchEvent(new MouseEvent('mouseup', opts));
      btn.dispatchEvent(new MouseEvent('click', opts));
    }
  });
  await delay(2000);

  // Check what appeared
  let menuItems = await page.evaluate(() => {
    const menus = [...document.querySelectorAll('[role="menu"], [role="listbox"], [role="dialog"], [role="tooltip"]')];
    const results = [];
    for (const menu of menus) {
      const items = [...menu.querySelectorAll('[role="menuitem"], [role="option"], button, a, li, div')].map(i => ({
        tag: i.tagName,
        role: i.getAttribute('role'),
        text: i.textContent.trim().substring(0, 60),
        y: Math.round(i.getBoundingClientRect().y)
      })).filter(i => i.text.length > 1 && i.text.length < 60);
      results.push({ items });
    }
    // Also check for any new popover/dropdown
    const popover = document.querySelector('[data-radix-popper-content-wrapper], [class*="popover"], [class*="dropdown"], [class*="menu"]');
    if (popover) {
      results.push({
        popoverText: popover.textContent.trim().substring(0, 300)
      });
    }
    return results;
  });
  console.log('Menu results:', JSON.stringify(menuItems, null, 2));

  // Close any menu by pressing Escape
  await page.keyboard.press('Escape');
  await delay(1000);

  // Now try "Add to category" button
  console.log('\n--- Clicking "Add to category" ---');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => 
      b.getAttribute('aria-label') === 'Add to category'
    );
    if (btn) {
      const r = btn.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
      btn.dispatchEvent(new PointerEvent('pointerdown', opts));
      btn.dispatchEvent(new MouseEvent('mousedown', opts));
      btn.dispatchEvent(new PointerEvent('pointerup', opts));
      btn.dispatchEvent(new MouseEvent('mouseup', opts));
      btn.dispatchEvent(new MouseEvent('click', opts));
    }
  });
  await delay(2000);

  menuItems = await page.evaluate(() => {
    const menus = [...document.querySelectorAll('[role="menu"], [role="listbox"], [role="dialog"]')];
    const results = [];
    for (const menu of menus) {
      const r = menu.getBoundingClientRect();
      const items = [...menu.querySelectorAll('[role="menuitem"], [role="option"], button, a, li')].map(i => ({
        tag: i.tagName,
        role: i.getAttribute('role'),
        text: i.textContent.trim().substring(0, 60),
        y: Math.round(i.getBoundingClientRect().y)
      })).filter(i => i.text.length > 1);
      results.push({ menuY: Math.round(r.y), menuH: Math.round(r.height), items });
    }
    
    // Also check for any popup/overlay that appeared
    const buttons = [...document.querySelectorAll('button')].filter(b => {
      const br = b.getBoundingClientRect();
      return br.width > 0 && br.y > 200;
    }).map(b => ({
      text: b.textContent.trim().substring(0, 50),
      label: b.getAttribute('aria-label') || '',
      y: Math.round(b.getBoundingClientRect().y)
    }));

    return { menus: results, allButtons: buttons };
  });
  console.log('Add to category results:', JSON.stringify(menuItems, null, 2));

  // Close menu
  await page.keyboard.press('Escape');
  await delay(1000);

  // Now scroll down to look for additional buttons/options on the page
  console.log('\n--- Scrolling down for more options ---');
  const scrollResults = await page.evaluate(() => {
    // Get all text on the page that might be relevant
    const allText = [];
    for (const el of document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, button, a, label')) {
      const text = el.textContent.trim();
      const r = el.getBoundingClientRect();
      if (text.length > 2 && text.length < 100 && r.width > 0 && el.children.length < 3) {
        allText.push({
          tag: el.tagName,
          text: text,
          y: Math.round(r.y),
          x: Math.round(r.x)
        });
      }
    }
    allText.sort((a, b) => a.y - b.y);
    
    // Check for any contenteditable elements
    const editables = [...document.querySelectorAll('[contenteditable="true"]')].map(e => ({
      tag: e.tagName,
      text: e.textContent.trim().substring(0, 50),
      y: Math.round(e.getBoundingClientRect().y)
    }));

    return { allText: allText.slice(0, 30), editables };
  });

  console.log('All visible text on page:');
  scrollResults.allText.forEach(t => console.log(`  y=${t.y} x=${t.x} [${t.tag}]: "${t.text}"`));
  console.log('Contenteditable:', JSON.stringify(scrollResults.editables));

  process.exit(0);
})();
