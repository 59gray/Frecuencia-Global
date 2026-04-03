"""Quick diagnostic: find Customization sidebar element in YouTube Studio."""
from playwright.sync_api import sync_playwright

JS = """() => {
    const items = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
        const txt = el.textContent ? el.textContent.trim() : '';
        if (txt === 'Customization' || txt === 'Personalización') {
            items.push({
                tag: el.tagName,
                id: el.id || '',
                cls: (el.className && el.className.substring) ? el.className.substring(0, 80) : '',
                href: el.getAttribute('href') || '',
                role: el.getAttribute('role') || '',
                visible: el.offsetParent !== null,
                parent_tag: el.parentElement ? el.parentElement.tagName : '',
                parent_id: el.parentElement ? (el.parentElement.id || '') : '',
                gp_tag: (el.parentElement && el.parentElement.parentElement) ? el.parentElement.parentElement.tagName : '',
                gp_id: (el.parentElement && el.parentElement.parentElement) ? (el.parentElement.parentElement.id || '') : '',
            });
        }
    }
    // Also all <a> with href containing "editing"
    const links = document.querySelectorAll('a[href*="editing"]');
    for (const a of links) {
        items.push({
            special: 'A_HREF_EDITING',
            id: a.id || '',
            href: a.getAttribute('href') || '',
            text: (a.textContent || '').trim().substring(0, 50),
            visible: a.offsetParent !== null,
            parent_tag: a.parentElement ? a.parentElement.tagName : '',
            parent_id: a.parentElement ? (a.parentElement.id || '') : '',
        });
    }
    // Check all sidebar menu items
    const menuItems = document.querySelectorAll('[id^="menu-item"]');
    for (const mi of menuItems) {
        items.push({
            special: 'MENU_ITEM',
            id: mi.id,
            tag: mi.tagName,
            text: (mi.textContent || '').trim().substring(0, 40),
            href: mi.getAttribute('href') || '',
            visible: mi.offsetParent !== null,
        });
    }
    return items;
}"""

with sync_playwright() as pw:
    browser = pw.chromium.connect_over_cdp("http://127.0.0.1:9222")
    page = browser.contexts[0].pages[0]
    results = page.evaluate(JS)
    for r in results:
        print(r)
