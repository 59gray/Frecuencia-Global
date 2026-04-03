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
    if (!page) { console.error('No Canva page'); process.exit(1); }
    await page.bringToFront();

    // Go back to brand kit main
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle2', timeout: 15000 });
    await delay(2000);

    // Find and click the Colors card (the large card in the grid, not sidebar)
    const result = await page.evaluate(() => {
      // Find all elements with "Colors" text that are part of a clickable card
      const allEls = document.querySelectorAll('h3, h4, p, span, div, a');
      for (const el of allEls) {
        const text = el.textContent.trim();
        const rect = el.getBoundingClientRect();
        // Card should be in the main content area (x > 300) and visible
        if (text === 'Colors' && rect.x > 300 && rect.width > 0) {
          // Click the element or its parent
          const clickTarget = el.closest('a') || el.closest('button') || el.closest('[role="button"]') || el.closest('[tabindex]') || el;
          clickTarget.click();
          return `Clicked at x:${rect.x} y:${rect.y} tag:${clickTarget.tagName}`;
        }
      }
      return 'NOT FOUND';
    });
    console.log('Colors card click:', result);
    await delay(3000);

    await page.screenshot({ path: 'scripts/brandkit_colors.png', fullPage: false });
    console.log('Screenshot saved');

    const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log(text);

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
