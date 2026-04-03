const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

const ICONS = {
  summary: 'Geométricos, simples, trazo limpio y grosor consistente. Uso moderado dentro de composiciones. Preferencia por símbolos de mundo, señal, política, audio, mapas, datos y conexión. Mantener precisión funcional sobre estilo decorativo.',
  dos: 'Usar trazos de grosor uniforme. Preferir formas geométricas puras. Seleccionar símbolos que refuercen el contenido: globo, señal, audio, mapas, datos, conexión. Mantener consistencia de estilo entre todos los íconos del sistema.',
  donts: 'Evitar íconos ilustrativos o con relleno sólido excesivo. No mezclar estilos (outline con filled). No usar íconos decorativos sin relación con el contenido. Evitar detalles finos que se pierdan en tamaños pequeños.'
};

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate to main page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(4000);

  // Scroll to make Icons visible (it's in row 3 at y~554 after scroll)
  await page.evaluate(() => window.scrollTo(0, 200));
  await delay(1500);

  // Check Icons is visible
  const labelCheck = await page.evaluate(() => {
    const label = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === 'Icons');
    if (!label) return { found: false };
    const r = label.getBoundingClientRect();
    return { found: true, y: Math.round(r.y), inView: r.y > 0 && r.y < window.innerHeight };
  });
  console.log('Icons label:', JSON.stringify(labelCheck));

  if (!labelCheck.found) {
    console.log('FAILED: Icons label not found');
    process.exit(1);
  }

  // If not in view, scroll more
  if (!labelCheck.inView) {
    await page.evaluate(() => window.scrollBy(0, 300));
    await delay(1000);
  }

  // Click the Icons card
  const clickResult = await page.evaluate(() => {
    const label = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === 'Icons');
    if (!label) return { error: 'Label not found' };

    // Walk up to find group
    let el = label;
    for (let i = 0; i < 10; i++) {
      el = el.parentElement;
      if (!el) break;
      if (el.getAttribute('role') === 'group') break;
    }

    let card;
    if (el && el.getAttribute('role') === 'group') {
      card = el.querySelector('[role="button"]');
    }
    
    // Fallback: find nearby button card
    if (!card) {
      el = label;
      for (let i = 0; i < 5; i++) {
        el = el.parentElement;
        if (!el) break;
        card = el.querySelector('[role="button"]');
        if (card) break;
      }
    }
    
    if (!card) return { error: 'Card not found' };

    const r = card.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
    card.dispatchEvent(new PointerEvent('pointerdown', opts));
    card.dispatchEvent(new MouseEvent('mousedown', opts));
    card.dispatchEvent(new PointerEvent('pointerup', opts));
    card.dispatchEvent(new MouseEvent('mouseup', opts));
    card.dispatchEvent(new MouseEvent('click', opts));
    return { ok: true, cardY: Math.round(r.y) };
  });
  console.log('Click result:', JSON.stringify(clickResult));
  
  if (clickResult.error) { console.log('FAILED'); process.exit(1); }
  await delay(5000);
  console.log('URL:', page.url());

  // Open guidelines form
  const addToCat = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === 'Add to category');
    if (!btn) return { error: 'No "Add to category" button' };
    const r = btn.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
    btn.dispatchEvent(new PointerEvent('pointerdown', opts));
    btn.dispatchEvent(new MouseEvent('mousedown', opts));
    btn.dispatchEvent(new PointerEvent('pointerup', opts));
    btn.dispatchEvent(new MouseEvent('mouseup', opts));
    btn.dispatchEvent(new MouseEvent('click', opts));
    return { ok: true };
  });
  console.log('"Add to category":', JSON.stringify(addToCat));
  await delay(2000);

  const addGuidelines = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Add guidelines');
    if (!btn) return { error: 'No "Add guidelines" button' };
    const r = btn.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
    btn.dispatchEvent(new PointerEvent('pointerdown', opts));
    btn.dispatchEvent(new MouseEvent('mousedown', opts));
    btn.dispatchEvent(new PointerEvent('pointerup', opts));
    btn.dispatchEvent(new MouseEvent('mouseup', opts));
    btn.dispatchEvent(new MouseEvent('click', opts));
    return { ok: true };
  });
  console.log('"Add guidelines":', JSON.stringify(addGuidelines));
  await delay(3000);

  // Verify textareas
  const tas = await page.evaluate(() => {
    return [...document.querySelectorAll('textarea')].filter(t => t.getBoundingClientRect().height > 50).map(t => ({
      placeholder: t.placeholder.substring(0, 50),
      h: Math.round(t.getBoundingClientRect().height)
    }));
  });
  console.log('Textareas:', JSON.stringify(tas));

  if (tas.length === 0) { console.log('FAILED: No textareas'); process.exit(1); }

  // Fill textareas
  const fill = async (keyword, value) => {
    const r = await page.evaluate((kw, val) => {
      const ta = [...document.querySelectorAll('textarea')].find(t => 
        t.placeholder.toLowerCase().includes(kw.toLowerCase()) && t.getBoundingClientRect().height > 50
      );
      if (!ta) return { error: `No textarea matching "${kw}"` };
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(ta, val);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
      return { ok: true, val: ta.value.substring(0, 40) };
    }, keyword, value);
    return r;
  };

  let r = await fill('Describe', ICONS.summary);
  console.log('Summary:', JSON.stringify(r));
  r = await fill('guidance', ICONS.dos);
  console.log("Do's:", JSON.stringify(r));
  r = await fill('mistakes', ICONS.donts);
  console.log("Don'ts:", JSON.stringify(r));

  // Save
  const saveResult = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save');
    if (!btn) return { error: 'No Save button' };
    const r = btn.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
    btn.dispatchEvent(new PointerEvent('pointerdown', opts));
    btn.dispatchEvent(new MouseEvent('mousedown', opts));
    btn.dispatchEvent(new PointerEvent('pointerup', opts));
    btn.dispatchEvent(new MouseEvent('mouseup', opts));
    btn.dispatchEvent(new MouseEvent('click', opts));
    return { ok: true };
  });
  console.log('Save:', JSON.stringify(saveResult));
  await delay(3000);

  // Verification
  const verify = await page.evaluate(() => {
    const texts = [...document.querySelectorAll('p, span')].filter(el => {
      const r = el.getBoundingClientRect();
      return el.textContent.length > 30 && r.y > 300 && r.y < 600 && r.width > 200;
    });
    return texts.length > 0 ? texts[0].textContent.substring(0, 100) : 'NO CONTENT';
  });
  console.log('Verification:', verify);
  console.log('Icons: SUCCESS ✅');

  process.exit(0);
})();
