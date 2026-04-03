const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

const GUIDELINES = {
  Graphics: {
    summary: 'Sistema modular: líneas cian, nodos de señal, corchetes de frecuencia, overlays tipo HUD, grids y barras de datos. Ondas y glitch sutil como texturas de soporte. Composición limpia, editorial y electrónica. Cada pieza gráfica funciona como parte de un sistema visual coherente.',
    dos: 'Usar líneas cian (#00E5FF), nodos y corchetes como elementos estructurales. Aplicar overlays tipo HUD con opacidad controlada. Mantener composiciones modulares y limpias. Usar glitch sutil y ondas como texturas de fondo, no como protagonistas.',
    donts: 'Evitar decoración sin función. No saturar composiciones con demasiados elementos gráficos simultáneos. No usar degradados genéricos ni efectos 3D realistas. Evitar estilos que compitan con la información editorial.'
  },
  Icons: {
    summary: 'Geométricos, simples, trazo limpio y grosor consistente. Uso moderado dentro de composiciones. Preferencia por símbolos de mundo, señal, política, audio, mapas, datos y conexión. Mantener precisión funcional sobre estilo decorativo.',
    dos: 'Usar trazos de grosor uniforme. Preferir formas geométricas puras. Seleccionar símbolos que refuercen el contenido: globo, señal, audio, mapas, datos, conexión. Mantener consistencia de estilo entre todos los íconos del sistema.',
    donts: 'Evitar íconos ilustrativos o con relleno sólido excesivo. No mezclar estilos (outline con filled). No usar íconos decorativos sin relación con el contenido. Evitar detalles finos que se pierdan en tamaños pequeños.'
  },
  Charts: {
    summary: 'Minimalistas, legibles, fondo limpio. Acentos de color por pilar temático: cian (#00E5FF) para Geopolitik Drop, magenta (#FF00E5) para Bass & Borders, verde ácido (#B8FF00) para Frecuencia Global. Priorizar claridad y lectura rápida.',
    dos: 'Usar fondo oscuro o neutro limpio. Aplicar colores de pilar como acentos principales. Mantener tipografía legible en etiquetas y ejes. Priorizar jerarquía visual: dato principal destacado, contexto secundario atenuado.',
    donts: 'Evitar saturación cromática o demasiados colores simultáneos. No usar fondos con texturas o gradientes que dificulten la lectura. Evitar gráficas 3D o efectos decorativos. No sacrificar legibilidad por estética.'
  }
};

async function fillTextarea(page, placeholderContains, text) {
  return await page.evaluate((placeholder, value) => {
    const textareas = [...document.querySelectorAll('textarea')];
    const ta = textareas.find(t => 
      t.placeholder.toLowerCase().includes(placeholder.toLowerCase()) && 
      t.getBoundingClientRect().height > 50
    );
    if (!ta) return { error: `Textarea with placeholder containing "${placeholder}" not found` };
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeSetter.call(ta, value);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, newValue: ta.value.substring(0, 50) + '...' };
  }, placeholderContains, text);
}

