const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 120000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate fresh to main Brand Kit page  
  await page.goto('https://www.canva.com/brand/kAGEfgAcmZ0', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);
  
  // Scroll to make Logos visible 
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(1000);

  console.log('URL before:', page.url());

  // Map all labeled sections on the page and find Logos card 
  const pageMap = await page.evaluate(() => {
    // Find all category labels  
    const labels = [...document.querySelectorAll('p')].filter(p => {
      const text = p.textContent.trim();
      return ['Logos', 'Colors', 'Fonts', 'Brand voice', 'Photos', 'Graphics', 'Icons', 'Charts', 'New category'].includes(text);
    }).map(p => {
      const r = p.getBoundingClientRect();
      return { text: p.textContent.trim(), y: Math.round(r.y), x: Math.round(r.x) };
    });

    // Find the "Logos" label, then find its parent group and the clickable card
    const logosP = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === 'Logos');
    if (!logosP) return { error: 'No Logos label', labels };

    // Walk up to find the role="group" ancestor
    let group = logosP;
    let groupData = null;
    for (let i = 0; i < 10; i++) {
      group = group.parentElement;
      if (!group) break;
      if (group.getAttribute('role') === 'group') {
        const r = group.getBoundingClientRect();
        groupData = {
          tag: group.tagName,
          y: Math.round(r.y),
          x: Math.round(r.x),
          w: Math.round(r.width),
          h: Math.round(r.height),
          children: group.children.length,
          childTags: [...group.children].map(c => ({
            tag: c.tagName,
            role: c.getAttribute('role'),
            text: c.textContent.trim().substring(0, 30),
            y: Math.round(c.getBoundingClientRect().y),
            w: Math.round(c.getBoundingClientRect().width),
            h: Math.round(c.getBoundingClientRect().height)
          }))
        };
        break;
      }
    }

    // Find the role="button" card that is a child or descendant of the group
    let buttonCard = null;
    if (group) {
      const btn = group.querySelector('[role="button"]');
      if (btn) {
        const r = btn.getBoundingClientRect();
        const fiber = Object.keys(btn).find(k => k.startsWith('__reactFiber'));
        let onClickInfo = null;
        if (fiber) {
          let f = btn[fiber];
          for (let step = 0; step < 15; step++) {
            if (!f) break;
            if (f.memoizedProps?.onClick) {
              onClickInfo = { depth: step, type: f.memoizedProps.onClick.toString().substring(0, 60) };
              break;
            }
            f = f.return;
          }
        }
        buttonCard = {
          y: Math.round(r.y),
          x: Math.round(r.x),
          w: Math.round(r.width),
          h: Math.round(r.height),
          innerHTML: btn.innerHTML.substring(0, 200),
          tabIndex: btn.tabIndex,
          onClick: onClickInfo
        };
      }
    }

    return { labels, groupData, buttonCard };
  });

  console.log('\nCategory labels:', JSON.stringify(pageMap.labels));
  console.log('\nLogos group:', JSON.stringify(pageMap.groupData, null, 2));
  console.log('\nLogos button card:', JSON.stringify(pageMap.buttonCard, null, 2));

  if (!pageMap.buttonCard) {
    console.log('ERROR: No button card found');
    process.exit(1);
  }

  // Click on the Logos label using React dispatch to navigate
  // First try clicking the label itself
  const navResult = await page.evaluate(() => {
    // Find the Logos group
    const logosP = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === 'Logos');
    let group = logosP;
    for (let i = 0; i < 10; i++) {
      group = group.parentElement;
      if (!group) break;
      if (group.getAttribute('role') === 'group') break;
    }
    if (!group) return { error: 'No group' };

    // Find all clickable things within the group
    const clickables = [];
    for (const el of group.querySelectorAll('*')) {
      const fiber = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      if (!fiber) continue;
      let f = el[fiber];
      if (f?.memoizedProps?.onClick) {
        const r = el.getBoundingClientRect();
        clickables.push({
          tag: el.tagName,
          role: el.getAttribute('role'),
          text: el.textContent.trim().substring(0, 30),
          y: Math.round(r.y),
          h: Math.round(r.height),
          onClickStr: f.memoizedProps.onClick.toString().substring(0, 80)
        });
      }
    }
    return { clickables };
  });

  console.log('\nAll clickable elements in Logos group:');
  navResult.clickables?.forEach(c => 
    console.log(`  [${c.tag}] role=${c.role} y=${c.y} h=${c.h}: "${c.text}" onClick=${c.onClickStr}`)
  );

  // Now click the Logos label using the proven React dispatch pattern
  console.log('\n--- Clicking Logos label with React dispatch ---');
  const urlBefore = page.url();
  
  await page.evaluate(() => {
    const logosP = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === 'Logos');
    if (!logosP) return;
    
    // Walk up to find the first element with onClick in its props
    let target = logosP;
    for (let i = 0; i < 5; i++) {
      target = target.parentElement;
      if (!target) break;
      const fiber = Object.keys(target).find(k => k.startsWith('__reactFiber'));
      if (fiber && target[fiber]?.memoizedProps?.onClick) break;
    }
    if (!target) return;
    
    // Dispatch events
    const r = target.getBoundingClientRect();
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };
    
    target.dispatchEvent(new PointerEvent('pointerdown', opts));
    target.dispatchEvent(new MouseEvent('mousedown', opts));
    target.dispatchEvent(new PointerEvent('pointerup', opts));
    target.dispatchEvent(new MouseEvent('mouseup', opts));
    target.dispatchEvent(new MouseEvent('click', opts));
  });

  await delay(5000);
  console.log('URL after label click:', page.url());

  if (page.url() === urlBefore) {
    // Try clicking the role="button" card instead
    console.log('Label click did not navigate. Trying role="button" card...');
    
    await page.evaluate(() => {
      const logosP = [...document.querySelectorAll('p')].find(p => p.textContent.trim() === 'Logos');
      let group = logosP;
      for (let i = 0; i < 10; i++) {
        group = group.parentElement;
        if (!group) break;
        if (group.getAttribute('role') === 'group') break;
      }
      if (!group) return;
      
      const btn = group.querySelector('[role="button"]');
      if (!btn) return;
      
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

    await delay(5000);
    console.log('URL after card click:', page.url());
  }

  // Check page content after navigation
  const content = await page.evaluate(() => {
    const main = document.querySelector('[role="main"]') || document.querySelector('main');
    return {
      url: window.location.href,
      title: document.title,
      mainText: main?.textContent?.trim().substring(0, 500) || 'no main',
      buttons: [...document.querySelectorAll('button')].map(b => ({
        text: b.textContent.trim().substring(0, 40),
        label: b.getAttribute('aria-label') || '',
        y: Math.round(b.getBoundingClientRect().y),
        visible: b.getBoundingClientRect().width > 0
      })).filter(b => b.visible),
      inputs: [...document.querySelectorAll('input')].map(i => ({
        type: i.type, accept: i.accept
      }))
    };
  });

  console.log('\n=== AFTER NAVIGATION ===');
  console.log('URL:', content.url);
  console.log('Title:', content.title);
  console.log('Main content:', content.mainText);
  console.log('Buttons:', JSON.stringify(content.buttons));
  console.log('Inputs:', JSON.stringify(content.inputs));

  process.exit(0);
})();
