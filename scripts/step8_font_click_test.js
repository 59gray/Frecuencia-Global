const puppeteer = require('puppeteer-core');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Map Canva font categories to brand fonts
const FONT_ASSIGNMENTS = [
  { category: 'Title', font: 'Bebas Neue', yApprox: 255 },
  { category: 'Subtitle', font: 'Space Grotesk', yApprox: 325 },
  { category: 'Heading', font: 'Bebas Neue', yApprox: 393 },
  { category: 'Subheading', font: 'Space Grotesk', yApprox: 462 },
  { category: 'Section header', font: 'Space Grotesk', yApprox: 530 },
  { category: 'Body', font: 'Space Grotesk', yApprox: 598 },
  { category: 'Quote', font: 'Space Grotesk', yApprox: 667 },
  { category: 'Caption', font: 'JetBrains Mono', yApprox: 735 },
];

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

    // Make sure we're on the fonts page
    const fontsUrl = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
    if (!page.url().includes('IG-Fxa2jz9CwFFe')) {
      await page.goto(fontsUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      await delay(2000);
    }

    // First, let's click on the first font category ("Title") to see what happens
    const assignment = FONT_ASSIGNMENTS[0]; // Title
    console.log(`\n--- Setting ${assignment.category} to ${assignment.font} ---`);

    // Click the font row - click in the center of the row
    const clickX = 800; // middle of the main content area
    console.log(`Clicking at (${clickX}, ${assignment.yApprox})`);
    await page.mouse.click(clickX, assignment.yApprox);
    await delay(2000);

    // Take screenshot to see what appeared
    await page.screenshot({ path: 'scripts/font_picker.png' });

    // Check for search input or font list
    const inputs = await page.evaluate(() => {
      const results = [];
      const inputs = document.querySelectorAll('input');
      for (const inp of inputs) {
        const rect = inp.getBoundingClientRect();
        if (rect.width > 0) {
          results.push({
            type: inp.type,
            value: inp.value,
            placeholder: inp.placeholder,
            ariaLabel: inp.getAttribute('aria-label') || '',
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          });
        }
      }
      return results;
    });
    console.log('Inputs found:', JSON.stringify(inputs, null, 2));

    // Also check what text elements appeared
    const newText = await page.evaluate(() => {
      const els = document.querySelectorAll('[role="listbox"], [role="option"], [role="combobox"], [role="dialog"], [class*="dropdown"], [class*="popup"], [class*="modal"]');
      const results = [];
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        results.push({
          tag: el.tagName,
          role: el.getAttribute('role'),
          text: el.textContent?.substring(0, 100),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
        });
      }
      return results;
    });
    console.log('Popup elements:', JSON.stringify(newText, null, 2));

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
