const puppeteer = require('puppeteer-core');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null,
    });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('canva.com/brand'));
    if (!page) { process.exit(1); }
    await page.bringToFront();

    // Navigate directly to Colors URL
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/colors', { waitUntil: 'networkidle2', timeout: 15000 });
    await delay(2000);
    
    await page.screenshot({ path: 'scripts/brandkit_colors.png', fullPage: false });
    
    const text = await page.evaluate(() => document.body.innerText.substring(0, 3000));
    console.log(text);

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
