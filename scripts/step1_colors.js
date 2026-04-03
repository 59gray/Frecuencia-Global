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
    if (!page) { console.error('No Brand Kit page'); process.exit(1); }
    await page.bringToFront();

    // Accept cookies
    const accepted = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Accept all'));
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (accepted) { console.log('Cookies aceptadas'); await delay(1500); }

    // Click Colors in sidebar
    const clicked = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a, button, span, div, li')];
      for (const el of links) {
        if (el.textContent.trim() === 'Colors' && el.offsetParent !== null && el.getBoundingClientRect().x < 400) {
          el.click();
          return 'sidebar';
        }
      }
      return false;
    });
    console.log('Click Colors:', clicked);
    await delay(3000);

    await page.screenshot({ path: 'scripts/brandkit_colors.png', fullPage: false });
    console.log('Screenshot guardado');

    const text = await page.evaluate(() => document.body.innerText.substring(0, 3000));
    console.log(text);

    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
