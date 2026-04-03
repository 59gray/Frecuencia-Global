import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import {
  chromeExecutable,
  repoPath,
  PODCAST_SLUG,
  PODCAST_SHOW_URL,
} from './fg_automation_config.mjs';

const RSS_BASE_URL = 'https://rss.com';
const DASHBOARD_BASE_URL = 'https://dashboard.rss.com';
const LOGIN_URL = `${DASHBOARD_BASE_URL}/auth/sign-in/`;
const USER_DATA_DIR = repoPath('.chrome-rsscom');
const ARTIFACTS_DIR = repoPath('scripts', 'tmp_rsscom');
const CHROME_EXE = chromeExecutable();

const EMAIL = process.env.RSSCOM_EMAIL ?? '';
const PASSWORD = process.env.RSSCOM_PASSWORD ?? '';
const PODCAST_TITLE = process.env.FG_PODCAST_TITLE ?? 'Frecuencia Global Podcast';
const PODCAST_DESCRIPTION =
  process.env.FG_PODCAST_DESCRIPTION ??
  'Analisis internacional, cultura y tecnologia con salida en audio podcast y videopodcast en YouTube.';
const PODCAST_AUTHOR = process.env.FG_PODCAST_AUTHOR ?? 'Farid Assad';
const PODCAST_COPYRIGHT = process.env.FG_PODCAST_COPYRIGHT ?? 'Frecuencia Global 2026';
const PODCAST_LANGUAGE = process.env.FG_PODCAST_LANGUAGE ?? 'Español - México';
const PODCAST_PRIMARY_CATEGORY = process.env.FG_PODCAST_PRIMARY_CATEGORY ?? 'News';
const WAIT_LOGIN_MS = Number(process.env.RSSCOM_WAIT_LOGIN_MS ?? 900000);
const WAIT_MANUAL_CREATE_MS = Number(process.env.RSSCOM_WAIT_MANUAL_CREATE_MS ?? 900000);
const CREATE_IF_MISSING = !['0', 'false', 'no'].includes(String(process.env.RSSCOM_CREATE_IF_MISSING ?? '1').toLowerCase());

