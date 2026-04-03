const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate to main Brand Kit page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(8000);

  // Get all visible text and elements with their positions to map the page
  const map = await page.evaluate(() => {
    const visibleElements = [];
    
    // Get all visible text nodes and their positions
    function getElementInfo(el) {
      const r = el.getBoundingClientRect();
      if (r.width < 5 || r.height < 5 || r.y > 3000) return null;
      const text = el.textContent.trim();
      if (!text && el.tagName !== 'IMG') return null;
      
      return {
        tag: el.tagName,
        role: el.getAttribute('role') || '',
        label: el.getAttribute('aria-label') || '',
        text: text.substring(0, 60),
        y: Math.round(r.y),
        x: Math.round(r.x),
        w: Math.round(r.width),
        h: Math.round(r.height),
        children: el.children.length
      };
    }

    // Walk all elements that are section-like or labels
    const sections = [];
    for (const el of document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"], label, span, p, div')) {
      const r = el.getBoundingClientRect();
      if (r.width < 10 || r.y > 3000) continue;
      const text = el.textContent.trim();
      if (text.length < 2 || text.length > 100) continue;
      if (el.children.length > 3) continue; // Skip containers with many children
      
      sections.push({
        tag: el.tagName,
        text: text,
        y: Math.round(r.y),
        x: Math.round(r.x),
        w: Math.round(r.width),
        h: Math.round(r.height),
        role: el.getAttribute('role') || '',
        level: el.getAttribute('aria-level') || ''
      });
    }

    // Sort by y position, deduplicate
    sections.sort((a, b) => a.y - b.y);
    
    // Get all buttons with positions
    const buttons = [...document.querySelectorAll('button')].map(b => {
      const r = b.getBoundingClientRect();
      return {
        text: b.textContent.trim().substring(0, 50),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(r.y),
        x: Math.round(r.x),
        visible: r.width > 0
      };
    }).filter(b => b.visible);

    // Get all links
    const links = [...document.querySelectorAll('a')].map(a => {
      const r = a.getBoundingClientRect();
      return {
        text: a.textContent.trim().substring(0, 50),
        href: a.href?.substring(0, 80) || '',
        y: Math.round(r.y),
        x: Math.round(r.x),
        visible: r.width > 0
      };
    }).filter(l => l.visible);

    return { sections: sections.slice(0, 60), buttons, links: links.slice(0, 30), totalElements: document.querySelectorAll('*').length };
  });

  console.log('=== BRAND KIT MAIN PAGE MAP ===');
  console.log('Total elements:', map.totalElements);
  
  console.log('\nSections/Labels (by Y position):');
  map.sections.forEach(s => console.log(`  y=${s.y} x=${s.x} [${s.tag}${s.role?' role='+s.role:''}${s.level?' level='+s.level:''}] ${s.w}x${s.h}: "${s.text}"`));

  console.log('\nButtons:');
  map.buttons.forEach(b => console.log(`  y=${b.y} x=${b.x}: label="${b.label}" text="${b.text}"`));

  console.log('\nLinks:');
  map.links.forEach(l => console.log(`  y=${l.y} x=${l.x}: "${l.text}" → ${l.href}`));

  // Now scroll down to see if there's more content
  console.log('\n--- Scrolling down ---');
  await page.evaluate(() => window.scrollBy(0, 500));
  await delay(2000);

  const afterScroll = await page.evaluate(() => {
    const items = [];
    for (const el of document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"], button, a, label, span, p')) {
      const r = el.getBoundingClientRect();
      if (r.width < 10 || r.y < 0 || r.y > 2000) continue;
      const text = el.textContent.trim();
      if (text.length < 2 || text.length > 100) continue;
      if (el.children.length > 3) continue;
      items.push({
        tag: el.tagName,
        text: text,
        y: Math.round(r.y),
        x: Math.round(r.x)
      });
    }
    items.sort((a, b) => a.y - b.y);
    return items.slice(0, 40);
  });

  console.log('\nAfter scroll (top 40 items):');
  afterScroll.forEach(i => console.log(`  y=${i.y} x=${i.x} [${i.tag}]: "${i.text}"`));

  process.exit(0);
})();
