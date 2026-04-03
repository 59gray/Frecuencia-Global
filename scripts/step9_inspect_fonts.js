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

    // Inspect the font rows structure in detail
    const fontRows = await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      const labels = ['TITLE', 'Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];
      
      while (walker.nextNode()) {
        const el = walker.currentNode;
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (labels.includes(ownText) || labels.includes(ownText.toUpperCase())) {
          const rect = el.getBoundingClientRect();
          if (rect.x > 250 && rect.width > 0) {
            // Walk up to find clickable parent
            let clickable = el;
            let parent = el.parentElement;
            let depth = 0;
            while (parent && depth < 5) {
              if (parent.tagName === 'BUTTON' || parent.getAttribute('role') === 'button' || 
                  parent.tagName === 'A' || parent.onclick || parent.style.cursor === 'pointer') {
                clickable = parent;
                break;
              }
              parent = parent.parentElement;
              depth++;
            }
            const clickRect = clickable.getBoundingClientRect();
            results.push({
              label: ownText,
              tag: el.tagName,
              elX: Math.round(rect.x),
              elY: Math.round(rect.y),
              elW: Math.round(rect.width),
              elH: Math.round(rect.height),
              clickTag: clickable.tagName,
              clickRole: clickable.getAttribute('role'),
              clickX: Math.round(clickRect.x),
              clickY: Math.round(clickRect.y),
              clickW: Math.round(clickRect.width),
              clickH: Math.round(clickRect.height),
              clickCursor: window.getComputedStyle(clickable).cursor,
              parentTag: el.parentElement?.tagName,
              parentRole: el.parentElement?.getAttribute('role'),
              parentCursor: window.getComputedStyle(el.parentElement).cursor,
            });
          }
        }
      }
      return results;
    });
    
    console.log('Font category rows:');
    fontRows.forEach((r, i) => console.log(`  ${i}: ${JSON.stringify(r)}`));

    // Now try clicking right on the text of "Title" 
    const titleRow = fontRows.find(r => r.label === 'Title' || r.label === 'TITLE');
    if (titleRow) {
      console.log(`\nClicking on "${titleRow.label}" text at (${titleRow.elX + 5}, ${titleRow.elY + titleRow.elH/2})`);
      await page.mouse.click(titleRow.elX + 5, titleRow.elY + titleRow.elH / 2);
      await delay(3000);
      
      await page.screenshot({ path: 'scripts/font_picker2.png' });
      
      // Check for any new elements
      const newEls = await page.evaluate(() => {
        const allInputs = document.querySelectorAll('input');
        const results = [];
        for (const inp of allInputs) {
          const rect = inp.getBoundingClientRect();
          if (rect.width > 0) {
            results.push({
              type: inp.type,
              value: inp.value,
              placeholder: inp.placeholder,
              ariaLabel: inp.getAttribute('aria-label') || '',
              x: Math.round(rect.x),
              y: Math.round(rect.y),
            });
          }
        }
        // Also check for dropdown/popover/listbox
        const popups = document.querySelectorAll('[role="listbox"], [role="menu"], [data-radix-popper-content-wrapper], [class*="popover"], [class*="flyout"]');
        for (const p of popups) {
          const rect = p.getBoundingClientRect();
          results.push({
            tag: p.tagName,
            role: p.getAttribute('role'),
            text: p.textContent?.substring(0, 100),
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            w: Math.round(rect.width),
          });
        }
        return results;
      });
      console.log('New elements after click:', JSON.stringify(newEls, null, 2));
    }

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
