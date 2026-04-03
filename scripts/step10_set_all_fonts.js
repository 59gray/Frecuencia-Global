const puppeteer = require('puppeteer-core');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Font assignments for all categories
const FONT_CONFIG = [
  { category: 'Title',          font: 'Bebas Neue' },
  { category: 'Subtitle',       font: 'Space Grotesk' },
  { category: 'Heading',        font: 'Bebas Neue' },
  { category: 'Subheading',     font: 'Space Grotesk' },
  { category: 'Section header', font: 'Space Grotesk' },
  { category: 'Body',           font: 'Space Grotesk' },
  { category: 'Quote',          font: 'Space Grotesk' },
  { category: 'Caption',        font: 'JetBrains Mono' },
];

async function findFontRows(page) {
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
          results.push({
            label: ownText,
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
}

async function setFont(page, categoryLabel, fontName) {
  console.log(`\n=== Setting "${categoryLabel}" → ${fontName} ===`);
  
  // Find and click the category row
  const rows = await findFontRows(page);
  const row = rows.find(r => r.label === categoryLabel);
  if (!row) {
    console.log(`ERROR: Row "${categoryLabel}" not found! Available: ${rows.map(r=>r.label).join(', ')}`);
    return false;
  }
  
  // Click on the row text
  await page.mouse.click(row.x + 10, row.y + row.h / 2);
  await delay(2000);
  
  // Check if the font dropdown is showing and what font is currently set
  const currentFont = await page.evaluate(() => {
    // Look for a dropdown/select element with font name
    const spans = document.querySelectorAll('span, button, div');
    for (const el of spans) {
      const rect = el.getBoundingClientRect();
      // Font dropdown should be in the expanded row area (around y 270-280, small width)
      if (rect.y > 250 && rect.y < 320 && rect.x > 320 && rect.x < 450 && rect.width > 50 && rect.width < 200) {
        const text = el.textContent?.trim();
        if (text && !['Font', 'Heading type', 'Size', 'Title', 'Subtitle', 'Heading', 'Subheading', 'Body', 'Quote', 'Caption', 'Section header'].includes(text)) {
          return { text, x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
        }
      }
    }
    return null;
  });
  
  console.log('Current font:', currentFont);
  
  // If already the right font, just confirm
  if (currentFont && currentFont.text.includes(fontName.split(' ')[0])) {
    console.log(`Already set to ${fontName}, confirming...`);
    // Click checkmark
    const checkBtn = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, [role="button"]');
      for (const btn of btns) {
        const rect = btn.getBoundingClientRect();
        const label = btn.getAttribute('aria-label') || '';
        // Checkmark button is near the right side of the expanded row
        if (rect.x > 1400 && rect.y > 280 && rect.y < 360 && rect.width < 60) {
          return { x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2), label };
        }
      }
      return null;
    });
    if (checkBtn) {
      await page.mouse.click(checkBtn.x, checkBtn.y);
      await delay(1500);
    }
    return true;
  }
  
  // Need to change font - click the font dropdown
  // Look for the font dropdown button
  const fontDropdown = await page.evaluate(() => {
    const all = document.querySelectorAll('button, [role="button"], [role="combobox"]');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      const text = el.textContent?.trim() || '';
      // Font dropdown is usually in the first column, around the expanded area
      if (rect.y > 250 && rect.y < 320 && rect.x > 300 && rect.x < 500 && rect.width > 80 && rect.width < 250) {
        return { text, x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), tag: el.tagName };
      }
    }
    return null;
  });
  
  console.log('Font dropdown:', fontDropdown);
  
  if (fontDropdown) {
    await page.mouse.click(fontDropdown.x + fontDropdown.w / 2, fontDropdown.y + fontDropdown.h / 2);
    await delay(2000);
    
    await page.screenshot({ path: `scripts/font_dropdown_${categoryLabel.replace(/ /g,'_')}.png` });
    
    // Look for a search input in the font picker
    const searchInput = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      for (const inp of inputs) {
        const rect = inp.getBoundingClientRect();
        if (rect.width > 100 && (inp.placeholder?.toLowerCase().includes('search') || inp.getAttribute('aria-label')?.toLowerCase().includes('search') || inp.type === 'search' || inp.type === 'text')) {
          return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), placeholder: inp.placeholder };
        }
      }
      return null;
    });
    
    console.log('Search input:', searchInput);
    
    if (searchInput) {
      // Type the font name
      await page.mouse.click(searchInput.x + searchInput.w / 2, searchInput.y + searchInput.h / 2);
      await delay(300);
      await page.keyboard.type(fontName, { delay: 80 });
      await delay(2000);
      
      // Screenshot after search
      await page.screenshot({ path: `scripts/font_search_${categoryLabel.replace(/ /g,'_')}.png` });
      
      // Click the first result
      const firstResult = await page.evaluate((fontName) => {
        // Look for font options/results
        const all = document.querySelectorAll('button, [role="option"], [role="menuitem"], li, div');
        for (const el of all) {
          const text = el.textContent?.trim();
          if (text && text.includes(fontName) && !text.includes('Search')) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 100 && rect.height > 20 && rect.height < 80) {
              return { text: text.substring(0, 50), x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2) };
            }
          }
        }
        return null;
      }, fontName);
      
      console.log('First search result:', firstResult);
      
      if (firstResult) {
        await page.mouse.click(firstResult.x, firstResult.y);
        await delay(2000);
      } else {
        console.log('No search results found for:', fontName);
        // Press Escape to close
        await page.keyboard.press('Escape');
        await delay(1000);
      }
    }
  }
  
  // Confirm with checkmark
  const checkBtn = await page.evaluate(() => {
    const btns = document.querySelectorAll('button, [role="button"]');
    for (const btn of btns) {
      const rect = btn.getBoundingClientRect();
      const svg = btn.querySelector('svg');
      // Checkmark/confirm button - right side of expanded row, small
      if (rect.x > 1400 && rect.y > 280 && rect.y < 380 && rect.width < 60 && rect.height < 60) {
        return { x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2) };
      }
    }
    return null;
  });
  
  if (checkBtn) {
    console.log('Clicking confirm at:', checkBtn);
    await page.mouse.click(checkBtn.x, checkBtn.y);
    await delay(1500);
  } else {
    console.log('Confirm button not found');
  }
  
  return true;
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

    // Ensure we're on fonts page
    const fontsUrl = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';
    if (!page.url().includes('IG-Fxa2jz9CwFFe')) {
      await page.goto(fontsUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      await delay(2000);
    }

    // First, close any open editor by clicking somewhere neutral  
    await page.mouse.click(900, 197);
    await delay(1000);

    // Process each font category
    for (const config of FONT_CONFIG) {
      await setFont(page, config.category, config.font);
      // Wait and scroll back to top if needed
      await page.evaluate(() => window.scrollTo(0, 0));
      await delay(500);
    }

    // Final screenshot
    await page.screenshot({ path: 'scripts/fonts_final.png' });
    
    // Report
    console.log('\n=== DONE ===');
    const pageText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
    console.log(pageText.substring(0, 1500));

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
