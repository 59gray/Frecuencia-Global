const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Click on the Logos section card (first role="button" DIV under Logos label)
  console.log('Clicking Logos section card...');
  const logoCard = await page.evaluate(() => {
    // Find "Logos" text
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim() === 'Logos') {
        const el = node.parentElement;
        const r = el.getBoundingClientRect();
        if (r.width > 10 && r.y > 200) {
          // The card should be right below this text, at the same x position
          const cards = [...document.querySelectorAll('[role="button"]')]
            .filter(c => {
              const cr = c.getBoundingClientRect();
              return cr.y > r.y && cr.y < r.y + 100 && Math.abs(cr.x - r.x) < 50 && cr.width > 100;
            });
          if (cards.length > 0) {
            const cr = cards[0].getBoundingClientRect();
            return { x: cr.x + cr.width / 2, y: cr.y + cr.height / 2, w: cr.width, h: cr.height };
          }
        }
      }
    }
    return null;
  });

  if (logoCard) {
    console.log(`  Card: ${logoCard.w}x${logoCard.h} at (${logoCard.x}, ${logoCard.y})`);
    await page.mouse.click(logoCard.x, logoCard.y);
    await delay(5000);
    
    console.log(`  New URL: ${page.url()}`);
    
    // Explore the logos page
    const logoPage = await page.evaluate(() => {
      const info = {
        headings: [],
        buttons: [],
        uploadElements: [],
        fileInputs: [],
        allText: []
      };

      for (const h of document.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
        const r = h.getBoundingClientRect();
        if (r.width > 10) info.headings.push({ tag: h.tagName, text: h.textContent.trim().substring(0, 50), y: Math.round(r.y) });
      }

      for (const btn of document.querySelectorAll('button')) {
        const r = btn.getBoundingClientRect();
        if (r.width > 10) {
          const label = btn.getAttribute('aria-label') || '';
          const text = btn.textContent.trim().substring(0, 50);
          if (label || text) info.buttons.push({ label, text, y: Math.round(r.y), x: Math.round(r.x) });
        }
      }

      // File inputs
      for (const inp of document.querySelectorAll('input[type="file"]')) {
        info.fileInputs.push({ accept: inp.accept, name: inp.name, id: inp.id });
      }

      // Elements with upload/drag/drop text
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (text && (text.toLowerCase().includes('upload') || text.toLowerCase().includes('drag') || 
                     text.toLowerCase().includes('drop') || text.toLowerCase().includes('add logo') ||
                     text.toLowerCase().includes('add a logo'))) {
          const el = node.parentElement;
          const r = el.getBoundingClientRect();
          if (r.width > 10) {
            info.uploadElements.push({ text: text.substring(0, 60), tag: el.tagName, y: Math.round(r.y) });
          }
        }
      }

      // All visible text in the main area
      for (const el of document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, label')) {
        const r = el.getBoundingClientRect();
        if (r.width > 10 && r.y > 50 && r.y < 800 && r.x > 60) {
          const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
          if (text) info.allText.push({ text: text.substring(0, 60), y: Math.round(r.y) });
        }
      }

      return info;
    });

    console.log('\nHeadings:');
    logoPage.headings.forEach(h => console.log(`  [${h.tag}] y=${h.y}: ${h.text}`));
    console.log('\nButtons:');
    logoPage.buttons.forEach(b => console.log(`  y=${b.y} x=${b.x}: label="${b.label}" text="${b.text}"`));
    console.log('\nFile inputs:');
    logoPage.fileInputs.forEach(f => console.log(`  ${JSON.stringify(f)}`));
    console.log('\nUpload elements:');
    logoPage.uploadElements.forEach(u => console.log(`  ${u.text}`));
    console.log('\nAll visible text:');
    logoPage.allText.forEach(t => console.log(`  y=${t.y}: ${t.text}`));
  } else {
    console.log('  Could not find logo card');
  }

  process.exit(0);
})();
