const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate to Photos ingredient page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9Doguw', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  console.log('On Photos page:', page.url());

  // Click "Add to category" to reveal submenu
  console.log('\n--- Step 1: Click "Add to category" ---');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => 
      b.getAttribute('aria-label') === 'Add to category'
    );
    if (btn) {
      const r = btn.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
      btn.dispatchEvent(new PointerEvent('pointerdown', opts));
      btn.dispatchEvent(new MouseEvent('mousedown', opts));
      btn.dispatchEvent(new PointerEvent('pointerup', opts));
      btn.dispatchEvent(new MouseEvent('mouseup', opts));
      btn.dispatchEvent(new MouseEvent('click', opts));
    }
  });
  await delay(2000);

  // Click "Add guidelines" button
  console.log('--- Step 2: Click "Add guidelines" ---');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => 
      b.textContent.trim() === 'Add guidelines'
    );
    if (btn) {
      console.log('Found Add guidelines button');
      const r = btn.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
      btn.dispatchEvent(new PointerEvent('pointerdown', opts));
      btn.dispatchEvent(new MouseEvent('mousedown', opts));
      btn.dispatchEvent(new PointerEvent('pointerup', opts));
      btn.dispatchEvent(new MouseEvent('mouseup', opts));
      btn.dispatchEvent(new MouseEvent('click', opts));
    } else {
      console.log('Add guidelines button NOT FOUND');
    }
  });
  await delay(3000);

  // Check what appeared - look for text inputs, textareas, contenteditable
  const afterGuidelinesClick = await page.evaluate(() => {
    return {
      url: window.location.href,
      textareas: [...document.querySelectorAll('textarea')].map(t => ({
        value: t.value?.substring(0, 100) || '',
        placeholder: t.placeholder?.substring(0, 80) || '',
        w: Math.round(t.getBoundingClientRect().width),
        h: Math.round(t.getBoundingClientRect().height),
        y: Math.round(t.getBoundingClientRect().y),
        maxLength: t.maxLength
      })),
      contentEditables: [...document.querySelectorAll('[contenteditable="true"]')].map(e => ({
        tag: e.tagName,
        text: e.textContent.trim().substring(0, 50),
        y: Math.round(e.getBoundingClientRect().y),
        w: Math.round(e.getBoundingClientRect().width),
        h: Math.round(e.getBoundingClientRect().height),
        role: e.getAttribute('role')
      })),
      inputs: [...document.querySelectorAll('input')].map(i => ({
        type: i.type,
        placeholder: i.placeholder?.substring(0, 50) || '',
        w: Math.round(i.getBoundingClientRect().width)
      })),
      dialogs: [...document.querySelectorAll('[role="dialog"]')].map(d => ({
        text: d.textContent.trim().substring(0, 300),
        h: Math.round(d.getBoundingClientRect().height)
      })),
      buttons: [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({
        text: b.textContent.trim().substring(0, 40),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(b.getBoundingClientRect().y)
      })),
      // Look for any new visible elements
      newTexts: [...document.querySelectorAll('p, span, h1, h2, h3, h4, h5, label')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.y > 200 && r.y < 600 && r.width > 100 && el.children.length < 3 && el.textContent.trim().length > 5;
      }).map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 80),
        y: Math.round(el.getBoundingClientRect().y)
      }))
    };
  });

  console.log('\nAfter clicking "Add guidelines":');
  console.log('URL:', afterGuidelinesClick.url);
  console.log('Textareas:', JSON.stringify(afterGuidelinesClick.textareas));
  console.log('ContentEditables:', JSON.stringify(afterGuidelinesClick.contentEditables));
  console.log('Inputs:', JSON.stringify(afterGuidelinesClick.inputs));
  console.log('Dialogs:', JSON.stringify(afterGuidelinesClick.dialogs));
  console.log('\nButtons:');
  afterGuidelinesClick.buttons.filter(b => b.y > 150).forEach(b => 
    console.log(`  y=${b.y}: label="${b.label}" text="${b.text}"`)
  );
  console.log('\nTexts:');
  afterGuidelinesClick.newTexts.forEach(t => console.log(`  y=${t.y} [${t.tag}]: "${t.text}"`));

  process.exit(0);
})();
