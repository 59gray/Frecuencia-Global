const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Wait extra for any uploads to finish
  await delay(5000);

  console.log('Current URL:', page.url());
  console.log('Title:', await page.title());

  // Check what's on the Logos page now
  const state = await page.evaluate(() => {
    const result = {
      // Look for error messages, toasts, or notifications
      errors: [],
      // Look for uploaded logos (images, thumbnails)
      images: [...document.querySelectorAll('img')].map(img => ({
        src: img.src?.substring(0, 100) || '',
        alt: img.alt || '',
        title: img.title || '',
        w: Math.round(img.getBoundingClientRect().width),
        h: Math.round(img.getBoundingClientRect().height),
        y: Math.round(img.getBoundingClientRect().y),
        x: Math.round(img.getBoundingClientRect().x),
        visible: img.getBoundingClientRect().width > 0
      })),
      // SVGs
      svgs: [...document.querySelectorAll('svg')].filter(s => {
        const r = s.getBoundingClientRect();
        return r.width > 30; // Only meaningful SVGs
      }).map(s => ({
        w: Math.round(s.getBoundingClientRect().width),
        h: Math.round(s.getBoundingClientRect().height),
        y: Math.round(s.getBoundingClientRect().y),
        x: Math.round(s.getBoundingClientRect().x)
      })),
      // All visible text in main content area
      mainText: '',
      // Buttons
      buttons: [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({
        text: b.textContent.trim().substring(0, 50),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(b.getBoundingClientRect().y)
      })),
      // Check for toast/notification elements
      toasts: [...document.querySelectorAll('[role="alert"], [role="status"], [class*="toast"], [class*="notification"], [class*="snackbar"]')].map(t => ({
        text: t.textContent.trim().substring(0, 200),
        tag: t.tagName,
        visible: t.getBoundingClientRect().width > 0
      })),
      // Check for any modals or dialogs still open
      dialogs: [...document.querySelectorAll('[role="dialog"]')].map(d => ({
        text: d.textContent.trim().substring(0, 300),
        visible: d.getBoundingClientRect().width > 0
      })),
      // Role="button" elements that might be logo cards
      roleButtons: [...document.querySelectorAll('[role="button"]')].map(b => {
        const r = b.getBoundingClientRect();
        return {
          text: b.textContent.trim().substring(0, 50),
          label: b.getAttribute('aria-label') || '',
          y: Math.round(r.y),
          x: Math.round(r.x),
          w: Math.round(r.width),
          h: Math.round(r.height),
          visible: r.width > 0,
          hasImg: b.querySelector('img') !== null,
          imgSrc: b.querySelector('img')?.src?.substring(0, 80) || ''
        };
      }).filter(b => b.visible && b.y > 200 && b.y < 600)
    };

    // Get main content
    const main = document.querySelector('[role="main"]');
    if (main) {
      result.mainText = main.textContent.trim().substring(0, 1000);
    }

    // Look for error/warning text
    for (const el of document.querySelectorAll('p, span, div')) {
      const text = el.textContent.trim().toLowerCase();
      if ((text.includes('error') || text.includes('too many') || text.includes('limit') || 
           text.includes('upgrade') || text.includes('failed') || text.includes('cannot')) &&
          el.children.length < 3 && text.length < 200) {
        result.errors.push({
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 100),
          y: Math.round(el.getBoundingClientRect().y)
        });
      }
    }

    return result;
  });

  console.log('\n=== LOGOS PAGE STATE ===');
  console.log('Main content (first 1000 chars):');
  console.log(state.mainText);

  console.log('\nImages:');
  state.images.filter(i => i.visible).forEach(i => 
    console.log(`  y=${i.y} x=${i.x} ${i.w}x${i.h}: src="${i.src}" alt="${i.alt}"`)
  );

  console.log('\nLarge SVGs:');
  state.svgs.forEach(s => console.log(`  y=${s.y} x=${s.x} ${s.w}x${s.h}`));

  console.log('\nRole="button" cards in content area:');
  state.roleButtons.forEach(b => 
    console.log(`  y=${b.y} x=${b.x} ${b.w}x${b.h}: "${b.text}" hasImg=${b.hasImg} img="${b.imgSrc}"`)
  );

  console.log('\nErrors/warnings:');
  state.errors.forEach(e => console.log(`  [${e.tag}] y=${e.y}: "${e.text}"`));

  console.log('\nToasts:', JSON.stringify(state.toasts));
  console.log('Dialogs:', JSON.stringify(state.dialogs));

  console.log('\nButtons:');
  state.buttons.forEach(b => console.log(`  y=${b.y}: label="${b.label}" text="${b.text}"`));

  process.exit(0);
})();