function log(message) {
  console.log(`[rsscom] ${message}`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function pause(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getActivePage(context) {
  for (const page of context.pages()) {
    if (!page.isClosed()) {
      return page;
    }
  }
  return context.newPage();
}

async function saveScreenshot(page, name) {
  ensureDir(ARTIFACTS_DIR);
  const filePath = path.join(ARTIFACTS_DIR, name);
  await page.screenshot({ path: filePath, fullPage: true });
  log(`screenshot: ${filePath}`);
}

async function closeCookieBanner(page) {
  const closeButton = await firstVisible(page, [
    page.getByRole('button', { name: /^close$/i }),
    page.locator('button:has-text("Close")'),
  ]);

  if (closeButton) {
    await closeButton.click({ force: true }).catch(() => {});
    await pause(500);
  }
}

async function firstVisible(page, locators) {
  for (const locator of locators) {
    try {
      const count = await locator.count();
      if (!count) continue;
      const first = locator.first();
      if (await first.isVisible()) {
        return first;
      }
    } catch {
      // Try the next locator.
    }
  }
  return null;
}

async function pageText(page) {
  try {
    return (await page.locator('body').innerText()).trim();
  } catch {
    return '';
  }
}

async function isAuthenticated(page) {
  const currentUrl = page.url().toLowerCase();
  if (currentUrl.includes('/auth/sign-in') || currentUrl.includes('/login') || currentUrl.includes('/sign-up')) {
    return false;
  }

  const passwordInput = await firstVisible(page, [
    page.locator('input[type="password"]'),
    page.locator('input[name*="password" i]'),
  ]);

  if (passwordInput) {
    return false;
  }

  const text = (await pageText(page)).toLowerCase();
  if (currentUrl.includes('/dashboard') || currentUrl.includes('/episodes') || currentUrl.includes('/distribution')) {
    return true;
  }

  if (
    text.includes('new podcast') ||
    text.includes('my podcasts') ||
    text.includes('distribution') ||
    text.includes('monetization')
  ) {
    return true;
  }

  const dashboardLink = await firstVisible(page, [
    page.locator('a[href*="/dashboard"]'),
    page.locator('a[href*="/episodes"]'),
    page.locator('a[href*="/distribution"]'),
    page.locator('a[href*="/podcasts"]'),
  ]);

  return Boolean(dashboardLink);
}

async function waitForAuthenticated(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if (await isAuthenticated(page)) {
        return true;
      }
      await pause(2000);
    } catch {
      await pause(2000);
    }
  }
  return false;
}

async function login(page) {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await pause(2000);

  if (await isAuthenticated(page)) {
    log('session already authenticated');
    return;
  }

  if (!EMAIL || !PASSWORD) {
    throw new Error('Missing RSSCOM_EMAIL or RSSCOM_PASSWORD');
  }

  const emailInput = await firstVisible(page, [
    page.locator('input[type="email"]'),
    page.locator('input[name*="email" i]'),
    page.locator('input[name*="login" i]'),
    page.locator('input[name*="user" i]'),
    page.locator('input[type="text"]'),
  ]);
  const passwordInput = await firstVisible(page, [
    page.locator('input[type="password"]'),
    page.locator('input[name*="password" i]'),
  ]);

  if (!emailInput || !passwordInput) {
    await saveScreenshot(page, 'rsscom_login_missing_fields.png');
    throw new Error('Could not find RSS.com login form fields');
  }

  await emailInput.click();
  await emailInput.fill(EMAIL);
  await passwordInput.click();
  await passwordInput.fill(PASSWORD);

  const submitButton = await firstVisible(page, [
    page.getByRole('button', { name: /log in|login|sign in|continue/i }),
    page.locator('button[type="submit"]'),
    page.locator('input[type="submit"]'),
  ]);

  if (!submitButton) {
    await saveScreenshot(page, 'rsscom_login_missing_submit.png');
    throw new Error('Could not find RSS.com login submit button');
  }

  await Promise.allSettled([
    page.waitForLoadState('networkidle', { timeout: 30000 }),
    submitButton.click(),
  ]);

  if (await waitForAuthenticated(page, 25000)) {
    log('login completed');
    return;
  }

  log('waiting for manual login completion in browser');
  if (!(await waitForAuthenticated(page, WAIT_LOGIN_MS))) {
    await saveScreenshot(page, 'rsscom_login_timeout.png');
    throw new Error('Timeout waiting for RSS.com login');
  }
}

async function collectPublicPodcastLinks(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="/podcasts/"]'))
      .map((anchor) => ({
        href: anchor.href,
        text: (anchor.textContent || '').trim(),
      }))
      .filter((entry) => entry.href && !entry.href.includes('/podcasts/new'))
  );
}

