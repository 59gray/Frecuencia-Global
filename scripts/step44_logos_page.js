const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const LOGOS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9fRIO_';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto(LOGOS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Full page analysis
  const analysis = await page.evaluate(() => {
    const info = {
      title: document.title,
      headings: [],
      buttons: [],
      inputs: [],
      texts: [],
      dropzones: [],
      links: []
    };

    // Headings
    for (const h of document.querySelectorAll('h1, h2, h3, h4, h5')) {
      const r = h.getBoundingClientRect();
      if (r.width > 10) info.headings.push({ text: h.textContent.trim().substring(0, 60), y: Math.round(r.y) });
    }

    // Buttons
    for (const btn of document.querySelectorAll('button')) {
      const r = btn.getBoundingClientRect();
      if (r.width > 10 && r.x > 60) {
        info.buttons.push({
          text: btn.textContent.trim().substring(0, 50),
          label: btn.getAttribute('aria-label') || '',
          y: Math.round(r.y),
          x: Math.round(r.x),
          w: Math.round(r.width),
          h: Math.round(r.height)
        });
      }
    }

    // Inputs
    for (const inp of document.querySelectorAll('input')) {
      info.inputs.push({
        type: inp.type,
        accept: inp.accept,
        name: inp.name,
        display: window.getComputedStyle(inp).display,
        visibility: window.getComputedStyle(inp).visibility,
        w: Math.round(inp.getBoundingClientRect().width)
      });
    }

    // All visible text in main area
    for (const el of document.querySelectorAll('p, span, div, label')) {
      const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      const r = el.getBoundingClientRect();
      if (text && r.width > 10 && r.x > 60 && r.y > 50 && r.y < 800) {
        info.texts.push({ text: text.substring(0, 60), y: Math.round(r.y), x: Math.round(r.x), tag: el.tagName });
      }
    }

    // Dropzone areas
    for (const el of document.querySelectorAll('[data-testid*="drop"], [data-testid*="upload"], [role="button"]')) {
      const r = el.getBoundingClientRect();
      if (r.width > 50 && r.x > 60) {
        info.dropzones.push({
          testid: el.getAttribute('data-testid') || '',
          role: el.getAttribute('role') || '',
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 50),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height)
        });
      }
    }

    // Links in main area
    for (const a of document.querySelectorAll('a')) {
      const r = a.getBoundingClientRect();
      if (r.width > 10 && r.x > 60 && r.y > 50 && r.y < 800) {
        info.links.push({ text: a.textContent.trim().substring(0, 40), href: (a.href || '').substring(0, 80) });
      }
    }

    return info;
  });

  console.log('=== LOGOS INGREDIENT PAGE ===');
  console.log('Title:', analysis.title);
  
  console.log('\nHeadings:');
  analysis.headings.forEach(h => console.log(`  y=${h.y}: ${h.text}`));
  
  console.log('\nButtons:');
  analysis.buttons.forEach(b => console.log(`  y=${b.y} x=${b.x} [${b.w}x${b.h}]: label="${b.label}" text="${b.text}"`));
  
  console.log('\nInputs:');
  analysis.inputs.forEach(i => console.log(`  ${JSON.stringify(i)}`));
  
  console.log('\nTexts:');
  analysis.texts.forEach(t => console.log(`  y=${t.y} x=${t.x}: [${t.tag}] ${t.text}`));
  
  console.log('\nDropzones:');
  analysis.dropzones.forEach(d => console.log(`  y=${d.y} [${d.w}x${d.h}]: role="${d.role}" testid="${d.testid}" text="${d.text}"`));
  
  console.log('\nLinks:');
  analysis.links.forEach(l => console.log(`  ${l.text} → ${l.href}`));

  process.exit(0);
})();
