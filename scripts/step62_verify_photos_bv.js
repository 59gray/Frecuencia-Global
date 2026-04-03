const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 90000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Photos check
  console.log('========== PHOTOS ==========');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(6000);

  let content = await page.evaluate(() => {
    return [...document.querySelectorAll('*')].filter(el => {
      const text = el.textContent.trim();
      const r = el.getBoundingClientRect();
      return text.includes('Alto contraste') || text.includes('Usar iluminación') || text.includes('Evitar stock');
    }).map(el => ({
      text: el.textContent.trim().substring(0, 100),
      tag: el.tagName,
      children: el.children.length,
      y: Math.round(el.getBoundingClientRect().y),
      h: Math.round(el.getBoundingClientRect().height),
      w: Math.round(el.getBoundingClientRect().width)
    })).slice(0, 10);
  });

  if (content.length > 0) {
    console.log('✅ Photos guidelines found:');
    content.forEach(c => console.log(`  y=${c.y} h=${c.h} w=${c.w} children=${c.children} <${c.tag}>: "${c.text}"`));
  } else {
    console.log('❌ Photos: No guideline text found on page');
  }

  // Brand voice check
  console.log('\n========== BRAND VOICE ==========');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9fRIO_', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(6000);

  content = await page.evaluate(() => {
    return [...document.querySelectorAll('*')].filter(el => {
      const text = el.textContent.trim();
      return text.includes('Frecuencia Global habla') || text.includes('Brand voice') || text.includes('claridad');
    }).map(el => ({
      text: el.textContent.trim().substring(0, 120),
      tag: el.tagName,
      children: el.children.length,
      y: Math.round(el.getBoundingClientRect().y),
      h: Math.round(el.getBoundingClientRect().height),
      w: Math.round(el.getBoundingClientRect().width)
    })).filter(el => el.y > 100 && el.h > 0 && el.w > 30).slice(0, 10);
  });

  if (content.length > 0) {
    console.log('✅ Brand voice content found:');
    content.forEach(c => console.log(`  y=${c.y} h=${c.h} w=${c.w} children=${c.children} <${c.tag}>: "${c.text}"`));
  } else {
    // Dump everything visible
    const allText = await page.evaluate(() => {
      return [...document.querySelectorAll('p, span, div, h1, h2, h3, h4, textarea')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.y > 150 && r.y < 800 && r.width > 100 && r.height > 10 && el.children.length < 3;
      }).map(el => ({
        text: el.textContent.trim().substring(0, 100),
        tag: el.tagName,
        y: Math.round(el.getBoundingClientRect().y)
      })).filter(t => t.text.length > 5);
    });
    console.log('❌ No brand voice text found. Page content:');
    allText.forEach(t => console.log(`  y=${t.y} <${t.tag}>: "${t.text}"`));
  }

  process.exit(0);
})();
