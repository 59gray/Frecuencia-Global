const puppeteer = require('puppeteer-core');
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 180000);

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('canva.com')) || pages[0];

  // Navigate directly to Brand Kit
  const BK = 'https://www.canva.com/brand/kAGEfgAcmZ0';

  // 1. Check COLORS
  console.log('\n===== COLORS =====');
  await page.goto(`${BK}/ingredient/IG-Fxa2jz9p0X1U`, { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);
  const colors = await page.evaluate(() => {
    // Look for color swatches
    const swatches = document.querySelectorAll('[data-testid*="color"], [class*="color"]');
    const allBtns = [...document.querySelectorAll('button')];
    const colorBtns = allBtns.filter(b => {
      const style = b.getAttribute('style') || '';
      return style.includes('background') || b.querySelector('[style*="background"]');
    });
    
    // Get full page text to see what's there
    const text = document.body.innerText;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    const skip = ['Skip navigation','Skip to main','Skip to header','Skip to "Help"',
      'Create','Home','Projects','Templates','Brand','Canva AI','Print Shop',
      'Approvals','More','Main content','Help Assistant','Brand Kit actions',
      'More account and team options'];
    const meaningful = lines.filter(l => !skip.some(s => l === s));
    
    // Look for hex codes
    const hexes = text.match(/#[0-9A-Fa-f]{6}/g) || [];
    
    return {
      swatchCount: swatches.length,
      colorBtns: colorBtns.length,
      hexes,
      meaningful: meaningful.slice(0, 40)
    };
  });
  console.log('Hex codes found:', colors.hexes);
  console.log('Color swatches:', colors.swatchCount, 'Color buttons:', colors.colorBtns);
  console.log('Page content:');
  colors.meaningful.forEach(l => console.log(`  "${l.substring(0, 120)}"`));

  // 2. Check FONTS
  console.log('\n===== FONTS =====');
  await page.goto(`${BK}/ingredient/IG-Fxa2jz9WpmHu`, { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);
  const fonts = await page.evaluate(() => {
    const text = document.body.innerText;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    const skip = ['Skip navigation','Skip to main','Skip to header','Skip to "Help"',
      'Create','Home','Projects','Templates','Brand','Canva AI','Print Shop',
      'Approvals','More','Main content','Help Assistant','Brand Kit actions',
      'More account and team options'];
    const meaningful = lines.filter(l => !skip.some(s => l === s));
    
    // Look for font names
    const fontNames = ['Bebas', 'Space Grotesk', 'JetBrains', 'Mono', 'Heading', 'Subheading', 'Body'];
    const fontLines = meaningful.filter(l => fontNames.some(f => l.toLowerCase().includes(f.toLowerCase())));
    
    return { meaningful: meaningful.slice(0, 40), fontLines };
  });
  console.log('Font-related lines:', fonts.fontLines);
  console.log('Page content:');
  fonts.meaningful.forEach(l => console.log(`  "${l.substring(0, 120)}"`));

  // 3. Check LOGOS
  console.log('\n===== LOGOS =====');
  await page.goto(`${BK}/ingredient/IG-Fxa2jz904gHc`, { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);
  const logos = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    const text = document.body.innerText;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    const skip = ['Skip navigation','Skip to main','Skip to header','Skip to "Help"',
      'Create','Home','Projects','Templates','Brand','Canva AI','Print Shop',
      'Approvals','More','Main content','Help Assistant','Brand Kit actions',
      'More account and team options'];
    const meaningful = lines.filter(l => !skip.some(s => l === s));
    
    return {
      imgCount: imgs.length,
      imgSrcs: imgs.map(i => i.src.substring(0, 100)),
      meaningful: meaningful.slice(0, 30)
    };
  });
  console.log('Images:', logos.imgCount);
  console.log('Image sources:', logos.imgSrcs);
  console.log('Page content:');
  logos.meaningful.forEach(l => console.log(`  "${l.substring(0, 120)}"`));

  // 4. Go back to main page and get the full overview
  console.log('\n===== MAIN BRAND KIT PAGE =====');
  await page.goto(BK, { waitUntil: 'networkidle0', timeout: 60000 });
  await delay(5000);
  
  // Scroll full page and gather all content
  const fullContent = await page.evaluate(async () => {
    // Scroll down incrementally
    const results = [];
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, 400);
      await new Promise(r => setTimeout(r, 500));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 500));
    
    const text = document.body.innerText;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    const skip = ['Skip navigation','Skip to main','Skip to header','Skip to "Help"',
      'Create','Home','Projects','Templates','Brand','Canva AI','Print Shop',
      'Approvals','More','Main content','Help Assistant','Brand Kit actions',
      'More account and team options'];
    return lines.filter(l => !skip.some(s => l === s));
  });
  
  console.log('Full page content:');
  fullContent.forEach(l => console.log(`  "${l.substring(0, 120)}"`));

  console.log('\nDONE');
})();
