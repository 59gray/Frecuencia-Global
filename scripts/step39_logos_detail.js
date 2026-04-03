const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate to brand kit
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Explore the Logos section area (y around 393)
  const logoArea = await page.evaluate(() => {
    const result = { logoSection: null, nearbyElements: [], allInteractiveInRegion: [] };
    
    // Find the Logos text
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim() === 'Logos') {
        const el = node.parentElement;
        const r = el.getBoundingClientRect();
        if (r.width > 10 && r.y > 200) {
          result.logoSection = { tag: el.tagName, y: Math.round(r.y), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) };
          break;
        }
      }
    }
    
    if (!result.logoSection) return result;
    const logoY = result.logoSection.y;
    
    // Get all elements in the Y range [logoY - 20, logoY + 250]
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width < 5 || r.height < 5) continue;
      if (r.y < logoY - 30 || r.y > logoY + 250) continue;
      
      const tag = el.tagName;
      const text = el.textContent.trim().substring(0, 60);
      const role = el.getAttribute('role') || '';
      const label = el.getAttribute('aria-label') || '';
      const className = el.className?.toString().substring(0, 30) || '';
      
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || role === 'button' || 
          el.onclick || el.getAttribute('tabindex') === '0' || label) {
        result.allInteractiveInRegion.push({
          tag, text: text.substring(0, 40), role, label,
          y: Math.round(r.y), x: Math.round(r.x),
          w: Math.round(r.width), h: Math.round(r.height),
          className
        });
      }
    }

    // Also find section containers
    for (const el of document.querySelectorAll('section, [data-testid], [role="region"], [role="group"]')) {
      const r = el.getBoundingClientRect();
      if (r.y > logoY - 50 && r.y < logoY + 300 && r.width > 50) {
        result.nearbyElements.push({
          tag: el.tagName,
          testid: el.getAttribute('data-testid') || '',
          role: el.getAttribute('role') || '',
          y: Math.round(r.y), h: Math.round(r.height)
        });
      }
    }

    return result;
  });

  console.log('=== LOGOS SECTION ===');
  console.log('Logo element:', JSON.stringify(logoArea.logoSection));
  console.log('\nInteractive elements near logos:');
  logoArea.allInteractiveInRegion.forEach(e => {
    console.log(`  [${e.tag}] y=${e.y} x=${e.x} ${e.w}x${e.h}: label="${e.label}" text="${e.text}" role="${e.role}"`);
  });
  console.log('\nSection containers:');
  logoArea.nearbyElements.forEach(e => console.log(`  ${JSON.stringify(e)}`));

  // Let's also look at the full page sections (Colors, Fonts, Logos, etc.)
  console.log('\n=== ALL SECTIONS ===');
  const sections = await page.evaluate(() => {
    const sects = [];
    for (const p of document.querySelectorAll('p, span, h1, h2, h3, h4')) {
      const text = p.textContent.trim();
      if (['Colors', 'Fonts', 'Logos', 'Brand Templates', 'Photos', 'Graphics', 'Icons'].includes(text)) {
        const r = p.getBoundingClientRect();
        if (r.width > 10) {
          // Find sibling/nearby buttons
          const parent = p.parentElement;
          const btns = parent ? [...parent.querySelectorAll('button')].map(b => ({
            label: b.getAttribute('aria-label') || '',
            text: b.textContent.trim().substring(0, 30),
            y: Math.round(b.getBoundingClientRect().y),
            x: Math.round(b.getBoundingClientRect().x)
          })) : [];
          sects.push({ name: text, y: Math.round(r.y), x: Math.round(r.x), buttons: btns });
        }
      }
    }
    return sects;
  });
  sections.forEach(s => {
    console.log(`  ${s.name} (y=${s.y}): ${s.buttons.length} buttons`);
    s.buttons.forEach(b => console.log(`    button: label="${b.label}" text="${b.text}" y=${b.y} x=${b.x}`));
  });

  // Check for any "Add" or "+" or "Upload" buttons anywhere
  console.log('\n=== ADD/UPLOAD BUTTONS ===');
  const addBtns = await page.evaluate(() => {
    return [...document.querySelectorAll('button, [role="button"]')]
      .filter(b => {
        const label = (b.getAttribute('aria-label') || '').toLowerCase();
        const text = (b.textContent || '').toLowerCase().trim();
        return label.includes('add') || label.includes('upload') || label.includes('new') || 
               text.includes('add') || text.includes('upload') || text === '+';
      })
      .map(b => {
        const r = b.getBoundingClientRect();
        return {
          label: b.getAttribute('aria-label') || '',
          text: b.textContent.trim().substring(0, 40),
          y: Math.round(r.y), x: Math.round(r.x),
          w: Math.round(r.width), h: Math.round(r.height)
        };
      });
  });
  addBtns.forEach(b => console.log(`  y=${b.y} x=${b.x}: label="${b.label}" text="${b.text}"`));

  process.exit(0);
})();
