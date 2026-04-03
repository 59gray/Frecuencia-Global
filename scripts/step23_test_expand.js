const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const FONTS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9CwFFe';

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  console.log('Navigating to fonts page...');
  await page.goto(FONTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const ready = await page.evaluate(() => (document.body.textContent || '').includes('Subtitle'));
    if (ready) { console.log(`Content ready after ${i + 1}s`); await delay(2000); break; }
  }

  // Find and click the "Subtitle" SPAN
  const span = await page.evaluate(() => {
    for (const el of document.querySelectorAll('span')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (own !== 'Subtitle') continue;
      const cs = window.getComputedStyle(el);
      if (cs.cursor !== 'pointer') continue;
      const r = el.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    }
    return null;
  });

  if (!span) { console.log('Subtitle span not found!'); return; }

  console.log(`Clicking Subtitle at (${span.cx|0}, ${span.cy|0})`);
  await page.mouse.click(span.cx, span.cy);
  await delay(3000);

  // Take screenshot after expanding
  await page.screenshot({ path: 'scripts/diag23_expanded.png' });

  // Check for font buttons
  const btns = await page.evaluate(() => {
    const results = [];
    for (const btn of document.querySelectorAll('button')) {
      const label = btn.getAttribute('aria-label') || '';
      const r = btn.getBoundingClientRect();
      if (r.x < 70 || r.y < 100 || r.y > 900 || r.width < 15) continue;
      results.push({
        label: label.substring(0, 80),
        text: (btn.textContent || '').trim().substring(0, 50),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
    return results;
  });

  console.log(`\nButtons after expanding Subtitle:`);
  for (const b of btns) {
    console.log(`  (${b.x},${b.y}) ${b.w}x${b.h} label="${b.label}" text="${b.text}"`);
  }

  // Check for input fields
  const inputs = await page.evaluate(() => {
    const results = [];
    for (const inp of document.querySelectorAll('input')) {
      const r = inp.getBoundingClientRect();
      if (r.width < 20) continue;
      results.push({
        type: inp.type,
        value: inp.value,
        placeholder: inp.placeholder,
        ariaLabel: inp.getAttribute('aria-label'),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
    return results;
  });

  console.log(`\nInputs after expanding Subtitle:`);
  for (const inp of inputs) {
    console.log(`  (${inp.x},${inp.y}) ${inp.w}x${inp.h} type=${inp.type} value="${inp.value}" placeholder="${inp.placeholder}" label="${inp.ariaLabel}"`);
  }

  // Check select-related elements
  const selects = await page.evaluate(() => {
    const results = [];
    for (const el of document.querySelectorAll('[role="listbox"], [role="combobox"], [role="option"], select')) {
      const r = el.getBoundingClientRect();
      results.push({
        tag: el.tagName,
        role: el.getAttribute('role'),
        text: (el.textContent || '').trim().substring(0, 50),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
    return results;
  });

  console.log(`\nSelect/listbox elements:`);
  for (const s of selects) {
    console.log(`  ${s.tag} role=${s.role} (${s.x},${s.y}) ${s.w}x${s.h} text="${s.text}"`);
  }

  await browser.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
