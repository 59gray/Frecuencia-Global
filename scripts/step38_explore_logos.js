const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const BRAND_KIT_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto(BRAND_KIT_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await delay(1000);
    if (await page.evaluate(() => (document.body.textContent || '').includes('Brand Kit'))) break;
  }
  await delay(3000);

  // Explore the page structure - look for logo section
  const structure = await page.evaluate(() => {
    const info = {
      headings: [],
      buttons: [],
      links: [],
      sections: [],
      uploadAreas: []
    };

    // Find headings
    for (const h of document.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      const r = h.getBoundingClientRect();
      if (r.width > 10) info.headings.push({ tag: h.tagName, text: h.textContent.trim().substring(0, 80), y: Math.round(r.y) });
    }

    // Find buttons
    for (const btn of document.querySelectorAll('button')) {
      const r = btn.getBoundingClientRect();
      if (r.width > 10 && r.height > 10) {
        const label = btn.getAttribute('aria-label') || '';
        const text = btn.textContent.trim().substring(0, 50);
        if (label || text) {
          info.buttons.push({ label, text, y: Math.round(r.y), x: Math.round(r.x) });
        }
      }
    }

    // Find links
    for (const a of document.querySelectorAll('a')) {
      const r = a.getBoundingClientRect();
      if (r.width > 10) {
        const text = a.textContent.trim().substring(0, 50);
        const href = a.getAttribute('href') || '';
        if (text && (text.toLowerCase().includes('logo') || href.includes('logo') || 
                     text.toLowerCase().includes('upload') || text.toLowerCase().includes('brand'))) {
          info.links.push({ text, href: href.substring(0, 80), y: Math.round(r.y) });
        }
      }
    }

    // Find anything with "logo" in it
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.toLowerCase().includes('logo')) {
        const el = node.parentElement;
        const r = el.getBoundingClientRect();
        if (r.width > 10) {
          info.sections.push({ text: el.textContent.trim().substring(0, 80), tag: el.tagName, y: Math.round(r.y) });
        }
      }
    }

    // Find file inputs/drop areas
    for (const inp of document.querySelectorAll('input[type="file"]')) {
      info.uploadAreas.push({ type: 'file_input', accept: inp.accept });
    }

    // Check for drag/drop areas
    for (const el of document.querySelectorAll('[role="button"]')) {
      const text = el.textContent.trim();
      if (text.includes('Upload') || text.includes('upload') || text.includes('drag') || text.includes('Drop')) {
        const r = el.getBoundingClientRect();
        info.uploadAreas.push({ type: 'role_button', text: text.substring(0, 50), y: Math.round(r.y) });
      }
    }

    return info;
  });

  console.log('=== PAGE STRUCTURE ===');
  console.log('\nHeadings:');
  structure.headings.forEach(h => console.log(`  [${h.tag}] y=${h.y}: ${h.text}`));
  console.log('\nButtons:');
  structure.buttons.forEach(b => console.log(`  y=${b.y} x=${b.x}: label="${b.label}" text="${b.text}"`));
  console.log('\nLogo-related elements:');
  structure.sections.forEach(s => console.log(`  [${s.tag}] y=${s.y}: ${s.text}`));
  console.log('\nBrand/Logo links:');
  structure.links.forEach(l => console.log(`  y=${l.y}: "${l.text}" → ${l.href}`));
  console.log('\nUpload areas:');
  structure.uploadAreas.forEach(u => console.log(`  ${JSON.stringify(u)}`));
  
  // Also get the full URL and page title
  console.log(`\nCurrent URL: ${page.url()}`);
  console.log(`Page title: ${await page.title()}`);

  process.exit(0);
})();
