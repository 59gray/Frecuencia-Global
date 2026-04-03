const puppeteer = require('puppeteer-core');
const path = require('path');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 180000);

const LOGOS_URL = 'https://www.canva.com/brand/kAGEfgAcmZ0/ingredient/IG-Fxa2jz9inH0t';
const ASSETS_DIR = path.join(__dirname, '..', 'Frecuencia_Global_Assets_Base', 'assets');
const LOGOS = [
  'fg_isotipo.svg',
  'fg_wordmark_dark.svg',
  'fg_wordmark_light.svg',
  'fg_corchetes.svg',
  'fg_nodo.svg'
];

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate to Logos ingredient page if not already there
  if (!page.url().includes('IG-Fxa2jz9inH0t')) {
    await page.goto(LOGOS_URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(5000);
  }

  console.log('On Logos page:', page.url());
  console.log('Title:', await page.title());

  // Click "Add brand assets" button  
  console.log('\n--- Clicking "Add brand assets" ---');
  
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => 
      b.textContent.trim() === 'Add brand assets'
    );
    if (!btn) {
      console.log('Button not found!');
      return;
    }
    const r = btn.getBoundingClientRect();
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };
    
    btn.dispatchEvent(new PointerEvent('pointerdown', opts));
    btn.dispatchEvent(new MouseEvent('mousedown', opts));
    btn.dispatchEvent(new PointerEvent('pointerup', opts));
    btn.dispatchEvent(new MouseEvent('mouseup', opts));
    btn.dispatchEvent(new MouseEvent('click', opts));
  });

  await delay(3000);

  // Check what appeared - look for file input, modal, dropzone, etc.
  const afterClick = await page.evaluate(() => {
    const result = {
      url: window.location.href,
      fileInputs: [...document.querySelectorAll('input[type="file"]')].map(i => ({
        accept: i.accept,
        multiple: i.multiple,
        name: i.name,
        id: i.id,
        w: Math.round(i.getBoundingClientRect().width),
        h: Math.round(i.getBoundingClientRect().height),
        visible: getComputedStyle(i).display !== 'none' && getComputedStyle(i).visibility !== 'hidden'
      })),
      allInputs: [...document.querySelectorAll('input')].map(i => ({
        type: i.type,
        accept: i.accept,
        name: i.name,
        w: Math.round(i.getBoundingClientRect().width)
      })),
      modals: [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], [aria-modal="true"]')].map(d => ({
        text: d.textContent.trim().substring(0, 200),
        y: Math.round(d.getBoundingClientRect().y),
        w: Math.round(d.getBoundingClientRect().width),
        h: Math.round(d.getBoundingClientRect().height)
      })),
      newButtons: [...document.querySelectorAll('button')].map(b => ({
        text: b.textContent.trim().substring(0, 50),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(b.getBoundingClientRect().y),
        visible: b.getBoundingClientRect().width > 0
      })).filter(b => b.visible),
      dropzones: [...document.querySelectorAll('[class*="drop"], [class*="upload"], [data-testid*="upload"], [data-testid*="drop"]')].map(d => ({
        tag: d.tagName,
        text: d.textContent.trim().substring(0, 100),
        y: Math.round(d.getBoundingClientRect().y)
      })),
      newTexts: [...document.querySelectorAll('p, span, h1, h2, h3, h4, h5, label')].filter(el => {
        const text = el.textContent.trim().toLowerCase();
        return (text.includes('upload') || text.includes('drag') || text.includes('drop') || 
                text.includes('browse') || text.includes('file') || text.includes('import'));
      }).map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 80),
        y: Math.round(el.getBoundingClientRect().y)
      }))
    };
    return result;
  });

  console.log('File inputs:', JSON.stringify(afterClick.fileInputs));
  console.log('All inputs:', JSON.stringify(afterClick.allInputs));
  console.log('Modals:', JSON.stringify(afterClick.modals));
  console.log('Dropzones:', JSON.stringify(afterClick.dropzones));
  console.log('Upload/drag texts:', JSON.stringify(afterClick.newTexts));
  console.log('\nButtons after click:');
  afterClick.newButtons.forEach(b => console.log(`  y=${b.y}: label="${b.label}" text="${b.text}"`));

  // If there's a file input, try uploading
  if (afterClick.fileInputs.length > 0) {
    console.log('\n--- FILE INPUT FOUND! Uploading logos ---');
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      const filePaths = LOGOS.map(l => path.resolve(ASSETS_DIR, l));
      console.log('Uploading files:', filePaths);
      await fileInput.uploadFile(...filePaths);
      console.log('Upload initiated!');
      await delay(10000);
      console.log('URL after upload:', page.url());
    }
  } else if (afterClick.allInputs.length > 0) {
    console.log('\n--- Found inputs but no file input. Looking for hidden file inputs... ---');
    const hiddenInput = await page.evaluate(() => {
      const allInputs = document.querySelectorAll('input');
      for (const inp of allInputs) {
        if (inp.type === 'file') return { found: true, accept: inp.accept };
      }
      // Check all hidden/offscreen inputs
      for (const inp of allInputs) {
        return { found: false, type: inp.type, accept: inp.accept, display: getComputedStyle(inp).display };
      }
      return { found: false };
    });
    console.log('Hidden input search:', JSON.stringify(hiddenInput));
  } else {
    console.log('\n--- No file inputs found. Trying "Add to category" button ---');
    // Maybe "Add to category" opens the upload dialog
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => 
        b.getAttribute('aria-label') === 'Add to category'
      );
      if (btn) {
        const r = btn.getBoundingClientRect();
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };
        btn.dispatchEvent(new PointerEvent('pointerdown', opts));
        btn.dispatchEvent(new MouseEvent('mousedown', opts));
        btn.dispatchEvent(new PointerEvent('pointerup', opts));
        btn.dispatchEvent(new MouseEvent('mouseup', opts));
        btn.dispatchEvent(new MouseEvent('click', opts));
      }
    });
    
    await delay(3000);

    const afterAdd = await page.evaluate(() => {
      return {
        fileInputs: [...document.querySelectorAll('input[type="file"]')].length,
        allInputs: [...document.querySelectorAll('input')].map(i => ({ type: i.type, accept: i.accept })),
        modals: [...document.querySelectorAll('[role="dialog"]')].map(d => ({
          text: d.textContent.trim().substring(0, 300),
          h: Math.round(d.getBoundingClientRect().height)
        })),
        buttons: [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({
          text: b.textContent.trim().substring(0, 50),
          label: b.getAttribute('aria-label') || '',
          y: Math.round(b.getBoundingClientRect().y)
        }))
      };
    });

    console.log('After "Add to category":');
    console.log('File inputs:', afterAdd.fileInputs);
    console.log('All inputs:', JSON.stringify(afterAdd.allInputs));
    console.log('Modals:', JSON.stringify(afterAdd.modals));
    console.log('Buttons:');
    afterAdd.buttons.forEach(b => console.log(`  y=${b.y}: label="${b.label}" text="${b.text}"`));
  }

  process.exit(0);
})();
