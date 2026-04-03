const puppeteer = require('puppeteer-core');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Font assignments - Title already has Bebas Neue from default, skip it
const FONT_CONFIG = [
  // { category: 'Title', font: 'Bebas Neue' },  // Already set
  { category: 'Subtitle',       font: 'Space Grotesk' },
  { category: 'Heading',        font: 'Bebas Neue' },
  { category: 'Subheading',     font: 'Space Grotesk' },
  { category: 'Section header', font: 'Space Grotesk' },
  { category: 'Body',           font: 'Space Grotesk' },
  { category: 'Quote',          font: 'Space Grotesk' },
  { category: 'Caption',        font: 'JetBrains Mono' },
];

async function findRows(page) {
  return page.evaluate(() => {
    const results = [];
    const labels = ['Title', 'Subtitle', 'Heading', 'Subheading', 'Section header', 'Body', 'Quote', 'Caption'];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (labels.includes(ownText) && el.tagName === 'SPAN') {
        const rect = el.getBoundingClientRect();
        if (rect.x > 300 && rect.width > 100) {
          results.push({ label: ownText, x: Math.round(rect.x), y: Math.round(rect.y), h: Math.round(rect.height) });
        }
      }
    }
    return results;
  });
}

async function setFont(page, categoryLabel, fontName) {
  console.log(`\n=== Setting "${categoryLabel}" → ${fontName} ===`);
  
  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);

  // Find rows and click the target
  let rows = await findRows(page);
  let row = rows.find(r => r.label === categoryLabel);
  if (!row) {
    // Scroll down to find it
    await page.evaluate(() => window.scrollBy(0, 400));
    await delay(500);
    rows = await findRows(page);
    row = rows.find(r => r.label === categoryLabel);
  }
  if (!row) {
    console.log(`Row "${categoryLabel}" not found!`);
    return false;
  }
  
  console.log(`Clicking row at (${row.x + 10}, ${row.y + row.h / 2})`);
  await page.mouse.click(row.x + 10, row.y + row.h / 2);
  await delay(2000);
  
  // Find and click the "Choose a font" dropdown (or current font name dropdown)
  const fontDropdown = await page.evaluate(() => {
    const btns = document.querySelectorAll('button, [role="combobox"], [role="listbox"]');
    for (const btn of btns) {
      const text = btn.textContent?.trim() || '';
      if (text.includes('Choose a font') || text.includes('Bebas') || text.includes('Space') || text.includes('JetBrains')) {
        const rect = btn.getBoundingClientRect();
        // Should be in the expanded font editor area
        if (rect.width > 80 && rect.width < 250 && rect.height > 20 && rect.height < 50) {
          return { text, x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2), w: Math.round(rect.width) };
        }
      }
    }
    return null;
  });
  
  if (!fontDropdown) {
    console.log('Font dropdown not found. Looking for any dropdown in expanded area...');
    // Try broader search - find the first dropdown/button after "Font" label
    const fallback = await page.evaluate(() => {
      const labels = document.querySelectorAll('label, span');
      for (const label of labels) {
        if (label.textContent?.trim() === 'Font') {
          const rect = label.getBoundingClientRect();
          // Look for the next sibling or nearby button
          const parent = label.closest('div') || label.parentElement;
          const buttons = parent?.querySelectorAll('button, select, [role="combobox"]');
          if (buttons) {
            for (const btn of buttons) {
              const br = btn.getBoundingClientRect();
              if (br.width > 60 && Math.abs(br.y - rect.y) < 40) {
                return { text: btn.textContent?.trim()?.substring(0, 40), x: Math.round(br.x + br.width/2), y: Math.round(br.y + br.height/2) };
              }
            }
          }
        }
      }
      return null;
    });
    
    if (fallback) {
      console.log('Found fallback dropdown:', fallback);
      await page.mouse.click(fallback.x, fallback.y);
      await delay(2000);
    } else {
      console.log('No font dropdown found at all!');
      await page.screenshot({ path: `scripts/font_fail_${categoryLabel.replace(/ /g,'_')}.png` });
      // Press Escape and continue
      await page.keyboard.press('Escape');
      await delay(1000);
      return false;
    }
  } else {
    console.log(`Font dropdown: "${fontDropdown.text}" at (${fontDropdown.x}, ${fontDropdown.y})`);
    
    // If already the right font, just confirm
    if (fontDropdown.text.includes(fontName.split(' ')[0])) {
      console.log(`Already set to ${fontName}!`);
      await clickConfirm(page);
      return true;
    }
    
    await page.mouse.click(fontDropdown.x, fontDropdown.y);
    await delay(2000);
  }
  
  // Now a font picker should be open - look for search input
  await page.screenshot({ path: `scripts/font_picker_${categoryLabel.replace(/ /g,'_')}.png` });
  
  const searchInput = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], input:not([type])');
    for (const inp of inputs) {
      const rect = inp.getBoundingClientRect();
      if (rect.width > 100 && rect.height > 20 && rect.height < 60) {
        return { 
          x: Math.round(rect.x + rect.width/2), 
          y: Math.round(rect.y + rect.height/2),
          placeholder: inp.placeholder,
          value: inp.value,
        };
      }
    }
    return null;
  });
  
  if (searchInput) {
    console.log(`Search input found: "${searchInput.placeholder}" at (${searchInput.x}, ${searchInput.y})`);
    await page.mouse.click(searchInput.x, searchInput.y);
    await delay(300);
    // Clear any existing text
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await delay(100);
    // Type font name
    await page.keyboard.type(fontName, { delay: 60 });
    await delay(2000);
    
    // Click first result
    const result = await page.evaluate((fontName) => {
      const all = document.querySelectorAll('button, [role="option"], [role="menuitem"], li, div[class]');
      const firstWord = fontName.split(' ')[0];
      for (const el of all) {
        const text = el.textContent?.trim() || '';
        if (text.includes(fontName) || text.includes(firstWord)) {
          const rect = el.getBoundingClientRect();
          // Result items should be medium-sized, not the search input itself
          if (rect.width > 150 && rect.height > 25 && rect.height < 80 && rect.y > 200) {
            // Check this is not the search input container
            if (!el.querySelector('input')) {
              return { text: text.substring(0, 60), x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2) };
            }
          }
        }
      }
      return null;
    }, fontName);
    
    if (result) {
      console.log(`Clicking result: "${result.text}" at (${result.x}, ${result.y})`);
      await page.mouse.click(result.x, result.y);
      await delay(2000);
    } else {
      console.log('No font result found!');
      await page.screenshot({ path: `scripts/font_noresult_${categoryLabel.replace(/ /g,'_')}.png` });
      await page.keyboard.press('Escape');
      await delay(1000);
    }
  } else {
    console.log('No search input found');
  }
  
  // Confirm with checkmark
  await clickConfirm(page);
  return true;
}

