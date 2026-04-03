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

    // Wait for the page to fully load - wait for "Fonts" text to appear
    console.log('Waiting for page to load...');
    console.log('Current URL:', page.url());
    
    // If not on fonts page, navigate
    if (!page.url().includes('brand')) {
      await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 30000 });
    }
    
    // Wait for content to load by polling
    for (let i = 0; i < 15; i++) {
      const hasContent = await page.evaluate(() => {
        return document.body.innerText.includes('Brand Kit') && document.body.innerText.includes('Fonts');
      });
      if (hasContent) {
        console.log('Page loaded!');
        break;
      }
      console.log(`Waiting... attempt ${i+1}`);
      await delay(2000);
    }

    // Click "Fonts" in sidebar
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
      console.log('Clicking Fonts sidebar...');
      await page.mouse.click(fontsLink.x, fontsLink.y);
      await delay(5000);
    }

    // Check for any pending "Discard" dialog 
    const discardBtn = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent?.trim() === 'Discard') {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0) return { x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2) };
        }
      }
      return null;
    });
    if (discardBtn) {
      console.log('Discarding pending changes...');
      await page.mouse.click(discardBtn.x, discardBtn.y);
      await delay(2000);
    }

    await page.screenshot({ path: 'scripts/fonts_ready.png' });

    // Now find font rows
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
            results.push({ label: ownText, x: Math.round(rect.x), y: Math.round(rect.y), h: Math.round(rect.height) });
          }
        }
      }
      return results;
    });
    console.log('Font rows:', rows.map(r => `${r.label}@y=${r.y}`).join(', '));

    if (rows.length === 0) {
      console.log('No font rows found. Page text:');
      const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
      console.log(text.substring(0, 1000));
    }

    // Click on "Subtitle" row
    const row = rows.find(r => r.label === 'Subtitle');
    if (row) {
      console.log(`\nClicking ${row.label} at (${row.x + 10}, ${row.y + row.h/2})`);
      await page.mouse.click(row.x + 10, row.y + row.h / 2);
      await delay(3000);
      await page.screenshot({ path: 'scripts/subtitle_open.png' });

      // Now dump every element in the expanded area 
      const allEls = await page.evaluate(() => {
        const results = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          // Look in the expanded font editor area
          if (rect.width > 30 && rect.height > 10 && rect.height < 50 && rect.y > 250 && rect.y < 400 && rect.x > 300 && rect.x < 700) {
            const text = el.textContent?.trim()?.substring(0, 60) || '';
            const tag = el.tagName;
            const role = el.getAttribute('role') || '';
            const ariaLabel = el.getAttribute('aria-label') || '';
            const ariaHaspopup = el.getAttribute('aria-haspopup') || '';
            // Skip duplicates
            if (['SCRIPT', 'STYLE', 'LINK', 'META', 'MAIN', 'NAV', 'ASIDE'].includes(tag)) continue;
            results.push({
              tag, text, role, ariaLabel, ariaHaspopup,
              x: Math.round(rect.x), y: Math.round(rect.y),
              w: Math.round(rect.width), h: Math.round(rect.height),
            });
          }
        }
        return results;
      });
      console.log(`\nElements in expanded area (y 250-400, x 300-700):`);
      allEls.forEach((e, i) => console.log(`  ${i}: ${e.tag} "${e.text}" role="${e.role}" aria-label="${e.ariaLabel}" popup="${e.ariaHaspopup}" (${e.x},${e.y}) ${e.w}x${e.h}`));
    }

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
