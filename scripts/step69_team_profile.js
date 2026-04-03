const puppeteer = require('puppeteer-core');
const path = require('path');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 180000);

const TEAM_NAME = 'Frecuencia Global';
const TEAM_DESCRIPTION = 'Análisis internacional con pulso electrónico. Geopolítica, cultura global y relaciones internacionales en formatos accesibles.';
const LOGO_PATH = path.resolve(__dirname, '..', 'Frecuencia_Global_Assets_Base', 'assets', 'fg_isotipo.svg');

(async () => {
  let browser;
  try {
    browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  } catch (e) {
    console.log('CHROME_NOT_CONNECTED:', e.message);
    process.exit(1);
  }

  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];
  console.log('Connected. URL:', page.url());

  // Navigate to Team Profile settings
  console.log('\n=== STEP 1: Navigate to Team Profile ===');
  await page.goto('https://www.canva.com/settings/team-profile', { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);
  console.log('Page loaded:', page.url());

  // Verify we're on the right page
  const pageTitle = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent.trim() : document.title;
  });
  console.log('Page title:', pageTitle);

  // ── STEP 2: Update Team Name ──
  console.log('\n=== STEP 2: Update Team Name ===');
  const nameResult = await updateField(page, 'Name', TEAM_NAME);
  console.log('Name update:', nameResult);

  // ── STEP 3: Update Description ──
  console.log('\n=== STEP 3: Update Description ===');
  const descResult = await updateField(page, 'Description', TEAM_DESCRIPTION);
  console.log('Description update:', descResult);

  // ── STEP 4: Upload Logo ──
  console.log('\n=== STEP 4: Upload Logo ===');
  const logoResult = await uploadLogo(page);
  console.log('Logo upload:', logoResult);

  // ── STEP 5: Final verification ──
  console.log('\n=== STEP 5: Final Verification ===');
  await page.reload({ waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);

  const finalState = await page.evaluate(() => {
    const getText = (label) => {
      const els = [...document.querySelectorAll('p, span, div')];
      const labelEl = els.find(el => el.textContent.trim() === label && el.children.length === 0);
      if (!labelEl) return 'LABEL_NOT_FOUND';
      // Check sibling or parent context for the value
      let container = labelEl.parentElement;
      for (let i = 0; i < 5; i++) {
        if (!container) break;
        const text = container.textContent.replace(label, '').replace('Edit', '').replace('Add', '').replace('Change owner', '').trim();
        if (text.length > 1) return text.substring(0, 100);
        container = container.parentElement;
      }
      return 'VALUE_NOT_FOUND';
    };
    return {
      name: getText('Name'),
      description: getText('Description')
    };
  });

  console.log('\n=== FINAL STATE ===');
  console.log('Name:', finalState.name);
  console.log('Description:', finalState.description);

  const nameOk = finalState.name.includes('Frecuencia Global');
  const descOk = finalState.description.includes('Análisis internacional') || finalState.description.includes('pulso electrónico');
  console.log(`\nName OK: ${nameOk}`);
  console.log(`Description OK: ${descOk}`);
  console.log(`Overall: ${nameOk && descOk ? 'SUCCESS' : 'PARTIAL - check manually'}`);

  process.exit(0);
})();

