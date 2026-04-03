const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  
  // APPROACH 1: Navigate directly to fonts ingredient URL and wait much longer
  console.log('=== APPROACH 1: Direct navigation with long wait ===');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe', { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Poll for content to appear (up to 30s)
  for (let i = 0; i < 30; i++) {
    await delay(1000);
    const hasContent = await page.evaluate(() => {
      return document.body.textContent.includes('Subtitle') || document.body.textContent.includes('Heading');
    });
    if (hasContent) {
      console.log(`Content appeared after ${i + 1}s`);
      break;
    }
    if (i === 14) console.log('Still waiting (15s)...');
    if (i === 29) console.log('Timeout: 30s without content');
  }
  
  console.log('URL:', page.url());
  await page.screenshot({ path: 'scripts/diag22_direct.png' });
  
  // Check for sidebar nav too
  const sidebarItems = await page.evaluate(() => {
    const items = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      const r = el.getBoundingClientRect();
      if (r.x > 60 && r.x < 250 && r.y > 100 && r.y < 800 && r.width > 30 && r.width < 200) {
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').trim();
        if (ownText && ownText.length > 2 && ownText.length < 30) {
          items.push({ text: ownText, x: Math.round(r.x), y: Math.round(r.y), tag: el.tagName });
        }
      }
    }
    return items;
  });
  
  console.log('\nSidebar items:');
  for (const s of sidebarItems) console.log(`  (${s.x},${s.y}) ${s.tag} "${s.text}"`);
  
  // Check main content
  const mainContent = await page.evaluate(() => {
    const items = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      const r = el.getBoundingClientRect();
      if (r.x > 250 && r.y > 100 && r.y < 1000 && r.width > 30) {
        const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').trim();
        if (ownText && ownText.length > 2 && ownText.length < 40) {
          items.push({ text: ownText, x: Math.round(r.x), y: Math.round(r.y), tag: el.tagName });
        }
      }
    }
    return items;
  });
  
  console.log('\nMain content:');
  for (const m of mainContent) console.log(`  (${m.x},${m.y}) ${m.tag} "${m.text}"`);

  // APPROACH 2: If direct nav failed, try clicking the card with dispatchEvent
  const hasContent = mainContent.some(m => m.text === 'Subtitle' || m.text === 'Heading');
  if (!hasContent) {
    console.log('\n=== APPROACH 2: Navigate to brand kit, then dispatch click ===');
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle2', timeout: 45000 });
    await delay(6000);
    
    // Find the Fonts card group div and dispatch a click event
    const clicked = await page.evaluate(() => {
      const allP = document.querySelectorAll('p');
      for (const p of allP) {
        if (p.textContent.trim() === 'Fonts') {
          // Find the role="group" ancestor
          let el = p;
          while (el.parentElement) {
            el = el.parentElement;
            if (el.getAttribute('role') === 'group') {
              const r = el.getBoundingClientRect();
              // Dispatch click
              const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: r.x + r.width / 2,
                clientY: r.y + r.height / 2,
              });
              el.dispatchEvent(event);
              return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            }
          }
        }
      }
      return null;
    });
    
    if (clicked) {
      console.log(`Dispatched click at (${clicked.x|0}, ${clicked.y|0})`);
      await delay(8000);
      console.log('After dispatch URL:', page.url());
      await page.screenshot({ path: 'scripts/diag22_dispatch.png' });
      
      const hasContent2 = await page.evaluate(() => document.body.textContent.includes('Subtitle'));
      console.log('Has Subtitle:', hasContent2);
    }
  }
  
  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
