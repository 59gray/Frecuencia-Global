const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  let browser;
  try {
    browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  } catch (e) {
    console.log('CHROME_NOT_CONNECTED:', e.message);
    process.exit(1);
  }
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  console.log('Connected. Current URL:', page.url());

  // Go to Brand Kit main page and map everything
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(8000);

  // Get all category sections and their content state
  const state = await page.evaluate(() => {
    // Find all category labels
    const categories = ['Logos', 'Colors', 'Fonts', 'Brand voice', 'Photos', 'Graphics', 'Icons', 'Charts'];
    const result = {};

    for (const cat of categories) {
      const label = [...document.querySelectorAll('p, span')].find(el => 
        el.textContent.trim() === cat && el.children.length === 0
      );
      if (label) {
        const r = label.getBoundingClientRect();
        // Find the parent group
        let group = label;
        for (let i = 0; i < 10; i++) {
          group = group.parentElement;
          if (!group) break;
          if (group.getAttribute('role') === 'group') break;
        }
        
        let hasContent = false;
        let contentInfo = '';
        if (group) {
          // Check for images (logos, photos, graphics)
          const imgs = group.querySelectorAll('img');
          // Check for text content beyond the label
          const groupText = group.textContent.trim().replace(cat, '').trim();
          hasContent = imgs.length > 0 || groupText.length > 10;
          contentInfo = `imgs=${imgs.length}, extraText=${groupText.substring(0, 80)}`;
        }
        
        result[cat] = {
          y: Math.round(r.y),
          x: Math.round(r.x),
          hasContent,
          contentInfo
        };
      } else {
        result[cat] = { found: false };
      }
    }
    
    return result;
  });

  console.log('\n=== BRAND KIT OVERVIEW ===');
  for (const [cat, info] of Object.entries(state)) {
    console.log(`${cat}: ${info.found === false ? 'LABEL NOT FOUND' : `y=${info.y} hasContent=${info.hasContent} - ${info.contentInfo}`}`);
  }

  // Now scroll down and check remaining categories
  await page.evaluate(() => window.scrollBy(0, 400));
  await delay(2000);

  const state2 = await page.evaluate(() => {
    const categories = ['Brand voice', 'Photos', 'Graphics', 'Icons', 'Charts'];
    const result = {};
    
    for (const cat of categories) {
      const label = [...document.querySelectorAll('p, span')].find(el => 
        el.textContent.trim() === cat && el.children.length === 0
      );
      if (label) {
        const r = label.getBoundingClientRect();
        let group = label;
        for (let i = 0; i < 10; i++) {
          group = group.parentElement;
          if (!group) break;
          if (group.getAttribute('role') === 'group') break;
        }
        
        let hasContent = false;
        let contentInfo = '';
        if (group) {
          const imgs = group.querySelectorAll('img');
          const groupText = group.textContent.trim().replace(cat, '').trim();
          // Check for "Add brand assets" CTA (means empty)
          const hasAddBtn = group.querySelector('button') !== null;
          const btnTexts = [...group.querySelectorAll('button')].map(b => b.textContent.trim()).join(', ');
          hasContent = imgs.length > 0 || (groupText.length > 20 && !groupText.includes('Add brand assets'));
          contentInfo = `imgs=${imgs.length}, text="${groupText.substring(0, 80)}", buttons="${btnTexts}"`;
        }
        
        result[cat] = {
          y: Math.round(r.y),
          visible: r.y > 0 && r.y < 800,
          hasContent,
          contentInfo
        };
      }
    }
    return result;
  });

  console.log('\nAfter scroll:');
  for (const [cat, info] of Object.entries(state2)) {
    console.log(`${cat}: visible=${info.visible} hasContent=${info.hasContent} - ${info.contentInfo}`);
  }

  // Scroll more to see Icons and Charts
  await page.evaluate(() => window.scrollBy(0, 400));
  await delay(2000);

  const state3 = await page.evaluate(() => {
    const categories = ['Icons', 'Charts'];
    const result = {};
    
    for (const cat of categories) {
      const label = [...document.querySelectorAll('p, span')].find(el => 
        el.textContent.trim() === cat && el.children.length === 0
      );
      if (label) {
        const r = label.getBoundingClientRect();
        let group = label;
        for (let i = 0; i < 10; i++) {
          group = group.parentElement;
          if (!group) break;
          if (group.getAttribute('role') === 'group') break;
        }
        
        let hasContent = false;
        let contentInfo = '';
        if (group) {
          const imgs = group.querySelectorAll('img');
          const groupText = group.textContent.trim().replace(cat, '').trim();
          const btnTexts = [...group.querySelectorAll('button')].map(b => b.textContent.trim()).join(', ');
          hasContent = imgs.length > 0 || (groupText.length > 20 && !groupText.includes('Add brand assets'));
          contentInfo = `imgs=${imgs.length}, text="${groupText.substring(0, 80)}", buttons="${btnTexts}"`;
        }
        
        result[cat] = {
          y: Math.round(r.y),
          visible: r.y > 0 && r.y < 800,
          hasContent,
          contentInfo
        };
      }
    }
    return result;
  });

  console.log('\nAfter second scroll:');
  for (const [cat, info] of Object.entries(state3)) {
    console.log(`${cat}: visible=${info.visible} hasContent=${info.hasContent} - ${info.contentInfo}`);
  }

  process.exit(0);
})();