// Click the Edit/Add button next to a field, clear it, type new value, and save
async function updateField(page, fieldLabel, newValue) {
  try {
    // Find the Edit or Add button near the field label
    const btnInfo = await page.evaluate((label) => {
      const els = [...document.querySelectorAll('p, span, div, h2, h3')];
      const labelEl = els.find(el => {
        const t = el.textContent.trim();
        return t === label && el.children.length === 0;
      });
      if (!labelEl) return { error: `Label "${label}" not found` };

      // Find nearest button (Edit or Add)
      let container = labelEl;
      for (let i = 0; i < 8; i++) {
        container = container.parentElement;
        if (!container) break;
        const btn = container.querySelector('button');
        if (btn) {
          const r = btn.getBoundingClientRect();
          return { 
            x: Math.round(r.x + r.width / 2), 
            y: Math.round(r.y + r.height / 2),
            text: btn.textContent.trim()
          };
        }
      }
      return { error: 'No button found near label' };
    }, fieldLabel);

    if (btnInfo.error) return btnInfo.error;

    console.log(`  Found "${btnInfo.text}" button at (${btnInfo.x}, ${btnInfo.y})`);
    await page.mouse.click(btnInfo.x, btnInfo.y);
    await delay(2000);

    // Now look for an input or textarea that appeared
    const inputFound = await page.evaluate(() => {
      const input = document.querySelector('input[type="text"]:not([hidden]), textarea:not([hidden])');
      if (!input) {
        // Check for contenteditable
        const ce = document.querySelector('[contenteditable="true"]');
        if (ce) return { type: 'contenteditable', tag: ce.tagName };
        // Check inside dialog/modal
        const dialog = document.querySelector('[role="dialog"], [role="modal"]');
        if (dialog) {
          const dinput = dialog.querySelector('input, textarea');
          if (dinput) return { type: dinput.tagName.toLowerCase(), inDialog: true };
        }
        return null;
      }
      return { type: input.tagName.toLowerCase() };
    });

    if (!inputFound) {
      // Maybe clicking opened a panel - try finding input more broadly
      await delay(2000);
      const retry = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, [contenteditable="true"]');
        const visible = [...inputs].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        });
        return visible.map(el => ({ 
          tag: el.tagName, 
          type: el.type || '', 
          ce: el.contentEditable,
          rect: el.getBoundingClientRect()
        }));
      });
      console.log('  Visible inputs after click:', JSON.stringify(retry, null, 2));
      
      if (retry.length === 0) return 'NO_INPUT_FOUND';
    }

    console.log('  Input found:', JSON.stringify(inputFound));

    // Clear existing content and type new value
    if (inputFound && inputFound.type === 'contenteditable') {
      await page.evaluate(() => {
        const ce = document.querySelector('[contenteditable="true"]');
        if (ce) { ce.focus(); ce.textContent = ''; }
      });
      await page.keyboard.type(newValue, { delay: 20 });
    } else {
      // Focus the input/textarea
      const typed = await page.evaluate((val) => {
        const dialog = document.querySelector('[role="dialog"], [role="modal"]');
        const scope = dialog || document;
        const input = scope.querySelector('input[type="text"], textarea');
        if (!input) return false;
        input.focus();
        input.value = '';
        // Trigger React's onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        )?.set || Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype, 'value'
        )?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, '');
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      }, newValue);

      if (!typed) return 'COULD_NOT_FOCUS_INPUT';

      // Select all and delete first, then type
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await delay(300);
      await page.keyboard.type(newValue, { delay: 20 });
    }

    await delay(1000);

    // Look for Save/Done/Submit button
    const saved = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const saveBtn = btns.find(b => {
        const t = b.textContent.trim().toLowerCase();
        return t === 'save' || t === 'done' || t === 'submit' || t === 'save changes';
      });
      if (saveBtn) {
        saveBtn.click();
        return saveBtn.textContent.trim();
      }
      // Try pressing Enter as fallback
      return 'NO_SAVE_BTN';
    });

    if (saved === 'NO_SAVE_BTN') {
      // Try Enter key as fallback
      await page.keyboard.press('Enter');
      console.log('  No save button, pressed Enter');
    } else {
      console.log(`  Clicked "${saved}" button`);
    }

    await delay(3000);
    return 'OK';

  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

