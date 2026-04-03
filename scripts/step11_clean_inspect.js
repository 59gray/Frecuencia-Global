const puppeteer = require('puppeteer-core');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null,
    });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('canva.com'));
    if (!page) { console.log('No Canva page found'); process.exit(1); }
    await page.bringToFront();

    // First, close any open dialogs / discard changes
    // Look for "Discard" button
    const discardBtn = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent?.trim() === 'Discard') {
          const rect = btn.getBoundingClientRect();
          return { x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2) };
        }
      }
      return null;
    });
    
    if (discardBtn) {
      console.log('Clicking Discard at:', discardBtn);
      await page.mouse.click(discardBtn.x, discardBtn.y);
      await delay(2000);
    }

    // Navigate fresh
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 15000 });
    await delay(3000);
    
    await page.screenshot({ path: 'scripts/fonts_clean.png' });

    // Now inspect: click on the Title row and dump ALL elements that appear in the expanded area
    // First find all SPAN rows
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
            results.push({
              label: ownText,
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              h: Math.round(rect.height),
            });
          }
        }
      }
      return results;
    });
    console.log('Font rows:', rows.map(r => `${r.label} at y=${r.y}`).join(', '));

    // Click on "Subtitle" to test (we know Title might be special)
    const subtitleRow = rows.find(r => r.label === 'Subtitle');
    if (subtitleRow) {
      console.log(`\nClicking Subtitle at (${subtitleRow.x + 10}, ${subtitleRow.y + subtitleRow.h/2})`);
      await page.mouse.click(subtitleRow.x + 10, subtitleRow.y + subtitleRow.h / 2);
      await delay(2000);
      
      await page.screenshot({ path: 'scripts/subtitle_expanded.png' });
      
      // Dump ALL interactive elements in the expanded area
      const expanded = await page.evaluate(() => {
        const results = [];
        const all = document.querySelectorAll('button, [role="button"], [role="combobox"], select, input');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.y > 220 && rect.y < 450) {
            const text = el.textContent?.trim()?.substring(0, 80) || '';
            results.push({
              tag: el.tagName,
              role: el.getAttribute('role'),
              ariaLabel: el.getAttribute('aria-label') || '',
              ariaHaspopup: el.getAttribute('aria-haspopup'),
              text,
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            });
          }
        }
        return results;
      });
      console.log('\nExpanded area elements:');
      expanded.forEach((e, i) => console.log(`  ${i}:`, JSON.stringify(e)));
    }

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
