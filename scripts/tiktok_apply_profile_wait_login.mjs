import fs from 'node:fs';
import { chromium } from 'playwright-core';
import {
  chromeExecutable,
  chromeUserDataDir,
  TIKTOK_PROFILE_IMAGE,
  TIKTOK_PROFILE_URL,
  WEBSITE_URL,
} from './fg_automation_config.mjs';

const DISPLAY_NAME = 'Frecuencia Global';
const BIO = [
  'Analisis internacional con pulso electronico',
  'Geopolitica, cultura y poder',
].join('\n');
const CHROME_EXE = chromeExecutable();
const USER_DATA_DIR = chromeUserDataDir();

async function getActivePage(context) {
  for (const existing of context.pages()) {
    if (!existing.isClosed()) {
      return existing;
    }
  }
  return context.newPage();
}

async function main() {
  if (!fs.existsSync(TIKTOK_PROFILE_IMAGE)) {
    throw new Error(`Missing TikTok profile image: ${TIKTOK_PROFILE_IMAGE}`);
  }

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_EXE,
    args: ['--start-maximized', '--no-first-run', '--no-default-browser-check'],
    viewport: null,
  });

  let page = await getActivePage(context);
  await page.goto(TIKTOK_PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const start = Date.now();
  const maxWaitMs = 10 * 60 * 1000;
  let ready = false;

  console.log('WAITING_FOR_LOGIN - resuelve login o antirobot en la ventana de Chrome');
  while (Date.now() - start < maxWaitMs) {
    try {
      page = await getActivePage(context);
      const editCount = await page
        .locator('button:has-text("Edit profile"), a:has-text("Edit profile")')
        .count();
      if (editCount > 0) {
        ready = true;
        break;
      }
      await page.waitForTimeout(2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Target page, context or browser has been closed')) {
        continue;
      }
      throw error;
    }
  }

  if (!ready) {
    console.log('TIMEOUT_WAITING_LOGIN');
    await context.close();
    process.exit(2);
  }

  await page.locator('button:has-text("Edit profile"), a:has-text("Edit profile")').first().click();
  await page.waitForTimeout(1500);

  const nameInput = page.locator('input[placeholder*="Name" i], input[name*="name" i]').first();
  if (await nameInput.count()) await nameInput.fill(DISPLAY_NAME);

  const bioInput = page.locator('textarea[placeholder*="Bio" i], textarea').first();
  if (await bioInput.count()) await bioInput.fill(BIO);

  const linkInput = page.locator('input[placeholder*="Website" i], input[placeholder*="Link" i]').first();
  if (await linkInput.count()) await linkInput.fill(WEBSITE_URL);

  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count()) await fileInput.setInputFiles(TIKTOK_PROFILE_IMAGE);

  const saveBtn = page.locator('button:has-text("Save")').first();
  if (await saveBtn.count()) await saveBtn.click();

  await page.waitForTimeout(5000);
  console.log('PROFILE_IDENTITY_APPLIED');
  await context.close();
}

main().catch((err) => {
  console.error('AUTOMATION_ERROR', err.message);
  process.exit(1);
});
