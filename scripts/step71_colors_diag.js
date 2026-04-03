const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

const COLORS = [
  { name: 'Negro Profundo',  hex: '0A0A0F' },
  { name: 'Cian Eléctrico',  hex: '00E5FF' },
  { name: 'Magenta Neón',    hex: 'FF00E5' },
  { name: 'Grafito Azulado', hex: '1A1A2E' },
  { name: 'Verde Ácido',     hex: 'B8FF00' },
  { name: 'Blanco Puro',     hex: 'FFFFFF' },
  { name: 'Gris Claro',      hex: 'A0A0B8' },
  { name: 'Azul Profundo',   hex: '4A6BFF' },
];

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Go to Brand Kit main page
  console.log('Navigating to Brand Kit...');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Click on "Colors" category in the left sidebar
  console.log('Looking for Colors category...');
  const clickedColors = await page.evaluate(() => {
    const items = [...document.querySelectorAll('p, span, div')];
    const colorsEl = items.find(el => el.textContent.trim() === 'Colors' && el.children.length === 0);
    if (colorsEl) {
      colorsEl.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Colors:', clickedColors);
  await delay(3000);

  // Take a screenshot to see the current state
  const screenshot1 = await page.screenshot({ encoding: 'base64' });
  console.log('Colors page screenshot taken, length:', screenshot1.length);

  // Look for what's on the page now
  const pageState = await page.evaluate(() => {
    const text = document.body.innerText;
    const btns = [...document.querySelectorAll('button')].map(b => ({
      text: b.textContent.trim().substring(0, 60),
      ariaLabel: b.getAttribute('aria-label') || '',
      visible: b.getBoundingClientRect().width > 0
    })).filter(b => b.visible);
    return { btns, url: location.href };
  });
  console.log('Current URL:', pageState.url);
  console.log('Visible buttons:');
  pageState.btns.forEach(b => console.log(`  [${b.text}] aria="${b.ariaLabel}"`));

  // Look for "Add" or "+" button to add colors
  // First try to find if there's an existing color palette section
  const colorSection = await page.evaluate(() => {
    // Find the main content area
    const main = document.querySelector('[role="main"]') || document.body;
    const allText = main.innerText;
    
    // Look for "Add a new color", "+ Add", color-related buttons
    const addBtns = [...document.querySelectorAll('button')].filter(b => {
      const t = b.textContent.trim().toLowerCase();
      return (t.includes('add') || t.includes('+') || t.includes('new color') || 
              t.includes('palette') || t.includes('color')) && b.getBoundingClientRect().width > 0;
    });
    
    return {
      addButtons: addBtns.map(b => ({
        text: b.textContent.trim().substring(0, 80),
        ariaLabel: b.getAttribute('aria-label') || '',
        rect: b.getBoundingClientRect()
      })),
      hasColorContent: allText.includes('#') || allText.includes('palette') || allText.includes('color'),
      mainText: allText.substring(0, 500)
    };
  });
  console.log('\nColor section analysis:');
  console.log('Add buttons:', JSON.stringify(colorSection.addButtons, null, 2));
  console.log('Has color content:', colorSection.hasColorContent);
  console.log('Main text:', colorSection.mainText.substring(0, 300));

  // Now let's try to click on the Colors group directly
  console.log('\n--- Clicking on Colors group role=group ---');
  const groupClick = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('p, span')];
    const colorsLabel = labels.find(el => el.textContent.trim() === 'Colors' && el.children.length === 0);
    if (!colorsLabel) return { error: 'Colors label not found' };
    
    // Find parent with role=group
    let group = colorsLabel;
    for (let i = 0; i < 10; i++) {
      group = group.parentElement;
      if (!group) break;
      if (group.getAttribute('role') === 'group') break;
    }
    
    if (!group || group.getAttribute('role') !== 'group') {
      return { error: 'No group parent found' };
    }
    
    // Click the group's role=button
    const btn = group.querySelector('[role="button"]');
    if (btn) {
      btn.click();
      return { clicked: 'role=button in group', text: btn.textContent.trim().substring(0, 60) };
    }
    
    // Or click the group itself
    group.click();
    return { clicked: 'group itself', text: group.textContent.trim().substring(0, 60) };
  });
  console.log('Group click result:', JSON.stringify(groupClick));
  await delay(3000);

  // Check the URL and page state after clicking
  const afterClick = await page.evaluate(() => {
    const url = location.href;
    const btns = [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0);
    const addBtns = btns.filter(b => {
      const t = b.textContent.trim().toLowerCase();
      return t.includes('add') || t.includes('+');
    });
    
    // Look for color input fields
    const inputs = [...document.querySelectorAll('input')].filter(i => i.getBoundingClientRect().width > 0);
    
    // Look for any "empty state" message
    const texts = [...document.querySelectorAll('p, span, div')].filter(el => {
      const t = el.textContent.trim().toLowerCase();
      return (t.includes('add') || t.includes('empty') || t.includes('no ') || t.includes('palette')) 
        && el.children.length === 0 && el.getBoundingClientRect().width > 0;
    });
    
    return {
      url,
      addButtons: addBtns.map(b => ({ text: b.textContent.trim().substring(0, 80), ariaLabel: b.getAttribute('aria-label') || '' })),
      inputs: inputs.map(i => ({ placeholder: i.placeholder, type: i.type, value: i.value })),
      contextTexts: texts.map(el => el.textContent.trim().substring(0, 80))
    };
  });
  console.log('\nAfter clicking Colors:');
  console.log('URL:', afterClick.url);
  console.log('Add buttons:', JSON.stringify(afterClick.addButtons));
  console.log('Inputs:', JSON.stringify(afterClick.inputs));
  console.log('Context texts:', JSON.stringify(afterClick.contextTexts));

  // Try to add a new palette or use existing "Add" button
  // Look for "Add a new color" or "Add palette"
  const addResult = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0);
    
    // Try "Add a new color" first
    let addBtn = btns.find(b => b.textContent.trim().toLowerCase().includes('add a new color'));
    if (!addBtn) addBtn = btns.find(b => b.textContent.trim().toLowerCase().includes('add new'));
    if (!addBtn) addBtn = btns.find(b => b.textContent.trim().toLowerCase().includes('add palette'));
    if (!addBtn) {
      // Try "+" icon buttons near color area
      addBtn = btns.find(b => {
        const al = (b.getAttribute('aria-label') || '').toLowerCase();
        return al.includes('add') && (al.includes('color') || al.includes('palette'));
      });
    }
    if (!addBtn) {
      // Find the empty state CTA
      addBtn = btns.find(b => {
        const t = b.textContent.trim();
        return t === '+' || t.includes('Add brand');
      });
    }
    
    if (addBtn) {
      addBtn.click();
      return { clicked: addBtn.textContent.trim().substring(0, 60), ariaLabel: addBtn.getAttribute('aria-label') || '' };
    }
    
    return { error: 'No add button found', allBtns: btns.map(b => b.textContent.trim().substring(0, 40)).slice(0, 20) };
  });
  console.log('\nAdd button result:', JSON.stringify(addResult));
  await delay(3000);

  // Check what appeared after clicking add
  const afterAdd = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input')].filter(i => i.getBoundingClientRect().width > 0);
    const btns = [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0);
    
    // Look for color picker or hex input
    const hexInput = inputs.find(i => {
      const p = (i.placeholder || '').toLowerCase();
      return p.includes('hex') || p.includes('color') || i.type === 'text';
    });
    
    return {
      url: location.href,
      inputs: inputs.map(i => ({ placeholder: i.placeholder, type: i.type, value: i.value, id: i.id })),
      buttons: btns.map(b => b.textContent.trim().substring(0, 40)).slice(0, 25),
      hexInput: hexInput ? { placeholder: hexInput.placeholder, id: hexInput.id } : null
    };
  });
  console.log('\nAfter add:');
  console.log('URL:', afterAdd.url);
  console.log('Inputs:', JSON.stringify(afterAdd.inputs));
  console.log('Hex input:', JSON.stringify(afterAdd.hexInput));
  console.log('Buttons:', afterAdd.buttons);

  console.log('\nDONE - Diagnostic complete');
})();
