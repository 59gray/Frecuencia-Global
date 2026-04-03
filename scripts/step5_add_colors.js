const puppeteer = require('puppeteer-core');

const COLORS_TO_ADD = ['FFFFFF', 'A0A0B8', '4A6BFF'];

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

    // Navigate to colors section
    const colorsUrl = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz8rpRxT';
    if (!page.url().includes('IG-Fxa2jz8rpRxT')) {
      await page.goto(colorsUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    }
    await delay(2000);

    // Take screenshot of current state
    await page.screenshot({ path: 'scripts/colors_before.png', fullPage: false });

    // Find "Add a new color" button or "+" button
    const addBtnInfo = await page.evaluate(() => {
      const results = [];
      const all = document.querySelectorAll('button, [role="button"], a');
      for (const el of all) {
        const text = el.textContent?.trim() || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        if (text.includes('Add') || text.includes('add') || ariaLabel.includes('Add') || ariaLabel.includes('color') || text === '+') {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            results.push({
              tag: el.tagName,
              text: text.substring(0, 50),
              ariaLabel: ariaLabel.substring(0, 50),
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            });
          }
        }
      }
      return results;
    });
    console.log('Add buttons found:', JSON.stringify(addBtnInfo, null, 2));

    // Also look for color swatch area and add button
    const pageText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
    console.log('\nPage text (first 1500):\n', pageText.substring(0, 1500));

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
