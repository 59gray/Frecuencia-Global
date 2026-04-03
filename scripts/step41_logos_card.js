const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // First, examine the actual content inside the Logos card
  const cardContent = await page.evaluate(() => {
    // Find Logos text at y > 200
    let logosY = null, logosX = null;
    for (const el of document.querySelectorAll('p, span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own === 'Logos') {
        const r = el.getBoundingClientRect();
        if (r.y > 200 && r.width > 10) { logosY = r.y; logosX = r.x; break; }
      }
    }
    if (!logosY) return { error: 'no logos label' };

    // Find card below
    const cards = [...document.querySelectorAll('[role="button"]')]
      .filter(c => {
        const cr = c.getBoundingClientRect();
        return cr.y > logosY && cr.y < logosY + 100 && Math.abs(cr.x - logosX) < 50 && cr.width > 100;
      });

    if (cards.length === 0) return { error: 'no card found' };
    const card = cards[0];
    const cr = card.getBoundingClientRect();

    // Get card's innerHTML structure
    const children = [];
    function describeNode(node, depth) {
      if (depth > 5) return;
      if (node.nodeType === 3 && node.textContent.trim()) {
        children.push({ type: 'text', content: node.textContent.trim().substring(0, 40), depth });
        return;
      }
      if (node.nodeType !== 1) return;
      const el = node;
      const r = el.getBoundingClientRect();
      children.push({
        type: 'element',
        tag: el.tagName,
        role: el.getAttribute('role') || '',
        label: el.getAttribute('aria-label') || '',
        className: el.className?.toString().substring(0, 30) || '',
        w: Math.round(r.width),
        h: Math.round(r.height),
        depth
      });
      for (const child of el.children) describeNode(child, depth + 1);
    }
    for (const child of card.children) describeNode(child, 0);

    // Also get images inside card
    const imgs = [...card.querySelectorAll('img')].map(i => ({
      src: (i.src || '').substring(0, 80),
      alt: i.alt,
      w: Math.round(i.getBoundingClientRect().width),
      h: Math.round(i.getBoundingClientRect().height)
    }));

    // SVGs inside card
    const svgs = [...card.querySelectorAll('svg')].map(s => ({
      w: Math.round(s.getBoundingClientRect().width),
      h: Math.round(s.getBoundingClientRect().height)
    }));

    return {
      cardRect: { x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height) },
      childCount: card.children.length,
      children,
      imgs,
      svgs,
      innerHTML: card.innerHTML.substring(0, 500)
    };
  });

  console.log('=== LOGOS CARD CONTENT ===');
  console.log('Card rect:', JSON.stringify(cardContent.cardRect));
  console.log('Child count:', cardContent.childCount);
  console.log('\nChildren:');
  (cardContent.children || []).forEach(c => {
    const indent = '  '.repeat(c.depth + 1);
    if (c.type === 'text') console.log(`${indent}[TEXT] "${c.content}"`);
    else console.log(`${indent}[${c.tag}] ${c.w}x${c.h} role="${c.role}" label="${c.label}" class="${c.className}"`);
  });
  console.log('\nImages:', JSON.stringify(cardContent.imgs));
  console.log('SVGs:', JSON.stringify(cardContent.svgs));
  console.log('\nInner HTML (first 500):', cardContent.innerHTML);

  // Now click the card explicitly and check what happens
  console.log('\n=== CLICKING CARD ===');
  if (cardContent.cardRect) {
    await page.mouse.click(cardContent.cardRect.x + 50, cardContent.cardRect.y + 50);
    await delay(3000);
    console.log('URL after click:', page.url());

    // Check for modals/overlays
    const modals = await page.evaluate(() => {
      const results = [];
      for (const el of document.querySelectorAll('[role="dialog"], [role="alertdialog"], [aria-modal="true"]')) {
        const r = el.getBoundingClientRect();
        if (r.width > 50) results.push({ role: el.getAttribute('role'), w: Math.round(r.width), h: Math.round(r.height) });
      }
      // Also check for overlays with high z-index
      for (const el of document.querySelectorAll('div')) {
        const style = window.getComputedStyle(el);
        const z = parseInt(style.zIndex);
        if (z > 100 && el.getBoundingClientRect().width > 200) {
          const text = el.textContent.trim().substring(0, 80);
          if (text && !text.includes('Brand Kit')) {
            results.push({ zIndex: z, text, w: Math.round(el.getBoundingClientRect().width) });
          }
        }
      }
      return results;
    });
    console.log('Modals found:', JSON.stringify(modals));

    // Check for popover/menu that appeared
    const menus = await page.evaluate(() => {
      return [...document.querySelectorAll('[role="menu"], [role="listbox"], [role="dialog"]')]
        .filter(e => e.getBoundingClientRect().width > 50)
        .map(e => ({
          role: e.getAttribute('role'),
          text: e.textContent.trim().substring(0, 100),
          w: Math.round(e.getBoundingClientRect().width)
        }));
    });
    console.log('Menus found:', JSON.stringify(menus));
  }

  // Also try clicking the "More" button next to logos (x=267, y=439)
  console.log('\n=== CLICKING MORE BUTTON ===');
  // Need to figure out which "More" button corresponds to Logos
  // Logos column x~96, More buttons are at x=267 (right edge of first card)
  const logosMoreBtn = await page.evaluate(() => {
    let logosY = null;
    for (const el of document.querySelectorAll('p, span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own === 'Logos') {
        const r = el.getBoundingClientRect();
        if (r.y > 200 && r.width > 10) { logosY = r.y; break; }
      }
    }
    if (!logosY) return null;
    
    // Find "More" button near the Logos card
    for (const btn of document.querySelectorAll('button[aria-label="More"]')) {
      const r = btn.getBoundingClientRect();
      if (r.y > logosY + 30 && r.y < logosY + 80 && r.x < 300) {
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
    }
    return null;
  });

  if (logosMoreBtn) {
    await page.mouse.click(logosMoreBtn.x, logosMoreBtn.y);
    await delay(2000);

    const menuItems = await page.evaluate(() => {
      return [...document.querySelectorAll('[role="menuitem"], [role="option"], [role="menu"] button, [role="menu"] a')]
        .filter(e => e.getBoundingClientRect().width > 50)
        .map(e => ({
          tag: e.tagName,
          text: e.textContent.trim().substring(0, 50),
          label: e.getAttribute('aria-label') || ''
        }));
    });
    console.log('Menu items:', JSON.stringify(menuItems, null, 2));
    
    // Close menu
    await page.keyboard.press('Escape');
    await delay(500);
  } else {
    console.log('Could not find More button for Logos');
  }

  process.exit(0);
})();
