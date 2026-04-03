const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

const SECTIONS = [
  { name: 'Brand voice', id: 'IG-Fxa2jz9fRIO_' },
  { name: 'Graphics',    id: 'IG-Fxa2jz9x-Pgo' },
  { name: 'Icons',       id: 'IG-Fxa2jz9WINe6' },
  { name: 'Charts',      id: 'IG-Fxa2jz9_o_EG' }
];

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  for (const section of SECTIONS) {
    const url = `https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/${section.id}`;
    console.log(`\n========== ${section.name} ==========`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(8000);

    const content = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText,
        elemCount: document.querySelectorAll('*').length
      };
    });

    console.log(`Title: ${content.title}`);
    console.log(`Elements: ${content.elemCount}`);
    
    // Filter meaningful lines
    const lines = content.bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
    // Skip navigation lines
    const skip = ['Skip navigation', 'Skip to main', 'Skip to header', 'Skip to "Help"', 
                  'Create', 'Home', 'Projects', 'Templates', 'Brand', 'Canva AI', 'Print Shop', 
                  'Approvals', 'More', 'More account and team options', 'Main content',
                  'Help Assistant', 'Brand Kit actions'];
    const meaningful = lines.filter(l => !skip.some(s => l === s));
    
    console.log(`\nContent (${meaningful.length} lines):`);
    meaningful.forEach(l => console.log(`  "${l.substring(0, 150)}"`));
  }

  // Now find Photos - go to main page and discover it
  console.log('\n========== Photos (discovering URL) ==========');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Scroll down to make Photos visible
  await page.evaluate(() => window.scrollBy(0, 300));
  await delay(1000);

  // Find Photos and click it
  const photosClick = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('p')];
    const photosLabel = labels.find(el => el.textContent.trim() === 'Photos');
    if (!photosLabel) return { error: 'Photos label not found at all' };
    
    // Walk up to role="group"
    let group = photosLabel;
    for (let i = 0; i < 10; i++) {
      group = group.parentElement;
      if (!group) break;
      if (group.getAttribute('role') === 'group') break;
    }
    if (!group || group.getAttribute('role') !== 'group') return { error: 'No group found for Photos' };

    const btn = group.querySelector('[role="button"]');
    if (!btn) return { error: 'No role=button in Photos group' };

    const r = btn.getBoundingClientRect();
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };
    btn.dispatchEvent(new PointerEvent('pointerdown', opts));
    btn.dispatchEvent(new MouseEvent('mousedown', opts));
    btn.dispatchEvent(new PointerEvent('pointerup', opts));
    btn.dispatchEvent(new MouseEvent('mouseup', opts));
    btn.dispatchEvent(new MouseEvent('click', opts));
    return { clicked: true };
  });

  if (photosClick.error) {
    console.log(`ERROR: ${photosClick.error}`);
  } else {
    await delay(8000);
    const photosUrl = page.url();
    const photosId = photosUrl.match(/ingredient\/([\w-]+)/)?.[1] || 'unknown';
    console.log(`URL: ${photosUrl}`);
    console.log(`Ingredient ID: ${photosId}`);

    const content = await page.evaluate(() => {
      return { title: document.title, bodyText: document.body.innerText };
    });

    console.log(`Title: ${content.title}`);
    const lines = content.bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
    const skip = ['Skip navigation', 'Skip to main', 'Skip to header', 'Skip to "Help"', 
                  'Create', 'Home', 'Projects', 'Templates', 'Brand', 'Canva AI', 'Print Shop', 
                  'Approvals', 'More', 'More account and team options', 'Main content',
                  'Help Assistant', 'Brand Kit actions'];
    const meaningful = lines.filter(l => !skip.some(s => l === s));
    console.log(`\nContent (${meaningful.length} lines):`);
    meaningful.forEach(l => console.log(`  "${l.substring(0, 150)}"`));
  }

  process.exit(0);
})();
