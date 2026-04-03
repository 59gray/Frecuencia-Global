const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com'));
  if (!page) { console.log('No Canva page'); process.exit(1); }
  await page.bringToFront();

  // Try multiple click positions on Subtitle row
  // From screenshot, the Subtitle card row center is approximately at y=325, and spans from x~300 to x~1460
  
  // First, find the row's exact position
  const row = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (ownText === 'Subtitle' && el.tagName === 'SPAN') {
        const r = el.getBoundingClientRect();
        if (r.x > 300) {
          // Also get the parent div with cursor:pointer
          let p = el.parentElement;
          while (p) {
            if (window.getComputedStyle(p).cursor === 'pointer') {
              const pr = p.getBoundingClientRect();
              return { 
                span: { x: r.x, y: r.y, w: r.width, h: r.height },
                parent: { x: pr.x, y: pr.y, w: pr.width, h: pr.height },
                centerX: pr.x + pr.width / 2,
                centerY: pr.y + pr.height / 2,
              };
            }
            p = p.parentElement;
          }
          return { span: { x: r.x, y: r.y, w: r.width, h: r.height }, parent: null };
        }
      }
    }
    return null;
  });
  
  console.log('Subtitle row:', JSON.stringify(row));
  
  if (row.parent) {
    // Click center of the parent clickable div
    console.log(`\nClicking CENTER of parent div at (${Math.round(row.centerX)}, ${Math.round(row.centerY)})`);
    await page.mouse.click(row.centerX, row.centerY);
    await delay(2500);
    
    // Check if expanded
    const expanded = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Choose a font' || label.startsWith('Font:')) {
          const r = btn.getBoundingClientRect();
          return { text: btn.textContent?.trim(), label, x: r.x, y: r.y, w: r.width, h: r.height };
        }
      }
      // Also check for "Select a heading type" button
      for (const btn of btns) {
        const label = btn.getAttribute('aria-label') || '';
        if (label.includes('heading') || label.includes('font size') || label === 'Select a heading type') {
          const r = btn.getBoundingClientRect();
          return { text: btn.textContent?.trim(), label, x: r.x, y: r.y, w: r.width, h: r.height };
        }
      }
      return null;
    });
    
    if (expanded) {
      console.log(`✓ Row expanded! Found: "${expanded.text}" label="${expanded.label}" at (${Math.round(expanded.x)},${Math.round(expanded.y)})`);
      await page.screenshot({ path: 'scripts/test_expanded.png' });
    } else {
      console.log('✗ Row NOT expanded after center click');
      await page.screenshot({ path: 'scripts/test_not_expanded.png' });
      
      // Try clicking on the Subtitle text directly (left portion)
      console.log(`\nTrying click on text at (${Math.round(row.span.x + 50)}, ${Math.round(row.span.y + row.span.h/2)})`);
      await page.mouse.click(row.span.x + 50, row.span.y + row.span.h / 2);
      await delay(2500);
      
      const expanded2 = await page.evaluate(() => {
        for (const btn of document.querySelectorAll('button')) {
          const label = btn.getAttribute('aria-label') || '';
          if (label === 'Choose a font' || label.includes('heading') || label.includes('font size')) {
            return { text: btn.textContent?.trim(), label };
          }
        }
        return null;
      });
      
      if (expanded2) {
        console.log(`✓ Expanded with text click: "${expanded2.text}"`);
      } else {
        console.log('✗ Still not expanded.');
        
        // Try "Manage category" button
        const manageBtn = await page.evaluate(() => {
          for (const btn of document.querySelectorAll('button[aria-label="Manage category"]')) {
            const r = btn.getBoundingClientRect();
            if (r.y > 380 && r.y < 420) {
              return { x: r.x + r.width/2, y: r.y + r.height/2 };
            }
          }
          return null;
        });
        
        if (manageBtn) {
          console.log(`\nTrying "Manage category" at (${manageBtn.x}, ${manageBtn.y})`);
          await page.mouse.click(manageBtn.x, manageBtn.y);
          await delay(2000);
          await page.screenshot({ path: 'scripts/test_manage.png' });
          
          // Check for menu items
          const menu = await page.evaluate(() => {
            const items = [];
            for (const el of document.querySelectorAll('[role="menuitem"], [role="option"], button, li')) {
              const text = el.textContent?.trim();
              const r = el.getBoundingClientRect();
              if (r.width > 50 && r.height > 20 && r.height < 60 && text && text.length < 40) {
                items.push({ text, tag: el.tagName, x: Math.round(r.x), y: Math.round(r.y) });
              }
            }
            return items.filter(i => !i.text.includes('Manage'));
          });
          console.log('Menu items:', menu.map(m => `"${m.text}" at (${m.x},${m.y})`).join(', '));
        }
      }
    }
  }
  
  process.exit(0);
})();
