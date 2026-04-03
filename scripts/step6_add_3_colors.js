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

    for (const color of COLORS_TO_ADD) {
      console.log(`\n--- Adding color #${color} ---`);

      // Find and click "Add a new color" button
      const addBtn = await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const btn of btns) {
          if (btn.getAttribute('aria-label') === 'Add a new color') {
            const rect = btn.getBoundingClientRect();
            return { x: rect.x + rect.width/2, y: rect.y + rect.height/2 };
          }
        }
        return null;
      });

      if (!addBtn) {
        console.log('ERROR: "Add a new color" button not found!');
        await page.screenshot({ path: 'scripts/colors_error.png' });
        process.exit(1);
      }

      console.log(`Clicking "Add a new color" at (${addBtn.x}, ${addBtn.y})`);
      await page.mouse.click(addBtn.x, addBtn.y);
      await delay(2000);

      // Take screenshot to see what appeared
      await page.screenshot({ path: `scripts/color_picker_${color}.png` });

      // Look for hex input field - could be an input with # prefix
      const inputInfo = await page.evaluate(() => {
        const results = [];
        const inputs = document.querySelectorAll('input[type="text"], input:not([type]), input[type="search"]');
        for (const inp of inputs) {
          const rect = inp.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            results.push({
              tag: inp.tagName,
              type: inp.type,
              value: inp.value,
              placeholder: inp.placeholder,
              ariaLabel: inp.getAttribute('aria-label') || '',
              id: inp.id,
              name: inp.name,
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            });
          }
        }
        return results;
      });
      console.log('Inputs found:', JSON.stringify(inputInfo, null, 2));

      // Find the hex input (likely has a # or hex-related attribute)
      let hexInput = inputInfo.find(i => 
        i.placeholder?.toLowerCase().includes('hex') || 
        i.ariaLabel?.toLowerCase().includes('hex') ||
        i.value?.match(/^[0-9a-fA-F]{6}$/) ||
        i.value === '' && i.w > 50 && i.w < 200
      );

      if (!hexInput && inputInfo.length > 0) {
        // Take the last visible input that's not too wide (likely the hex field)
        hexInput = inputInfo[inputInfo.length - 1];
      }

      if (hexInput) {
        console.log(`Found hex input at (${hexInput.x}, ${hexInput.y}), current value: "${hexInput.value}"`);
        // Click the input
        await page.mouse.click(hexInput.x + hexInput.w/2, hexInput.y + hexInput.h/2);
        await delay(300);
        // Select all and clear
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await delay(100);
        // Type the hex value
        await page.keyboard.type(color, { delay: 50 });
        await delay(500);
        console.log(`Typed ${color}`);
        // Press Enter to confirm
        await page.keyboard.press('Enter');
        await delay(2000);
        console.log(`Color #${color} submitted`);
      } else {
        console.log('No hex input found! Checking DOM...');
        const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
        console.log(bodyText.substring(0, 500));
      }
    }

    // Final screenshot
    await delay(1000);
    await page.screenshot({ path: 'scripts/colors_after.png' });
    
    // Verify: list all colors
    const finalColors = await page.evaluate(() => {
      const results = [];
      const all = document.querySelectorAll('button');
      for (const btn of all) {
        const label = btn.getAttribute('aria-label') || '';
        if (label === 'Delete color') {
          const prev = btn.previousElementSibling || btn.parentElement;
          const text = prev?.textContent?.trim() || '';
          results.push(text);
        }
      }
      return results;
    });
    console.log('\nFinal colors in Brand Kit:', finalColors);

    const allTexts = await page.evaluate(() => {
      const els = document.querySelectorAll('[class]');
      const hexes = [];
      for (const el of els) {
        const t = el.textContent?.trim();
        if (t && /^#[0-9a-fA-F]{6}$/.test(t)) {
          hexes.push(t);
        }
      }
      return [...new Set(hexes)];
    });
    console.log('Hex values found on page:', allTexts);

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
