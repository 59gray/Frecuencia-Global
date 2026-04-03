const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Go to main Brand Kit page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(4000);

  // Scroll all the way down and collect all <p> text
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 200));
    await delay(500);
  }

  const labels = await page.evaluate(() => {
    return [...document.querySelectorAll('p')].map(p => ({
      text: p.textContent.trim(),
      y: Math.round(p.getBoundingClientRect().y),
      visible: p.getBoundingClientRect().y > -100 && p.getBoundingClientRect().y < window.innerHeight + 100,
      w: Math.round(p.getBoundingClientRect().width)
    })).filter(l => l.text.length > 0 && l.text.length < 30);
  });

  console.log('All short <p> labels on page:');
  labels.forEach(l => console.log(`  y=${l.y} w=${l.w} vis=${l.visible}: "${l.text}"`));

  // Also check role="group" elements
  const groups = await page.evaluate(() => {
    return [...document.querySelectorAll('[role="group"]')].map(g => ({
      text: g.textContent.trim().substring(0, 50),
      y: Math.round(g.getBoundingClientRect().y)
    }));
  });
  console.log('\nGroups:');
  groups.forEach(g => console.log(`  y=${g.y}: "${g.text}"`));

  process.exit(0);
})();
