const puppeteer = require('puppeteer-core');

async function delay(ms) {
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
    if (!page) { process.exit(1); }
    await page.bringToFront();

    // Debug: find all interactive elements that contain "Colors" 
    const debug = await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const el = walker.currentNode;
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (ownText === 'Colors') {
          const rect = el.getBoundingClientRect();
          results.push({
            tag: el.tagName,
            class: el.className?.substring?.(0, 80) || '',
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
            parent: el.parentElement?.tagName,
            parentParent: el.parentElement?.parentElement?.tagName,
            href: el.href || el.closest('a')?.href || '',
          });
        }
      }
      return results;
    });
    console.log('Elements with "Colors" text:');
    debug.forEach((d, i) => console.log(`  ${i}:`, JSON.stringify(d)));

    // Click the one in the main content area (x > 350)
    const mainEl = debug.find(d => d.x > 350);
    if (mainEl) {
      const cx = mainEl.x + mainEl.w / 2;
      const cy = mainEl.y + mainEl.h / 2;
      console.log(`Clicking at ${cx}, ${cy}`);
      await page.mouse.click(cx, cy);
      await delay(3000);
    } else {
      console.log('No main content Colors found, trying sidebar...');
      const sideEl = debug[0];
      if (sideEl) {
        await page.mouse.click(sideEl.x + sideEl.w/2, sideEl.y + sideEl.h/2);
        await delay(3000);
      }
    }

    await page.screenshot({ path: 'scripts/brandkit_colors.png', fullPage: false });
    
    // Check current URL and page state
    console.log('URL:', page.url());
    const text = await page.evaluate(() => document.body.innerText.substring(0, 1500));
    console.log(text.substring(0, 800));

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
