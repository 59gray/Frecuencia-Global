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

    // Click "Fonts" in the sidebar
    const fontsLink = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const el = walker.currentNode;
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (ownText === 'Fonts') {
          const rect = el.getBoundingClientRect();
          if (rect.x < 300) { // sidebar
            return { x: rect.x + rect.width/2, y: rect.y + rect.height/2, href: el.href || el.closest('a')?.href || '' };
          }
        }
      }
      return null;
    });

    if (fontsLink) {
      console.log('Clicking Fonts sidebar link at:', fontsLink);
      await page.mouse.click(fontsLink.x, fontsLink.y);
      await delay(3000);
    } else {
      console.log('Fonts sidebar link not found!');
      process.exit(1);
    }

    await page.screenshot({ path: 'scripts/fonts_page.png' });
    console.log('URL:', page.url());

    // Get page content to understand the fonts section
    const pageText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
    console.log('\nPage text:\n', pageText.substring(0, 2000));

    // Find all buttons and interactive elements
    const buttons = await page.evaluate(() => {
      const results = [];
      const btns = document.querySelectorAll('button, [role="button"]');
      for (const btn of btns) {
        const text = btn.textContent?.trim()?.substring(0, 60) || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.x > 250) { // main content area
          results.push({
            text,
            ariaLabel,
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          });
        }
      }
      return results;
    });
    console.log('\nButtons in main area:', JSON.stringify(buttons, null, 2));

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
