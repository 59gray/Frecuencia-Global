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
    if (ready) { console.log(`Content ready after ${i + 1}s`); await delay(2000); break; }
  }

  // TEST 1: Hover over a row and check for new buttons
  console.log('\n=== TEST 1: Hover over Subtitle row ===');
  await page.mouse.move(400, 389);
  await delay(2000);
  await page.screenshot({ path: 'scripts/diag23_hover.png' });
  
  const hoverBtns = await page.evaluate(() => {
    const results = [];
    for (const btn of document.querySelectorAll('button')) {
      const r = btn.getBoundingClientRect();
      if (r.y > 350 && r.y < 430 && r.width > 10) {
        results.push({
          label: (btn.getAttribute('aria-label') || '').substring(0, 60),
          text: (btn.textContent || '').trim().substring(0, 30),
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
          visible: window.getComputedStyle(btn).visibility,
          opacity: window.getComputedStyle(btn).opacity,
        });
      }
    }
    return results;
  });
  console.log('Buttons near Subtitle row during hover:');
  for (const b of hoverBtns) console.log(`  ${JSON.stringify(b)}`);

  // TEST 2: Double-click the row
  console.log('\n=== TEST 2: Double-click Subtitle text ===');
  await page.mouse.click(153, 389, { clickCount: 2 });
  await delay(3000);
  await page.screenshot({ path: 'scripts/diag23_dblclick.png' });
  
  // Check what changed
  const afterDblClickBtns = await page.evaluate(() => {
    const results = [];
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      if (label.includes('font') || label.includes('Font') || label.includes('Choose') || 
          label.includes('Save') || label.includes('Discard') || label.includes('search') ||
          label.includes('Edit') || label.includes('expand')) {
        const r = btn.getBoundingClientRect();
        results.push({ label, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) });
      }
    }
    return results;
  });
  console.log('Font-related buttons after dblclick:');
  for (const b of afterDblClickBtns) console.log(`  ${JSON.stringify(b)}`);

  // Check for inputs/search
  const inputs = await page.evaluate(() => {
    return [...document.querySelectorAll('input')].map(inp => {
      const r = inp.getBoundingClientRect();
      return { type: inp.type, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) };
    }).filter(i => i.w > 20);
  });
  console.log('Inputs after dblclick:', inputs);

  // Reset
  await page.keyboard.press('Escape');
  await delay(1000);
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await delay(5000);

  // TEST 3: Click the "+" Add to category button
  console.log('\n=== TEST 3: Click "Add to category" button ===');
  const addBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      if ((btn.getAttribute('aria-label')||'').includes('Add to category')) {
        const r = btn.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
    }
    return null;
  });
  
  if (addBtn) {
    console.log(`Clicking Add to category at (${addBtn.x|0}, ${addBtn.y|0})`);
    await page.mouse.click(addBtn.x, addBtn.y);
    await delay(3000);
    await page.screenshot({ path: 'scripts/diag23_add_btn.png' });
    
    // Check for new menu/dropdown
    const after = await page.evaluate(() => {
      const results = [];
      // Any new dialogs/menus/dropdowns?
      for (const el of document.querySelectorAll('[role="dialog"], [role="menu"], [role="menuitem"], [role="listbox"], [role="option"], [aria-expanded="true"]')) {
        const r = el.getBoundingClientRect();
        results.push({
          tag: el.tagName, role: el.getAttribute('role'),
          text: (el.textContent || '').trim().substring(0, 80),
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
        });
      }
      // Also check for new inputs
      for (const inp of document.querySelectorAll('input[type="search"], input[type="text"]')) {
        const r = inp.getBoundingClientRect();
        if (r.width > 30) results.push({ tag: 'INPUT', type: inp.type, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) });
      }
      // New buttons
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        const r = btn.getBoundingClientRect();
        if (r.width > 10 && r.y > 100 && r.y < 800 && !label.includes('Delete') && !label.includes('Edit label') && !label.includes('Add to category') && !label.includes('Manage') && !label.includes('Help')) {
          results.push({ tag: 'BUTTON', label, text: (btn.textContent || '').trim().substring(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
      return results;
    });
    console.log('Elements after clicking Add:');
    for (const e of after) console.log(`  ${JSON.stringify(e)}`);
  }

  // TEST 4: Click the "Manage category" button
  console.log('\n=== TEST 4: Click "Manage category" button ===');
  await page.keyboard.press('Escape');
  await delay(1000);
  
  const manageBtn = await page.evaluate(() => {
    for (const btn of document.querySelectorAll('button')) {
      if ((btn.getAttribute('aria-label')||'').includes('Manage category')) {
        const r = btn.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
    }
    return null;
  });
  
  if (manageBtn) {
    console.log(`Clicking Manage category at (${manageBtn.x|0}, ${manageBtn.y|0})`);
    await page.mouse.click(manageBtn.x, manageBtn.y);
    await delay(3000);
    await page.screenshot({ path: 'scripts/diag23_manage_btn.png' });
    
    const after2 = await page.evaluate(() => {
      const results = [];
      for (const el of document.querySelectorAll('[role="dialog"], [role="menu"], [role="menuitem"], [role="listbox"], [role="option"], [aria-expanded="true"]')) {
        const r = el.getBoundingClientRect();
        results.push({
          tag: el.tagName, role: el.getAttribute('role'),
          text: (el.textContent || '').trim().substring(0, 80),
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
        });
      }
      for (const btn of document.querySelectorAll('button')) {
        const label = btn.getAttribute('aria-label') || '';
        const r = btn.getBoundingClientRect();
        if (r.width > 10 && r.y > 100 && r.y < 800 && !label.includes('Delete') && !label.includes('Edit label') && !label.includes('Add to category') && !label.includes('Manage') && !label.includes('Help')) {
          results.push({ tag: 'BUTTON', label, text: (btn.textContent || '').trim().substring(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
      return results;
    });
    console.log('Elements after clicking Manage:');
    for (const e of after2) console.log(`  ${JSON.stringify(e)}`);
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