async function uploadLogo(page) {
  try {
    // Find the Edit button next to "Logo and home banner"
    const editBtn = await page.evaluate(() => {
      const els = [...document.querySelectorAll('p, span, div, h2, h3')];
      const labelEl = els.find(el => {
        const t = el.textContent.trim();
        return t.includes('Logo') && t.includes('banner');
      });
      if (!labelEl) return { error: 'Logo label not found' };

      let container = labelEl;
      for (let i = 0; i < 8; i++) {
        container = container.parentElement;
        if (!container) break;
        const btn = container.querySelector('button');
        if (btn) {
          const r = btn.getBoundingClientRect();
          return { 
            x: Math.round(r.x + r.width / 2), 
            y: Math.round(r.y + r.height / 2),
            text: btn.textContent.trim()
          };
        }
      }
      return { error: 'No button near logo label' };
    });

    if (editBtn.error) return editBtn.error;

    console.log(`  Found "${editBtn.text}" button at (${editBtn.x}, ${editBtn.y})`);
    await page.mouse.click(editBtn.x, editBtn.y);
    await delay(3000);

    // Look for upload options - could be a modal or new view
    const uploadState = await page.evaluate(() => {
      const body = document.body.innerText;
      const hasUpload = body.includes('Upload') || body.includes('upload');
      const hasLogo = body.includes('logo') || body.includes('Logo');
      const dialog = document.querySelector('[role="dialog"]');
      
      // Find file input
      const fileInput = document.querySelector('input[type="file"]');
      
      // Find upload button
      const btns = [...document.querySelectorAll('button')];
      const uploadBtn = btns.find(b => {
        const t = b.textContent.trim().toLowerCase();
        return t.includes('upload') || t.includes('choose');
      });

      return {
        hasUpload,
        hasLogo,
        hasDialog: !!dialog,
        hasFileInput: !!fileInput,
        uploadBtnText: uploadBtn ? uploadBtn.textContent.trim() : null,
        dialogText: dialog ? dialog.textContent.substring(0, 300) : null
      };
    });

    console.log('  Upload state:', JSON.stringify(uploadState, null, 2));

    // If there's a file input, use it directly
    if (uploadState.hasFileInput) {
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.uploadFile(LOGO_PATH);
        console.log('  File uploaded via input[type="file"]');
        await delay(5000);
        
        // Click save if available
        await page.evaluate(() => {
          const btns = [...document.querySelectorAll('button')];
          const saveBtn = btns.find(b => {
            const t = b.textContent.trim().toLowerCase();
            return t === 'save' || t === 'done' || t === 'apply';
          });
          if (saveBtn) saveBtn.click();
        });
        await delay(3000);
        return 'LOGO_UPLOADED';
      }
    }

    // If there's an upload button, click it first to trigger file input
    if (uploadState.uploadBtnText) {
      const uploadBtn = await page.evaluateHandle(() => {
        const btns = [...document.querySelectorAll('button')];
        return btns.find(b => {
          const t = b.textContent.trim().toLowerCase();
          return t.includes('upload') || t.includes('choose');
        });
      });

      // Prepare file chooser listener before clicking
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser({ timeout: 10000 }).catch(() => null),
        uploadBtn.click()
      ]);

      if (fileChooser) {
        await fileChooser.accept([LOGO_PATH]);
        console.log('  File uploaded via file chooser');
        await delay(5000);

        // Click save
        await page.evaluate(() => {
          const btns = [...document.querySelectorAll('button')];
          const saveBtn = btns.find(b => {
            const t = b.textContent.trim().toLowerCase();
            return t === 'save' || t === 'done' || t === 'apply';
          });
          if (saveBtn) saveBtn.click();
        });
        await delay(3000);
        return 'LOGO_UPLOADED_VIA_CHOOSER';
      }
    }

    // Fallback: Check if there's a hidden file input we can use
    const hiddenInput = await page.$('input[type="file"]');
    if (hiddenInput) {
      await hiddenInput.uploadFile(LOGO_PATH);
      console.log('  File uploaded via hidden input');
      await delay(5000);
      return 'LOGO_UPLOADED_HIDDEN';
    }

    return 'UPLOAD_MECHANISM_NOT_FOUND - may need manual upload';

  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}
