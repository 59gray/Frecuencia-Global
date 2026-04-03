const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  console.log('Current URL:', page.url());
  console.log('Page count:', pages.length);

  // Go to main Brand Kit 
  console.log('\nNavigating to Brand Kit main page...');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);
  
  console.log('Title:', await page.title());
  console.log('URL:', page.url());

  // Check all text on page  
  const items = await page.evaluate(() => {
    const texts = [];
    document.querySelectorAll('p, h1, h2, h3, span').forEach(el => {
      const r = el.getBoundingClientRect();
      const text = el.textContent.trim();
      if (text.length > 3 && text.length < 100 && r.y > 100 && r.width > 30 && r.height > 0) {
        const key = text.substring(0, 40);
        if (!texts.find(t => t.text === key)) {
          texts.push({ text: key, tag: el.tagName, y: Math.round(r.y) });
        }
      }
    });
    return texts.sort((a,b) => a.y - b.y);
  });

  console.log(`\nPage content (${items.length} elements):`);
  items.forEach(i => console.log(`  y=${i.y} <${i.tag}>: "${i.text}"`));

  // Check if we're logged in - look for brand kit categories
  const hasBrandKit = items.some(i => i.text.includes('Logo') || i.text.includes('Color') || i.text.includes('Font'));
  console.log('\nBrand Kit loaded:', hasBrandKit);

  if (hasBrandKit) {
    // Navigate to Photos ingredient to verify guidelines
    console.log('\n--- Navigating to Photos ---');
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw', { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(8000); // extra wait
    
    console.log('Photos URL:', page.url());
    console.log('Photos Title:', await page.title());
    
    const photosContent = await page.evaluate(() => {
      const texts = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        const text = el.textContent.trim();
        if (text.length > 10 && text.length < 500 && r.y > 150 && r.y < 900 && r.width > 100 && r.height > 10 && r.height < 200 && el.children.length < 5) {
          const key = text.substring(0, 80);
          if (!texts.find(t => t.text === key)) {
            texts.push({ text: key, tag: el.tagName, y: Math.round(r.y), h: Math.round(r.height) });
          }
        }
      });
      return texts.sort((a,b) => a.y - b.y).slice(0, 20);
    });
    
    console.log(`Photos page content (${photosContent.length} elements):`);
    photosContent.forEach(i => console.log(`  y=${i.y} h=${i.h} <${i.tag}>: "${i.text}"`));
  }

  process.exit(0);
})();
