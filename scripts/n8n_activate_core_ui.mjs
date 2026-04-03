import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import {
  chromeExecutable,
  repoPath,
} from './fg_automation_config.mjs';

const BASE_URL = (process.env.FG_N8N_BASE_URL ?? 'https://frecuenciaglobal.app.n8n.cloud').replace(/\/$/, '');
const WORKFLOWS_URL = `${BASE_URL}/home/workflows`;
const TARGETS = ['WF-001', 'WF-002', 'WF-003', 'WF-005', 'WF-006'];
const CHROME_EXE = chromeExecutable();
const USER_DATA_DIR = repoPath('.chrome-n8n-cloud');
const ARTIFACTS_DIR = repoPath('scripts', 'tmp_n8n');
const LOGIN_EMAIL = process.env.FG_N8N_EMAIL ?? '';
const LOGIN_PASSWORD = process.env.FG_N8N_PASSWORD ?? '';

function log(message) {
  console.log(`[n8n-ui] ${message}`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function pause(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function saveScreenshot(page, name) {
  ensureDir(ARTIFACTS_DIR);
  const filePath = path.join(ARTIFACTS_DIR, name);
  await page.screenshot({ path: filePath, fullPage: false });
  log(`screenshot: ${filePath}`);
}

async function getActivePage(context) {
  for (const page of context.pages()) {
    if (!page.isClosed()) {
      return page;
    }
  }

  return context.newPage();
}

async function searchInput(page) {
  const candidates = [
    page.getByPlaceholder('Search'),
    page.locator('input[placeholder*="Search" i]'),
    page.locator('input[type="search"]'),
  ];

  for (const locator of candidates) {
    try {
      const count = await locator.count();
      if (!count) {
        continue;
      }

      const first = locator.first();
      if (await first.isVisible()) {
        return first;
      }
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

async function visibleSwitch(page) {
  const switches = page.getByRole('switch');
  const count = await switches.count();

  for (let index = 0; index < count; index += 1) {
    const candidate = switches.nth(index);
    try {
      if (await candidate.isVisible()) {
        return candidate;
      }
    } catch {
      // Ignore detached locators.
    }
  }

  return null;
}

async function listVisibleButtons(page) {
  return page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('button, [role="button"]'));
    return nodes
      .filter((node) => node instanceof HTMLElement && node.offsetParent !== null)
      .map((node) => (node.innerText || node.getAttribute('aria-label') || '').trim())
      .filter(Boolean)
      .slice(0, 25);
  });
}

async function filterWorkflowList(page, target) {
  const input = await searchInput(page);
  if (!input) {
    throw new Error('Could not find the workflow search input.');
  }

  await input.click();
  await input.fill(target);
  await pause(1200);
}

async function getWorkflowCardState(page, target) {
  return page.evaluate((workflowName) => {
    const cards = Array.from(document.querySelectorAll('.card, [class*="cardLink"]'));
    const match = cards.find((card) => {
      const text = (card.textContent || '').trim();
      return text.includes(workflowName);
    });

    if (!match) {
      return null;
    }

    const text = (match.textContent || '').toLowerCase();
    if (text.includes('published')) {
      return 'published';
    }

    return 'listed';
  }, target);
}

async function openWorkflowCard(page, target) {
  return page.evaluate((workflowName) => {
    const elements = Array.from(document.querySelectorAll('h2, a, div, span'));
    const titleNode = elements.find((element) => {
      const text = (element.textContent || '').trim();
      return text === workflowName || text.startsWith(workflowName);
    });

    if (!titleNode) {
      return false;
    }

    const clickable =
      titleNode.closest('[class*="cardLink"]') ||
      titleNode.closest('.card') ||
      titleNode.closest('a') ||
      titleNode;

    clickable.scrollIntoView({ block: 'center', inline: 'nearest' });
    clickable.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }));
    return true;
  }, target);
}

async function detectLoginForm(page) {
  const emailCandidates = [
    page.getByLabel(/email/i),
    page.locator('input[type="email"]'),
    page.locator('input[name="email"]'),
  ];
  const passwordCandidates = [
    page.getByLabel(/password/i),
    page.locator('input[type="password"]'),
    page.locator('input[name="password"]'),
  ];

  let emailInput = null;
  let passwordInput = null;

  for (const candidate of emailCandidates) {
    try {
      const first = candidate.first();
      if (await first.isVisible()) {
        emailInput = first;
        break;
      }
    } catch {
      // Try the next email candidate.
    }
  }

  for (const candidate of passwordCandidates) {
    try {
      const first = candidate.first();
      if (await first.isVisible()) {
        passwordInput = first;
        break;
      }
    } catch {
      // Try the next password candidate.
    }
  }

  if (emailInput && passwordInput) {
    return { emailInput, passwordInput };
  }

  return null;
}