async function clickConfirm(page) {
  // Find the checkmark/confirm button - look for a small button near ✓
  const confirmBtn = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      const label = btn.getAttribute('aria-label') || '';
      const rect = btn.getBoundingClientRect();
      // Look for the checkmark - it should have an SVG with a check path
      // It's positioned near the right side, in the expanded row area
      if (rect.x > 1400 && rect.width < 60 && rect.height < 60 && rect.y > 350 && rect.y < 500) {
        // Make sure it's not a delete button
        if (!label.includes('Delete') && !label.includes('delete') && !label.includes('Manage')) {
          return { x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2), label };
        }
      }
    }
    return null;
  });
  
  if (confirmBtn) {
    console.log(`Confirm at (${confirmBtn.x}, ${confirmBtn.y}) label="${confirmBtn.label}"`);
    await page.mouse.click(confirmBtn.x, confirmBtn.y);
    await delay(1500);
  } else {
    console.log('Confirm button not found, trying visual position...');
    // From screenshot: ✓ is at approximately (1452, 392) and X at (1484, 392)
    // But y position varies by row. Let me find the X button first
    const xBtn = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        const label = btn.getAttribute('aria-label') || '';
        const text = btn.textContent?.trim();
        const rect = btn.getBoundingClientRect();
        // The X/close button
        if (rect.x > 1400 && rect.width < 60 && rect.height < 60 && rect.y > 350 && rect.y < 500) {
          return { x: Math.round(rect.x), y: Math.round(rect.y + rect.height/2), w: Math.round(rect.width) };
        }
      }
      return null;
    });
    if (xBtn) {
      // Confirm (✓) is just to the left of the X
      const confirmX = xBtn.x - xBtn.w - 5;
      console.log(`Trying confirm at (${confirmX}, ${xBtn.y})`);
      await page.mouse.click(confirmX, xBtn.y);
      await delay(1500);
    }
  }
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

    // Make sure we're on the fonts page
    if (!page.url().includes('IG-Fxa2jz9CwFFe')) {
      // Click Fonts in sidebar
      const fontsLink = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        while (walker.nextNode()) {
          const el = walker.currentNode;
          const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
          if (ownText === 'Fonts' && el.getBoundingClientRect().x < 300) {
            const rect = el.getBoundingClientRect();
            return { x: rect.x + rect.width/2, y: rect.y + rect.height/2 };
          }
        }
        return null;
      });
      if (fontsLink) {
        await page.mouse.click(fontsLink.x, fontsLink.y);
        await delay(3000);
      }
    }

    // Process each font
    for (const config of FONT_CONFIG) {
      await setFont(page, config.category, config.font);
      await delay(500);
    }

    await page.screenshot({ path: 'scripts/fonts_final.png' });
    console.log('\n=== ALL FONTS DONE ===');

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
