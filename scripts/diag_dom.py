"""Diagnóstico DOM: inspecciona la estructura del campo de descripción y el Settings dialog."""
import time, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from youtube_studio_config_cdp import (
    CDP_URL, CHANNEL_ID, cdp_is_ready, navigate_to_profile,
    nuke_beforeunload, dismiss_dialogs_and_overlays,
)
from playwright.sync_api import sync_playwright

def main():
    if not cdp_is_ready():
        print("Chrome CDP no disponible en puerto 9222")
        return

    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp(CDP_URL)
        ctx = browser.contexts[0]
        page = ctx.pages[0]

        # ── 1. Diagnosticar campo de descripción en Profile ──
        print("\n=== DIAGNÓSTICO 1: Profile > Description ===")
        navigate_to_profile(page)
        time.sleep(3)

        # Scroll down para encontrar el campo de descripción
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)

        # Inspeccionar todos los elementos editables
        result = page.evaluate("""() => {
            const info = {textareas: [], contenteditables: [], inputs: []};
            
            // Textareas
            document.querySelectorAll('textarea').forEach(el => {
                info.textareas.push({
                    id: el.id,
                    name: el.name,
                    ariaLabel: el.getAttribute('aria-label'),
                    placeholder: el.placeholder,
                    visible: el.offsetParent !== null,
                    parent: el.parentElement?.tagName + '.' + el.parentElement?.className?.split(' ').slice(0,2).join('.'),
                    grandparent: el.parentElement?.parentElement?.id || el.parentElement?.parentElement?.tagName,
                    value: el.value?.substring(0, 50),
                });
            });
            
            // Contenteditable divs
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                info.contenteditables.push({
                    tag: el.tagName,
                    id: el.id,
                    ariaLabel: el.getAttribute('aria-label'),
                    parent: el.parentElement?.tagName + '#' + el.parentElement?.id,
                    text: el.textContent?.substring(0, 50),
                    visible: el.offsetParent !== null,
                });
            });
            
            // Inputs near description labels
            const descLabel = [...document.querySelectorAll('*')].find(
                e => e.textContent?.trim() === 'Description' && e.offsetParent !== null
            );
            if (descLabel) {
                info.descLabelFound = true;
                info.descLabelTag = descLabel.tagName;
                info.descLabelParent = descLabel.parentElement?.id || descLabel.parentElement?.className?.split(' ').slice(0,2).join('.');
                // Look for editable sibling/descendant
                const container = descLabel.closest('[id*="description"], [class*="description"]') 
                                || descLabel.parentElement;
                if (container) {
                    info.containerTag = container.tagName;
                    info.containerId = container.id;
                    info.containerChildren = [...container.querySelectorAll('textarea, [contenteditable], input, iron-autogrow-textarea')].map(
                        e => ({tag: e.tagName, id: e.id, editable: e.getAttribute('contenteditable'), visible: e.offsetParent !== null})
                    );
                }
            } else {
                info.descLabelFound = false;
            }
            
            // Look for iron-autogrow-textarea
            const irons = document.querySelectorAll('iron-autogrow-textarea');
            info.ironAutoGrow = [...irons].map(e => ({
                id: e.id,
                parent: e.parentElement?.id || e.parentElement?.tagName,
                visible: e.offsetParent !== null,
            }));
            
            // ytcp-social-suggestions-textbox
            const socials = document.querySelectorAll('ytcp-social-suggestions-textbox');
            info.socialSuggestions = [...socials].map(e => ({
                id: e.id,
                parentId: e.parentElement?.id,
                visible: e.offsetParent !== null,
                innerTextareas: e.querySelectorAll('textarea').length,
                innerContentEditable: e.querySelectorAll('[contenteditable]').length,
                innerDivs: [...e.querySelectorAll('div')].filter(d => d.offsetParent !== null).length,
            }));
            
            return info;
        }""")
        
        import json
        print(json.dumps(result, indent=2, ensure_ascii=False))

        # Take screenshot scrolled down
        page.screenshot(path=os.path.join(os.path.dirname(__file__), "diag_profile_scrolled.png"), timeout=8000)

        # ── 2. Diagnosticar Settings dialog ──
        print("\n=== DIAGNÓSTICO 2: Settings Dialog ===")
        studio_url = f"https://studio.youtube.com/channel/{CHANNEL_ID}"
        nuke_beforeunload(page)
        page.goto(studio_url, wait_until="domcontentloaded", timeout=30000)
        try:
            page.wait_for_load_state("networkidle", timeout=12000)
        except Exception:
            pass
        time.sleep(4)

        # Click Settings
        try:
            page.locator('#settings-item').first.click(timeout=5000)
            time.sleep(4)
        except Exception as e:
            print(f"Settings click failed: {e}")
            return

        dialog_info = page.evaluate("""() => {
            const info = {dialogs: [], settingsTexts: []};
            
            // All dialog-like elements
            document.querySelectorAll('[role="dialog"], tp-yt-paper-dialog, ytcp-settings-dialog, .dialog, [class*="dialog"]').forEach(el => {
                info.dialogs.push({
                    tag: el.tagName,
                    id: el.id,
                    role: el.getAttribute('role'),
                    className: el.className?.split(' ').slice(0,3).join(' '),
                    visible: el.offsetParent !== null || window.getComputedStyle(el).display !== 'none',
                });
            });
            
            // Check for Settings heading
            const headings = document.querySelectorAll('h1, h2, h3, [class*="title"], [class*="heading"]');
            headings.forEach(h => {
                if (h.textContent?.includes('Settings') || h.textContent?.includes('Configuración')) {
                    info.settingsTexts.push({
                        tag: h.tagName,
                        text: h.textContent.trim().substring(0, 50),
                        visible: h.offsetParent !== null,
                    });
                }
            });
            
            // Check tab items in dialog
            const tabs = document.querySelectorAll('[class*="tab"], [class*="nav-item"], [class*="side-nav"]');
            info.tabElements = [...tabs].filter(t => t.offsetParent !== null).map(t => ({
                tag: t.tagName,
                text: t.textContent?.trim().substring(0, 30),
                className: t.className?.split(' ').slice(0,2).join(' '),
            })).slice(0, 15);
            
            // ytcp-settings-dialog specific
            const sd = document.querySelector('ytcp-settings-dialog');
            if (sd) {
                info.settingsDialog = {
                    display: window.getComputedStyle(sd).display,
                    visibility: window.getComputedStyle(sd).visibility,
                    opacity: window.getComputedStyle(sd).opacity,
                    hasInnerDialog: !!sd.querySelector('tp-yt-paper-dialog'),
                };
            }
            
            return info;
        }""")
        
        print(json.dumps(dialog_info, indent=2, ensure_ascii=False))
        page.screenshot(path=os.path.join(os.path.dirname(__file__), "diag_settings.png"), timeout=8000)

        print("\n=== DIAGNÓSTICO COMPLETO ===")


if __name__ == "__main__":
    main()