async function loginIfNeeded(page, state) {
  const form = await detectLoginForm(page);
  if (!form) {
    return false;
  }

  if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
    if (!state.loginPrompted) {
      log('LOGIN_REQUIRED - sign in manually in the Chrome window opened by the script.');
      log('After the first successful login, this profile should keep the session for future runs.');
      state.loginPrompted = true;
    }
    return false;
  }

  if (state.loginAttempted) {
    return false;
  }

  state.loginAttempted = true;
  log('Trying automatic login with FG_N8N_EMAIL and FG_N8N_PASSWORD...');

  await form.emailInput.fill(LOGIN_EMAIL);
  await form.passwordInput.fill(LOGIN_PASSWORD);

  const submitButton = page.getByRole('button', { name: /sign in|login/i }).first();
  await submitButton.click();
  await pause(2500);
  return true;
}

async function ensureWorkflowsPage(page) {
  await page.goto(WORKFLOWS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const startedAt = Date.now();
  const maxWaitMs = 10 * 60 * 1000;
  let announced = false;
  const state = { loginAttempted: false, loginPrompted: false };

  while (Date.now() - startedAt < maxWaitMs) {
    await loginIfNeeded(page, state);

    const input = await searchInput(page);
    if (input) {
      await input.waitFor({ state: 'visible', timeout: 10000 });
      return;
    }

    if (!announced) {
      log('WAITING_FOR_LOGIN - if Chrome shows the n8n login page, sign in there.');
      log('The script will resume automatically when the workflows screen is ready.');
      announced = true;
    }

    await pause(2000);
    if (!page.url().startsWith(BASE_URL)) {
      await page.goto(WORKFLOWS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    }
  }

  await saveScreenshot(page, 'login_timeout.png');
  throw new Error('The workflows screen was not detected. Check your login and permissions in n8n Cloud.');
}

async function openWorkflowFromList(page, target) {
  await ensureWorkflowsPage(page);
  await filterWorkflowList(page, target);

  const openedByCard = await openWorkflowCard(page, target);
  if (!openedByCard) {
    const title = page.getByText(target, { exact: false }).first();
    await title.waitFor({ state: 'visible', timeout: 15000 });
    await title.click();
  }

  await pause(1200);

  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if ((await visibleSwitch(page)) || !(await searchInput(page))) {
      break;
    }
    await pause(500);
  }

  await pause(1500);
}

async function clickVisibleButton(page, patterns) {
  for (const pattern of patterns) {
    const button = page.getByRole('button', { name: pattern }).first();
    try {
      await button.waitFor({ state: 'visible', timeout: 1500 });
      await button.click();
      await pause(1200);
      return pattern;
    } catch {
      // Try the next button candidate.
    }
  }

  return null;
}

async function confirmActivationIfNeeded(page) {
  const match = await clickVisibleButton(page, [/publish/i, /activate/i, /turn on/i, /save/i, /confirm/i]);
  return Boolean(match);
}

async function activateWorkflow(page, target) {
  log(`processing ${target}...`);
  await ensureWorkflowsPage(page);
  await filterWorkflowList(page, target);

  const cardState = await getWorkflowCardState(page, target);
  if (cardState === 'published') {
    log(`${target} is already active from the list view.`);
    return 'already_active';
  }

  await openWorkflowFromList(page, target);

  const switchLocator = await visibleSwitch(page);
  if (switchLocator) {
    const checked = await switchLocator.getAttribute('aria-checked');
    if (checked === 'true') {
      log(`${target} is already active.`);
      return 'already_active';
    }

    await switchLocator.click();
    await pause(1200);
    await confirmActivationIfNeeded(page);

    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      const current = await switchLocator.getAttribute('aria-checked').catch(() => null);
      if (current === 'true') {
        log(`${target} activated.`);
        return 'activated';
      }
      await pause(1000);
    }
  }

  const pattern = await clickVisibleButton(page, [/publish/i, /activate/i, /turn on/i]);
  if (pattern) {
    await confirmActivationIfNeeded(page);
    log(`${target} activated via button ${pattern}.`);
    return 'activated';
  }

  await saveScreenshot(page, `${target}_activation_failed.png`);
  const buttons = await listVisibleButtons(page);
  throw new Error(`Could not find an activation control for ${target}. Visible buttons: ${buttons.join(' | ')}`);
}

async function main() {
  if (!CHROME_EXE || !fs.existsSync(CHROME_EXE)) {
    throw new Error(`Chrome not found. Set FG_CHROME_EXE or install Chrome. Checked path: ${CHROME_EXE}`);
  }

  ensureDir(ARTIFACTS_DIR);

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_EXE,
    args: ['--start-maximized', '--no-first-run', '--no-default-browser-check'],
    viewport: null,
  });

  try {
    let page = await getActivePage(context);

    page.on('dialog', async (dialog) => {
      try {
        await dialog.accept();
      } catch {
        // Ignore dialogs that cannot be accepted.
      }
    });

    await ensureWorkflowsPage(page);

    const summary = {};
    for (const target of TARGETS) {
      page = await getActivePage(context);
      summary[target] = await activateWorkflow(page, target);
      await page.goto(WORKFLOWS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await pause(1200);
    }

    log('final summary:');
    for (const [target, status] of Object.entries(summary)) {
      log(`  ${target}: ${status}`);
    }

    await saveScreenshot(page, 'core_activation_done.png');
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  console.error(`[n8n-ui] ERROR: ${error.message}`);
  process.exit(1);
});
