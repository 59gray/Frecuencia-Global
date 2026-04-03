const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate to Brand Kit main page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  console.log('URL:', page.url());

  // Map all category sections and find their ingredient links
  const categoryMap = await page.evaluate(() => {
    const categories = ['Logos', 'Colors', 'Fonts', 'Brand voice', 'Photos', 'Graphics', 'Icons', 'Charts'];
    const results = {};

    for (const cat of categories) {
      const label = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === cat);
      if (!label) {
        results[cat] = { found: false };
        continue;
      }

      const r = label.getBoundingClientRect();
      
      // Walk up to the role="group" container
      let group = label;
      for (let i = 0; i < 10; i++) {
        group = group.parentElement;
        if (!group) break;
        if (group.getAttribute('role') === 'group') break;
      }

      // Find the card (role="button") inside the group
      let cardInfo = null;
      if (group && group.getAttribute('role') === 'group') {
        const card = group.querySelector('[role="button"]');
        if (card) {
          const cr = card.getBoundingClientRect();
          // Check if card has content (images, text)
          const imgs = card.querySelectorAll('img');
          const hasContent = card.textContent.trim().length > 0 || imgs.length > 0;
          cardInfo = {
            y: Math.round(cr.y),
            x: Math.round(cr.x),
            w: Math.round(cr.width),
            h: Math.round(cr.height),
            hasContent,
            imgCount: imgs.length,
            text: card.textContent.trim().substring(0, 50)
          };
        }
      }

      results[cat] = {
        found: true,
        labelY: Math.round(r.y),
        labelX: Math.round(r.x),
        card: cardInfo
      };
    }

    return results;
  });

  console.log('\n=== BRAND KIT CATEGORIES ===');
  for (const [cat, info] of Object.entries(categoryMap)) {
    if (info.found) {
      const card = info.card;
      const status = card ? (card.hasContent ? `HAS CONTENT (${card.imgCount} imgs, "${card.text}")` : 'EMPTY') : 'NO CARD';
      console.log(`  ${cat}: label at y=${info.labelY} — ${status}`);
    } else {
      console.log(`  ${cat}: NOT FOUND`);
    }
  }

  // Now try navigating to each target section to check current state
  const targets = ['Brand voice', 'Photos', 'Graphics', 'Icons', 'Charts'];
  
  for (const target of targets) {
    console.log(`\n--- Checking "${target}" ---`);
    
    // Go back to main page
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(3000);

    // Click the card using React dispatch
    const clicked = await page.evaluate((targetCat) => {
      const label = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === targetCat);
      if (!label) return { error: 'Label not found' };

      let group = label;
      for (let i = 0; i < 10; i++) {
        group = group.parentElement;
        if (!group) break;
        if (group.getAttribute('role') === 'group') break;
      }
      if (!group || group.getAttribute('role') !== 'group') return { error: 'Group not found' };

      const card = group.querySelector('[role="button"]');
      if (!card) return { error: 'Card not found' };

      const r = card.getBoundingClientRect();
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };

      card.dispatchEvent(new PointerEvent('pointerdown', opts));
      card.dispatchEvent(new MouseEvent('mousedown', opts));
      card.dispatchEvent(new PointerEvent('pointerup', opts));
      card.dispatchEvent(new MouseEvent('mouseup', opts));
      card.dispatchEvent(new MouseEvent('click', opts));

      return { ok: true, cy: Math.round(cy) };
    }, target);

    console.log(`  Click result:`, JSON.stringify(clicked));
    await delay(5000);

    const ingredientURL = page.url();
    console.log(`  URL: ${ingredientURL}`);
    console.log(`  Title: ${await page.title()}`);

    // Check page content
    const content = await page.evaluate(() => {
      const main = document.querySelector('[role="main"]');
      const mainText = main?.textContent?.trim().substring(0, 500) || '';
      
      const buttons = [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({
        text: b.textContent.trim().substring(0, 50),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(b.getBoundingClientRect().y)
      }));

      const textareas = [...document.querySelectorAll('textarea')].map(t => ({
        value: t.value?.substring(0, 100) || '',
        placeholder: t.placeholder?.substring(0, 60) || '',
        w: Math.round(t.getBoundingClientRect().width)
      }));

      const inputs = [...document.querySelectorAll('input')].map(i => ({
        type: i.type,
        value: i.value?.substring(0, 50) || '',
        placeholder: i.placeholder?.substring(0, 50) || ''
      }));

      // Check for existing guidelines text
      const guidelineTexts = [];
      for (const el of document.querySelectorAll('p, span, div')) {
        const text = el.textContent.trim();
        if (text.length > 30 && text.length < 600 && el.children.length < 3) {
          const r = el.getBoundingClientRect();
          if (r.y > 200 && r.y < 800 && r.width > 100) {
            guidelineTexts.push({
              tag: el.tagName,
              text: text.substring(0, 150),
              y: Math.round(r.y)
            });
          }
        }
      }

      return { mainText, buttons, textareas, inputs, guidelineTexts };
    });

    console.log(`  Main text: "${content.mainText.substring(0, 200)}"`);
    console.log(`  Buttons:`, content.buttons.filter(b => b.y > 150).map(b => `y=${b.y} "${b.label || b.text}"`).join(', '));
    if (content.textareas.length) console.log(`  Textareas:`, JSON.stringify(content.textareas));
    if (content.guidelineTexts.length) {
      console.log(`  Existing guidelines:`);
      content.guidelineTexts.forEach(g => console.log(`    [${g.tag}] y=${g.y}: "${g.text}"`));
    }
  }

  process.exit(0);
})();
