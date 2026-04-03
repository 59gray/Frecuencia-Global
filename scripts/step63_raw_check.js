const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 90000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Try Photos with extra wait
  console.log('Navigating to Photos...');
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw', { waitUntil: 'networkidle0', timeout: 60000 });
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  // Wait for content to render
  await delay(8000);

  // Get body innerText (very raw)
  const bodyText = await page.evaluate(() => {
    // Get the main content region
    const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
    return main.innerText.substring(0, 2000);
  });
  
  console.log('\n--- Body text (first 2000 chars) ---');
  console.log(bodyText);

  // Check if Alto contraste appears anywhere in the DOM
  const found = await page.evaluate(() => {
    return document.body.innerHTML.includes('Alto contraste');
  });
  console.log('\n"Alto contraste" in DOM:', found);

  // Check for textareas (might still be in edit mode)
  const textareas = await page.evaluate(() => {
    return [...document.querySelectorAll('textarea')].map(t => ({
      value: t.value.substring(0, 60),
      placeholder: t.placeholder.substring(0, 40),
      h: Math.round(t.getBoundingClientRect().height)
    }));
  });
  console.log('Textareas:', JSON.stringify(textareas));

  process.exit(0);
})();