async function reactClick(page, selector) {
  return await page.evaluate((sel) => {
    let el;
    if (sel.startsWith('aria:')) {
      const label = sel.substring(5);
      el = [...document.querySelectorAll('button')].find(b => 
        b.getAttribute('aria-label') === label || b.textContent.trim() === label
      );
    } else if (sel.startsWith('text:')) {
      const text = sel.substring(5);
      el = [...document.querySelectorAll('button, [role="button"]')].find(b => 
        b.textContent.trim() === text
      );
    } else {
      el = document.querySelector(sel);
    }
    if (!el) return { error: `Element not found: ${sel}` };
    const r = el.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
    el.dispatchEvent(new PointerEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new PointerEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
    return { ok: true };
  }, selector);
}

async function navigateToCategory(page, categoryName) {
  // Go to main Brand Kit page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(4000);

  // Scroll down to find category (Graphics, Icons, Charts are in row 2 and 3)
  for (let scrollAttempt = 0; scrollAttempt < 5; scrollAttempt++) {
    const found = await page.evaluate((catName) => {
      const label = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === catName);
      if (!label) return { found: false };
      const r = label.getBoundingClientRect();
      return { found: true, y: r.y, visible: r.y > 0 && r.y < window.innerHeight };
    }, categoryName);

    if (found.found && found.visible) {
      console.log(`  Label "${categoryName}" found at y=${found.y}`);
      break;
    }
    
    if (!found.found) {
      console.log(`  Scroll attempt ${scrollAttempt + 1}: label not found, scrolling...`);
      await page.evaluate(() => window.scrollBy(0, 300));
      await delay(1000);
    } else if (!found.visible) {
      console.log(`  Label at y=${found.y}, scrolling into view...`);
      await page.evaluate(() => window.scrollBy(0, 300));
      await delay(1000);
    }
  }

  // Click category card
  const result = await page.evaluate((catName) => {
    const label = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === catName);
    if (!label) return { error: `Label "${catName}" not found after scrolling` };

    let group = label;
    for (let i = 0; i < 10; i++) {
      group = group.parentElement;
      if (!group) break;
      if (group.getAttribute('role') === 'group') break;
    }
    if (!group || group.getAttribute('role') !== 'group') {
      // Try alternative: find nearby role="button"
      let parent = label;
      for (let i = 0; i < 5; i++) {
        parent = parent.parentElement;
        if (!parent) break;
        const card = parent.querySelector('[role="button"]');
        if (card) {
          const r = card.getBoundingClientRect();
          const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
          card.dispatchEvent(new PointerEvent('pointerdown', opts));
          card.dispatchEvent(new MouseEvent('mousedown', opts));
          card.dispatchEvent(new PointerEvent('pointerup', opts));
          card.dispatchEvent(new MouseEvent('mouseup', opts));
          card.dispatchEvent(new MouseEvent('click', opts));
          return { ok: true, method: 'alt-card' };
        }
      }
      return { error: 'No group or card found near label' };
    }

    const card = group.querySelector('[role="button"]');
    if (!card) return { error: 'Card not found in group' };

    const r = card.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
    card.dispatchEvent(new PointerEvent('pointerdown', opts));
    card.dispatchEvent(new MouseEvent('mousedown', opts));
    card.dispatchEvent(new PointerEvent('pointerup', opts));
    card.dispatchEvent(new MouseEvent('mouseup', opts));
    card.dispatchEvent(new MouseEvent('click', opts));
    return { ok: true, method: 'group-card' };
  }, categoryName);

  console.log(`  Click result: ${JSON.stringify(result)}`);
  if (result.error) return false;

  await delay(5000);
  console.log(`  Navigated to: ${page.url()}`);
  return true;
}

async function openGuidelinesForm(page) {
  let r = await reactClick(page, 'aria:Add to category');
  console.log(`  "Add to category": ${JSON.stringify(r)}`);
  await delay(2000);

  r = await reactClick(page, 'text:Add guidelines');
  console.log(`  "Add guidelines": ${JSON.stringify(r)}`);
  await delay(3000);

  const count = await page.evaluate(() => document.querySelectorAll('textarea').length);
  console.log(`  Textarea count: ${count}`);
  return count > 0;
}

async function processCategory(page, categoryName) {
  const g = GUIDELINES[categoryName];
  console.log(`\n========== PROCESSING: ${categoryName} ==========`);

  const navOk = await navigateToCategory(page, categoryName);
  if (!navOk) { console.log('  FAILED: navigation'); return false; }

  const formOk = await openGuidelinesForm(page);
  if (!formOk) { console.log('  FAILED: form not opened'); return false; }

  // Inspect available textareas
  const tas = await page.evaluate(() => {
    return [...document.querySelectorAll('textarea')].filter(t => t.getBoundingClientRect().height > 50).map(t => ({
      placeholder: t.placeholder,
      h: Math.round(t.getBoundingClientRect().height)
    }));
  });
  console.log(`  Visible textareas: ${tas.map(t => `"${t.placeholder.substring(0,40)}..."`).join(', ')}`);

  // Fill Summary — contains "Describe" or "convey"
  let r = await fillTextarea(page, 'Describe', g.summary);
  console.log(`  Summary: ${JSON.stringify(r)}`);

  // Fill Do's — contains "guidance" or "composition"
  r = await fillTextarea(page, 'guidance', g.dos);
  console.log(`  Do's: ${JSON.stringify(r)}`);

  // Fill Don'ts — contains "mistakes" or "avoid"
  r = await fillTextarea(page, 'mistakes', g.donts);
  console.log(`  Don'ts: ${JSON.stringify(r)}`);

  // Save
  r = await reactClick(page, 'text:Save');
  console.log(`  Save: ${JSON.stringify(r)}`);
  await delay(3000);

  // Quick verification
  const hasContent = await page.evaluate(() => {
    const texts = [...document.querySelectorAll('p, span')].filter(el => {
      const r = el.getBoundingClientRect();
      return el.textContent.length > 30 && r.y > 300 && r.y < 600 && r.width > 200;
    });
    return texts.length > 0 ? texts[0].textContent.substring(0, 80) : 'NO CONTENT FOUND';
  });
  console.log(`  Verification: "${hasContent}"`);
  return true;
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  const results = {};
  for (const cat of ['Graphics', 'Icons', 'Charts']) {
    results[cat] = await processCategory(page, cat);
  }

  console.log('\n========== RESULTS ==========');
  for (const [k, v] of Object.entries(results)) {
    console.log(`  ${k}: ${v ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  }

  process.exit(0);
})();
