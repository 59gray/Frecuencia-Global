const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

// ── GUIDELINE TEXTS ──
const GUIDELINES = {
  Photos: {
    summary: 'Alto contraste, luz baja o dramática con acentos neón. Escenas urbanas, mapas, pantallas, multitudes, cabinas, infraestructura, diplomacia, protestas y tecnología. Priorizar imágenes con atmósfera editorial y tensión visual que transmitan urgencia contenida y conexión global.',
    dos: 'Usar iluminación dramática con acentos de color neón. Buscar composiciones con profundidad y tensión visual. Incluir escenarios urbanos, pantallas, mapas, multitudes, cabinas de control, infraestructura y diplomacia. Priorizar imágenes que transmitan contexto geopolítico real.',
    donts: 'Evitar stock genérico corporativo. No usar clichés políticos obvios (banderas ondeando, apretones de manos posados). Evitar imágenes sobreexpuestas, planas o sin atmósfera. No usar fotografías con texto superpuesto visible ni marcas de agua.'
  },
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
    // Find the right textarea by placeholder
    const textareas = [...document.querySelectorAll('textarea')];
    const ta = textareas.find(t => 
      t.placeholder.toLowerCase().includes(placeholder.toLowerCase()) && 
      t.getBoundingClientRect().height > 50
    );
    if (!ta) return { error: `Textarea with placeholder containing "${placeholder}" not found` };
    
    // Use nativeInputValueSetter for React
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeSetter.call(ta, value);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    
    return { ok: true, newValue: ta.value.substring(0, 50) + '...' };
  }, placeholderContains, text);
}

async function navigateToCategory(page, categoryName) {
  // Go to main Brand Kit page
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(4000);

  // Scroll down to make sure category is visible
  await page.evaluate(() => window.scrollTo(0, 300));
  await delay(1000);

  // Find and click category card
  const result = await page.evaluate((catName) => {
    const label = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === catName);
    if (!label) return { error: `Label "${catName}" not found` };

    let group = label;
    for (let i = 0; i < 10; i++) {
      group = group.parentElement;
      if (!group) break;
      if (group.getAttribute('role') === 'group') break;
    }
    if (!group || group.getAttribute('role') !== 'group') return { error: 'Group not found' };

    const card = group.querySelector('[role="button"]');
    if (!card) return { error: 'Card not found' };

    const r = card.getBoundingClientRect();
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };
    card.dispatchEvent(new PointerEvent('pointerdown', opts));
    card.dispatchEvent(new MouseEvent('mousedown', opts));
    card.dispatchEvent(new PointerEvent('pointerup', opts));
    card.dispatchEvent(new MouseEvent('mouseup', opts));
    card.dispatchEvent(new MouseEvent('click', opts));
    return { ok: true };
  }, categoryName);

  if (result.error) {
    console.log(`  Navigation error: ${result.error}`);
    return false;
  }

  await delay(5000);
  console.log(`  Navigated to: ${page.url()}`);
  return true;
}

async function openGuidelinesForm(page) {
  // Click "Add to category"
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

  // Click "Add guidelines"
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b =>
      b.textContent.trim() === 'Add guidelines'
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
  await delay(3000);

  // Verify textareas appeared
  const count = await page.evaluate(() => 
    document.querySelectorAll('textarea').length
  );
  return count > 0;
}

async function saveGuidelines(page) {
  await page.evaluate(() => {
    const saveBtn = [...document.querySelectorAll('button')].find(b =>
      b.textContent.trim() === 'Save'
    );
    if (saveBtn) {
      const r = saveBtn.getBoundingClientRect();
      const opts = { bubbles: true, cancelable: true, clientX: r.x + r.width/2, clientY: r.y + r.height/2 };
      saveBtn.dispatchEvent(new PointerEvent('pointerdown', opts));
      saveBtn.dispatchEvent(new MouseEvent('mousedown', opts));
      saveBtn.dispatchEvent(new PointerEvent('pointerup', opts));
      saveBtn.dispatchEvent(new MouseEvent('mouseup', opts));
      saveBtn.dispatchEvent(new MouseEvent('click', opts));
    }
  });
  await delay(3000);
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Process Photos first as a test
  const category = 'Photos';
  const guidelines = GUIDELINES[category];
  
  console.log(`\n========== PROCESSING: ${category} ==========`);

  // Navigate to category
  const navOk = await navigateToCategory(page, category);
  if (!navOk) {
    console.log('FAILED: Could not navigate');
    process.exit(1);
  }

  // Open guidelines form
  const formOk = await openGuidelinesForm(page);
  console.log(`  Guidelines form opened: ${formOk}`);

  if (!formOk) {
    console.log('FAILED: Guidelines form did not open');
    process.exit(1);
  }

  // Get the actual placeholders to know which textarea is which
  const placeholders = await page.evaluate(() => {
    return [...document.querySelectorAll('textarea')].map(t => ({
      placeholder: t.placeholder,
      h: Math.round(t.getBoundingClientRect().height),
      y: Math.round(t.getBoundingClientRect().y),
      w: Math.round(t.getBoundingClientRect().width)
    }));
  });
  console.log('  Textareas found:');
  placeholders.forEach(p => console.log(`    h=${p.h} w=${p.w} y=${p.y}: "${p.placeholder}"`));

  // Fill Summary (placeholder contains "Describe" or "convey")
  console.log('\n  Filling Summary...');
  let result = await fillTextarea(page, 'Describe', guidelines.summary);
  console.log('  Summary:', JSON.stringify(result));

  // Fill Do's (placeholder contains "guidance" or "composition")
  console.log('  Filling Do\'s...');
  result = await fillTextarea(page, 'guidance', guidelines.dos);
  console.log('  Do\'s:', JSON.stringify(result));

  // Fill Don'ts (placeholder contains "mistakes" or "avoid")
  console.log('  Filling Don\'ts...');
  result = await fillTextarea(page, 'mistakes', guidelines.donts);
  console.log('  Don\'ts:', JSON.stringify(result));

  // Save
  console.log('\n  Saving...');
  await saveGuidelines(page);
  console.log('  Saved! URL:', page.url());

  // Verify saved content
  await delay(2000);
  const verification = await page.evaluate(() => {
    const textContent = [];
    for (const el of document.querySelectorAll('p, span, div')) {
      const text = el.textContent.trim();
      const r = el.getBoundingClientRect();
      if (text.length > 30 && text.length < 400 && r.y > 200 && r.y < 800 && r.width > 100 && el.children.length < 3) {
        textContent.push({
          text: text.substring(0, 100),
          y: Math.round(r.y)
        });
      }
    }
    const buttons = [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({
      text: b.textContent.trim().substring(0, 30),
      y: Math.round(b.getBoundingClientRect().y)
    }));
    return { textContent, buttons: buttons.filter(b => b.y > 200) };
  });
  console.log('\n  Verification - visible text after save:');
  verification.textContent.forEach(t => console.log(`    y=${t.y}: "${t.text}"`));
  console.log('  Buttons:', verification.buttons.map(b => `y=${b.y} "${b.text}"`).join(', '));

  process.exit(0);
})();