async function openDashboard(page) {
  const candidates = [
    `${DASHBOARD_BASE_URL}/`,
    `${DASHBOARD_BASE_URL}/dashboard/`,
    `${DASHBOARD_BASE_URL}/dashboard`,
    `${DASHBOARD_BASE_URL}/podcasts`,
    `${RSS_BASE_URL}/dashboard/`,
    RSS_BASE_URL,
  ];

  for (const candidate of candidates) {
    try {
      await page.goto(candidate, { waitUntil: 'domcontentloaded', timeout: 90000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('ERR_ABORTED')) {
        throw error;
      }
    }
    await pause(2500);
    if (await isAuthenticated(page)) {
      return;
    }
  }
}

async function resolveExistingShow(page) {
  await openDashboard(page);
  const links = await collectPublicPodcastLinks(page);
  const normalizedSlug = slugify(PODCAST_SLUG);
  const normalizedTitle = slugify(PODCAST_TITLE);

  for (const link of links) {
    const hrefSlug = slugify(link.href.split('/podcasts/')[1] || '');
    const textSlug = slugify(link.text);
    if (hrefSlug === normalizedSlug || textSlug === normalizedTitle || hrefSlug.includes(normalizedSlug)) {
      return link.href.replace(/\/$/, '');
    }
  }

  return null;
}

async function requestUrlStatus(page, url) {
  try {
    const response = await page.request.get(url, { timeout: 30000 });
    return response.status();
  } catch {
    return null;
  }
}

async function deriveFeedUrl(showUrl) {
  const slug = (showUrl.split('/podcasts/')[1] || PODCAST_SLUG).replace(/\/$/, '');
  return `https://media.rss.com/${slug}/feed.xml`;
}

function toPublicShowUrl(showUrl) {
  const slug = (showUrl.split('/podcasts/')[1] || PODCAST_SLUG).replace(/\/$/, '');
  return `https://rss.com/podcasts/${slug}`;
}

async function fillCreatePodcastForm(page) {
  await closeCookieBanner(page);

  const titleInput = await firstVisible(page, [
    page.locator('input[name*="title" i]'),
    page.locator('input[placeholder*="podcast" i]'),
    page.locator('input[placeholder*="title" i]'),
  ]);

  if (titleInput) {
    await titleInput.click();
    await titleInput.fill(PODCAST_TITLE);
  }

  const descriptionInput = await firstVisible(page, [
    page.locator('#description[contenteditable="true"]'),
    page.locator('[role="textbox"]#description'),
    page.locator('.ProseMirror#description'),
    page.locator('textarea[name*="description" i]'),
    page.locator('textarea[placeholder*="description" i]'),
    page.locator('textarea:not([name="g-recaptcha-response"])'),
    page.locator('[contenteditable="true"]'),
  ]);

  if (descriptionInput) {
    await descriptionInput.click();
    try {
      await descriptionInput.fill(PODCAST_DESCRIPTION);
    } catch {
      await page.keyboard.insertText(PODCAST_DESCRIPTION);
    }
  } else {
    await page.evaluate((description) => {
      const hidden = document.querySelector('input[name="description"]');
      if (!hidden) return;
      hidden.value = description;
      hidden.dispatchEvent(new Event('input', { bubbles: true }));
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    }, PODCAST_DESCRIPTION);
  }

  const slugInput = await firstVisible(page, [
    page.locator('input[name*="slug" i]'),
    page.locator('input[name*="url" i]'),
    page.locator('input[placeholder*="url" i]'),
    page.locator('input[placeholder*="address" i]'),
  ]);

  if (slugInput) {
    await slugInput.click();
    await slugInput.fill(PODCAST_SLUG);
  }
}

async function pickCategory(page, categoryName) {
  const trigger = page.locator('[data-testid="podcastFormCategorySelect"]').first();
  await trigger.click({ force: true });
  await pause(1000);

  const option = await firstVisible(page, [
    page.getByText(new RegExp(`^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')),
    page.locator(`[role="option"] >> text=${categoryName}`),
    page.locator(`text="${categoryName}"`),
  ]);

  if (!option) {
    throw new Error(`Could not find podcast category option: ${categoryName}`);
  }

  await option.click({ force: true }).catch(async () => {
    await page.evaluate((text) => {
      const nodes = Array.from(document.querySelectorAll('*'));
      const match = nodes.find((node) => (node.textContent || '').trim() === text);
      if (match) {
        match.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }, categoryName);
  });
  await pause(1000);
}

async function fillPodcastDetailsStep(page) {
  await pickCategory(page, PODCAST_PRIMARY_CATEGORY);

  const primaryCategoryTrigger = await firstVisible(page, [
    page.locator('[data-testid="podcastFormPrimaryCategorySelect"]'),
    page.locator('button[data-testid="podcastFormPrimaryCategorySelect"]'),
  ]);

  if (primaryCategoryTrigger) {
    await primaryCategoryTrigger.click({ force: true }).catch(() => {});
    await pause(800);
    const primaryOption = await firstVisible(page, [
      page.getByText(new RegExp(`^${PODCAST_PRIMARY_CATEGORY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')),
      page.locator(`[role="option"] >> text=${PODCAST_PRIMARY_CATEGORY}`),
      page.locator(`text="${PODCAST_PRIMARY_CATEGORY}"`),
    ]);
    if (primaryOption) {
      await primaryOption.click({ force: true }).catch(() => {});
      await pause(500);
    }
  }

  const languageSelect = page.locator('select').nth(1);
  const languageChosen = await languageSelect.selectOption({ label: PODCAST_LANGUAGE }).catch(async () => {
    const value = await page.evaluate((label) => {
      const select = document.querySelectorAll('select')[1];
      if (!select) return null;
      const options = Array.from(select.options);
      const match = options.find((option) => option.label === label || option.text === label);
      if (!match) return null;
      select.value = match.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return match.value;
    }, PODCAST_LANGUAGE);
    return value ? [{ value }] : [];
  });

  if (!languageChosen || languageChosen.length === 0) {
    throw new Error(`Could not set podcast language: ${PODCAST_LANGUAGE}`);
  }

  const authorInput = page.locator('input[name="author"]').first();
  await authorInput.fill(PODCAST_AUTHOR);

  const copyrightInput = page.locator('input[name="copyright"]').first();
  if (await copyrightInput.count()) {
    await copyrightInput.fill(PODCAST_COPYRIGHT);
  }
}

async function clickCreateButton(page) {
  const createButton = await firstVisible(page, [
    page.getByRole('button', { name: /new podcast/i }),
    page.locator('button:has-text("New podcast")'),
    page.locator('a[href*="/podcasts/new"]'),
    page.getByRole('button', { name: /create podcast|create show/i }),
  ]);

  if (createButton) {
    await createButton.click({ force: true }).catch(() => {});
    await pause(2500);
  }

  const maybeOnCreateFlow =
    page.url().toLowerCase().includes('/new') ||
    (await firstVisible(page, [
      page.locator('input[name*="title" i]'),
      page.locator('textarea[name*="description" i]'),
      page.locator('input[name*="slug" i]'),
    ]));

  if (maybeOnCreateFlow) {
    return true;
  }

  const dispatched = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const match = buttons.find((node) => (node.textContent || '').trim().toLowerCase() === 'new podcast');
    if (!match) return false;
    match.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    return true;
  });

  if (!dispatched) {
    return false;
  }

  await pause(3000);
  return true;
}

async function createShowIfNeeded(page) {
  if (!CREATE_IF_MISSING) {
    return null;
  }

  log('trying to create Frecuencia Global Podcast');
  await openDashboard(page);

  if (!(await clickCreateButton(page))) {
    await saveScreenshot(page, 'rsscom_create_button_missing.png');
    throw new Error('Could not find RSS.com create podcast button');
  }

  await fillCreatePodcastForm(page);

  const submitButton = await firstVisible(page, [
    page.getByRole('button', { name: /next|continue|create|save/i }),
    page.locator('button[type="submit"]'),
  ]);

  if (submitButton) {
    await submitButton.click().catch(() => {});
    await pause(5000);
  }

  if ((await pageText(page)).toLowerCase().includes('podcast details')) {
    await fillPodcastDetailsStep(page);
    const finalButton = await firstVisible(page, [
      page.getByRole('button', { name: /next|create|finish|save/i }),
      page.locator('button[type="submit"]'),
    ]);

    if (finalButton) {
      await finalButton.click({ force: true }).catch(() => {});
      await pause(6000);
    }
  }

  const start = Date.now();
  while (Date.now() - start < 45000) {
    const found = await resolveExistingShow(page);
    if (found) {
      return found;
    }
    await pause(3000);
  }

  log('waiting for manual podcast creation in browser');
  await saveScreenshot(page, 'rsscom_manual_create_needed.png');
  const deadline = Date.now() + WAIT_MANUAL_CREATE_MS;
  while (Date.now() < deadline) {
    const found = await resolveExistingShow(page);
    if (found) {
      return found;
    }
    await pause(3000);
  }

  throw new Error('Timeout waiting for RSS.com podcast creation');
}

async function main() {
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_EXE,
    args: ['--start-maximized', '--no-first-run', '--no-default-browser-check'],
    viewport: null,
  });

  try {
    let page = await getActivePage(context);
    await login(page);
    page = await getActivePage(context);

    let showUrl = await resolveExistingShow(page);

    if (!showUrl) {
      showUrl = await createShowIfNeeded(page);
    }

    if (!showUrl) {
      throw new Error('Could not resolve podcast show URL');
    }

    const publicShowUrl = toPublicShowUrl(showUrl);
    const feedUrl = await deriveFeedUrl(publicShowUrl);
    const feedStatus = await requestUrlStatus(page, feedUrl);

    const result = {
      session_ready: true,
      podcast_show_url: publicShowUrl,
      podcast_rss_url: feedUrl,
      feed_status: feedStatus,
      profile_dir: USER_DATA_DIR,
    };

    console.log(JSON.stringify(result, null, 2));
    await saveScreenshot(page, 'rsscom_ready.png');
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  console.error(`[rsscom] ERROR ${error.message}`);
  if (error?.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
