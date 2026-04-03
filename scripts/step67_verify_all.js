const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 300000);

// All ingredient URLs we know
const SECTIONS = {
  'Brand voice': 'IG-Fxa2jz9fRIO_',
  'Photos': null,       // Need to discover
  'Graphics': null,      // Need to discover
  'Icons': null,         // Need to discover
  'Charts': null         // Need to discover
};

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // First, go to main Brand Kit and click into each category to discover ingredient URLs
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  // Click each category to discover its ingredient URL
  const categoriesToFind = ['Brand voice', 'Photos', 'Graphics', 'Icons', 'Charts'];
  const ingredientURLs = {};

  for (const cat of categoriesToFind) {
    console.log(`\n--- Finding ${cat} ---`);
    
    // Go back to main page
    await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(3000);

    // Scroll to make the category visible
    await page.evaluate((catName) => {
      const label = [...document.querySelectorAll('p, span')].find(el => 
        el.textContent.trim() === catName && el.children.length === 0
      );
      if (label) label.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, cat);
    await delay(1000);

    // Find the role="button" card for this category
    const clicked = await page.evaluate((catName) => {
      const label = [...document.querySelectorAll('p, span')].find(el => 
        el.textContent.trim() === catName && el.children.length === 0
      );
      if (!label) return { error: 'Label not found' };

      // Walk up to find role="group"
      let group = label;
      for (let i = 0; i < 10; i++) {
        group = group.parentElement;
        if (!group) break;
        if (group.getAttribute('role') === 'group') break;
      }
      if (!group) return { error: 'Group not found' };

      // Find role="button" card
      const btn = group.querySelector('[role="button"]');
      if (!btn) return { error: 'Button card not found' };

      const r = btn.getBoundingClientRect();
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };
      
      btn.dispatchEvent(new PointerEvent('pointerdown', opts));
      btn.dispatchEvent(new MouseEvent('mousedown', opts));
      btn.dispatchEvent(new PointerEvent('pointerup', opts));
      btn.dispatchEvent(new MouseEvent('mouseup', opts));
      btn.dispatchEvent(new MouseEvent('click', opts));
      
      return { clicked: true, x: Math.round(cx), y: Math.round(cy) };
    }, cat);

    if (clicked.error) {
      console.log(`  ERROR: ${clicked.error}`);
      continue;
    }

    await delay(5000);
    const url = page.url();
    const ingredientId = url.match(/ingredient\/([\w-]+)/)?.[1] || 'unknown';
    ingredientURLs[cat] = { url, ingredientId };
    console.log(`  URL: ${url}`);
    console.log(`  Ingredient ID: ${ingredientId}`);

    // Now read the page content for guidelines
    const content = await page.evaluate(() => {
      const main = document.querySelector('[role="main"]');
      if (!main) return { text: 'no main element' };
      
      // Get all visible text organized
      const allText = main.innerText;
      
      // Find textareas or text content areas
      const textareas = [...document.querySelectorAll('textarea')].map(t => ({
        value: t.value,
        placeholder: t.placeholder
      }));
      
      // Find spans/paragraphs with substantial content
      const contentTexts = [];
      for (const el of main.querySelectorAll('p, span, div')) {
        const text = el.textContent.trim();
        const r = el.getBoundingClientRect();
        if (text.length > 30 && text.length < 500 && el.children.length < 3 && r.width > 100) {
          contentTexts.push({
            tag: el.tagName,
            text: text.substring(0, 200),
            y: Math.round(r.y)
          });
        }
      }
      
      // Get buttons
      const buttons = [...document.querySelectorAll('button')].filter(b => 
        b.getBoundingClientRect().width > 0
      ).map(b => ({
        text: b.textContent.trim().substring(0, 50),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(b.getBoundingClientRect().y)
      }));

      return { 
        title: document.title,
        mainText: allText.substring(0, 2000),
        textareas,
        contentTexts: contentTexts.slice(0, 10),
        buttons: buttons.filter(b => b.y > 100 && b.y < 700)
      };
    });

    console.log(`  Title: ${content.title}`);
    console.log(`  Textareas: ${content.textareas?.length || 0}`);
    if (content.textareas?.length > 0) {
      content.textareas.forEach((t, i) => console.log(`    [${i}]: "${t.value.substring(0, 100)}"`));
    }
    console.log(`  Content texts:`);
    content.contentTexts?.forEach(t => console.log(`    y=${t.y} [${t.tag}]: "${t.text}"`));
    console.log(`  Buttons:`);
    content.buttons?.forEach(b => console.log(`    y=${b.y}: label="${b.label}" text="${b.text}"`));
    
    // Extract key phrases to verify guidelines
    const mainText = content.mainText || '';
    const hasGuidelines = mainText.includes('Summary') || mainText.includes('Do\'s') || mainText.includes('Don\'ts') || 
                          mainText.includes('Resumen') || mainText.includes('alto contraste') || mainText.includes('Geométricos') ||
                          mainText.includes('Minimalistas') || mainText.includes('líneas cian') || mainText.includes('Add a voice') ||
                          mainText.includes('Frecuencia Global habla') || mainText.includes('Add brand assets');
    console.log(`  HAS GUIDELINES: ${hasGuidelines}`);
    
    // Print first meaningful chunk of main text
    const meaningful = mainText.split('\n').filter(l => l.trim().length > 5).slice(0, 15);
    console.log(`  Main text lines:`);
    meaningful.forEach(l => console.log(`    "${l.trim().substring(0, 120)}"`));
  }

  console.log('\n\n=== SUMMARY ===');
  for (const [cat, info] of Object.entries(ingredientURLs)) {
    console.log(`${cat}: ${info.ingredientId}`);
  }

  process.exit(0);
})();
