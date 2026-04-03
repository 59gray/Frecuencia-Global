const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com'));
  if (!page) { console.log('No Canva page'); process.exit(1); }
  await page.bringToFront();

  // Step 1: Reload fonts page to clear dirty state
  console.log('Navigating to fonts page...');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(5000);

  // Handle "Leave" dialog if present (unsaved changes)
  const leaveBtn = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent?.trim() === 'Leave' || b.textContent?.trim() === 'Discard') {
        const r = b.getBoundingClientRect();
        if (r.width > 40) return { x: r.x + r.width/2, y: r.y + r.height/2, text: b.textContent.trim() };
      }
    }
    return null;
  });
  if (leaveBtn) {
    console.log(`Clicking "${leaveBtn.text}" at (${leaveBtn.x}, ${leaveBtn.y})`);
    await page.mouse.click(leaveBtn.x, leaveBtn.y);
    await delay(3000);
  }

  // Wait for font rows to load
  await delay(3000);
  await page.screenshot({ path: 'scripts/fonts_clean.png' });

  // Step 2: Click Subtitle row
  const rows = await page.evaluate(() => {
    const results = [];
    const labels = ['Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (labels.includes(ownText) && el.tagName === 'SPAN') {
        const rect = el.getBoundingClientRect();
        if (rect.x > 300 && rect.width > 100) {
          results.push({ label: ownText, x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2), h: Math.round(rect.height) });
        }
      }
    }
    return results;
  });

  console.log('Font rows found:', rows.map(r => `${r.label}@${r.y}`).join(', '));
  
  const subtitle = rows.find(r => r.label === 'Subtitle');
  if (!subtitle) { console.log('Subtitle not found!'); process.exit(1); }
  
  console.log(`Clicking Subtitle at (${subtitle.x}, ${subtitle.y})`);
  await page.mouse.click(subtitle.x, subtitle.y);
  await delay(2000);
  
  await page.screenshot({ path: 'scripts/subtitle_expanded.png' });

  // Step 3: Find font dropdown more broadly
  const allBtns = await page.evaluate(() => {
    const results = [];
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      const rect = btn.getBoundingClientRect();
      // Only buttons in the expanded area (y between subtitle row and next row)
      if (rect.width > 60 && rect.height > 15 && rect.height < 60 && rect.y > 340 && rect.y < 520) {
        results.push({
          text: btn.textContent?.trim()?.substring(0, 50),
          label: btn.getAttribute('aria-label')?.substring(0, 50) || '',
          x: Math.round(rect.x), y: Math.round(rect.y),
          w: Math.round(rect.width), h: Math.round(rect.height),
          cx: Math.round(rect.x + rect.width/2), cy: Math.round(rect.y + rect.height/2),
        });
      }
    }
    return results;
  });

  console.log('\nButtons in expanded area:');
  allBtns.forEach(b => console.log(`  "${b.text}" label="${b.label}" at (${b.x},${b.y}) ${b.w}x${b.h} center=(${b.cx},${b.cy})`));

  // Find the "Choose a font" button specifically
  const fontBtn = allBtns.find(b => b.text.includes('Choose') || b.text.includes('font'));
  if (fontBtn) {
    console.log(`\nClicking font dropdown: "${fontBtn.text}" at (${fontBtn.cx}, ${fontBtn.cy})`);
    await page.mouse.click(fontBtn.cx, fontBtn.cy);
    await delay(3000);
    
    await page.screenshot({ path: 'scripts/font_picker_open.png' });
    
    // Step 4: Inspect the font picker popup thoroughly
    const pickerInfo = await page.evaluate(() => {
      const info = { inputs: [], lists: [], divs: [], fontItems: [] };
      
      // Find all visible inputs
      const inputs = document.querySelectorAll('input');
      for (const inp of inputs) {
        const rect = inp.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 10) {
          info.inputs.push({
            type: inp.type, placeholder: inp.placeholder || '',
            x: Math.round(rect.x), y: Math.round(rect.y),
            w: Math.round(rect.width), h: Math.round(rect.height),
          });
        }
      }
      
      // Find lists/panels that could be font results
      const listElements = document.querySelectorAll('[role="listbox"], [role="menu"], [role="list"], ul, [class*="font"], [class*="dropdown"], [class*="popover"], [class*="popup"]');
      for (const el of listElements) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 50) {
          info.lists.push({
            tag: el.tagName, role: el.getAttribute('role') || '',
            class: el.className?.toString()?.substring(0, 80) || '',
            x: Math.round(rect.x), y: Math.round(rect.y),
            w: Math.round(rect.width), h: Math.round(rect.height),
            childCount: el.children.length,
          });
        }
      }
      
      // Find any elements that might contain font preview text (divs with short text in the picker area)
      const allDivs = document.querySelectorAll('div, span, button, li');
      let fontSamples = 0;
      for (const el of allDivs) {
        const text = el.textContent?.trim() || '';
        const rect = el.getBoundingClientRect();
        // Font items are usually in a scrollable list, each ~40px tall
        if (rect.height > 25 && rect.height < 60 && rect.width > 150 && 
            text.length > 2 && text.length < 40 && fontSamples < 15) {
          // Check if this looks like a font name
          if (/^[A-Z][a-zA-Z\s]+$/.test(text) || text.includes('Grotesk') || text.includes('Sans') || text.includes('Mono')) {
            info.fontItems.push({
              text, tag: el.tagName,
              x: Math.round(rect.x), y: Math.round(rect.y),
              w: Math.round(rect.width), h: Math.round(rect.height),
            });
            fontSamples++;
          }
        }
      }
      
      return info;
    });
    
    console.log('\n--- FONT PICKER DOM ---');
    console.log('Inputs:', JSON.stringify(pickerInfo.inputs, null, 2));
    console.log('Lists:', JSON.stringify(pickerInfo.lists, null, 2));
    console.log('Font items (first 15):', JSON.stringify(pickerInfo.fontItems, null, 2));
    
  } else {
    console.log('No font dropdown button found!');
  }
  
  process.exit(0);
})();
