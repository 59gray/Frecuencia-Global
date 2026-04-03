const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const LOGOS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9fRIO_';
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  await page.goto(LOGOS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  
  // Wait much longer for content to load
  console.log('Waiting for page to fully load...');
  for (let i = 0; i < 30; i++) {
    await delay(1000);
    const content = await page.evaluate(() => {
      const btns = document.querySelectorAll('button').length;
      const text = document.body.textContent.length;
      return { buttons: btns, textLen: text };
    });
    if (i % 5 === 0) console.log(`  ${i}s: ${content.buttons} buttons, ${content.textLen} chars`);
  }

  // Deep page analysis
  const analysis = await page.evaluate(() => {
    const result = {
      url: window.location.href,
      title: document.title,
      bodyTextLen: document.body.textContent.length,
      bodyText: document.body.textContent.trim().substring(0, 1000),
      allElements: document.querySelectorAll('*').length,
      iframes: [...document.querySelectorAll('iframe')].map(f => ({
        src: f.src?.substring(0, 80) || '',
        w: Math.round(f.getBoundingClientRect().width),
        h: Math.round(f.getBoundingClientRect().height)
      })),
      shadowHosts: [],
      allButtons: [...document.querySelectorAll('button')].map(b => ({
        text: b.textContent.trim().substring(0, 50),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(b.getBoundingClientRect().y),
        x: Math.round(b.getBoundingClientRect().x),
        visible: b.getBoundingClientRect().width > 0
      })),
      allInputs: [...document.querySelectorAll('input')].map(i => ({
        type: i.type, accept: i.accept, name: i.name,
        w: Math.round(i.getBoundingClientRect().width)
      })),
      mainContent: null
    };

    // Find shadow DOM hosts
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    while (node = walker.nextNode()) {
      if (node.shadowRoot) {
        result.shadowHosts.push({
          tag: node.tagName,
          shadowChildCount: node.shadowRoot.children.length,
          shadowText: node.shadowRoot.textContent?.substring(0, 100) || ''
        });
      }
    }

    // Find main content area
    const main = document.querySelector('[role="main"]') || document.querySelector('main');
    if (main) {
      result.mainContent = {
        children: main.children.length,
        text: main.textContent.trim().substring(0, 500),
        y: Math.round(main.getBoundingClientRect().y),
        h: Math.round(main.getBoundingClientRect().height)
      };
    }

    // Check for any element with "logo" or "upload" in attributes or text
    const logoElements = [];
    for (const el of document.querySelectorAll('*')) {
      const attrs = [...el.attributes].map(a => a.value).join(' ').toLowerCase();
      const text = el.textContent.toLowerCase();
      if ((attrs.includes('logo') || attrs.includes('upload') || attrs.includes('drag') ||
           (text.includes('upload') && el.children.length < 5) ||
           (text.includes('drag') && el.children.length < 5) ||
           (text.includes('logo') && el.children.length < 3 && el.textContent.length < 100))) {
        const r = el.getBoundingClientRect();
        if (r.width > 5) {
          logoElements.push({
            tag: el.tagName,
            text: el.textContent.trim().substring(0, 50),
            y: Math.round(r.y),
            w: Math.round(r.width),
            h: Math.round(r.height),
            attrs: attrs.substring(0, 80)
          });
        }
      }
    }
    result.logoElements = logoElements.slice(0, 20);

    return result;
  });

  console.log('=== DEEP ANALYSIS ===');
  console.log('URL:', analysis.url);
  console.log('Title:', analysis.title);
  console.log('Body text length:', analysis.bodyTextLen);
  console.log('Total elements:', analysis.allElements);
  
  console.log('\nBody text (first 1000):');
  console.log(analysis.bodyText);
  
  console.log('\nIframes:', JSON.stringify(analysis.iframes));
  console.log('Shadow hosts:', JSON.stringify(analysis.shadowHosts));
  console.log('Main content:', JSON.stringify(analysis.mainContent));
  
  console.log('\nAll buttons:');
  analysis.allButtons.filter(b => b.visible).forEach(b => console.log(`  y=${b.y} x=${b.x}: label="${b.label}" text="${b.text}"`));
  
  console.log('\nAll inputs:', JSON.stringify(analysis.allInputs));
  
  console.log('\nLogo/Upload elements:');
  (analysis.logoElements || []).forEach(e => console.log(`  [${e.tag}] y=${e.y} ${e.w}x${e.h}: "${e.text}"`));

  process.exit(0);
})();
