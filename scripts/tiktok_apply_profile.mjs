import fs from 'node:fs';
import { chromium } from 'playwright-core';
import {
  chromeExecutable,
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

async function exists(page, selector) {
  return (await page.locator(selector).count()) > 0;
}

async function run() {
  if (!fs.existsSync(TIKTOK_PROFILE_IMAGE)) {
    throw new Error(`Missing TikTok profile image: ${TIKTOK_PROFILE_IMAGE}`);
  }

  const browser = await chromium.launch({
    headless: false,
    executablePath: CHROME_EXE,
    args: ['--start-maximized'],
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  await page.goto(TIKTOK_PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  if (await exists(page, 'button:has-text("Log in")')) {
    console.log('BLOCKED_NOT_AUTHENTICATED');
    await browser.close();
    process.exit(2);
  }

  const editBtn = page.locator('button:has-text("Edit profile"),a:has-text("Edit profile")').first();
  await editBtn.waitFor({ timeout: 15000 });
  await editBtn.click();

  const nameInput = page.locator('input[placeholder*="Name" i], input[name*="name" i]').first();
  await nameInput.fill(DISPLAY_NAME);

  const bioInput = page.locator('textarea[placeholder*="Bio" i], textarea').first();
  await bioInput.fill(BIO);

  const linkInput = page.locator('input[placeholder*="Website" i], input[placeholder*="Link" i]').first();
  if (await linkInput.count()) {
    await linkInput.fill(WEBSITE_URL);
  }

  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count()) {
    await fileInput.setInputFiles(TIKTOK_PROFILE_IMAGE);
  }

  const saveBtn = page.locator('button:has-text("Save")').first();
  if (await saveBtn.count()) {
    await saveBtn.click();
  }

  await page.waitForTimeout(5000);
  console.log('PROFILE_UPDATE_ATTEMPTED');
  await browser.close();
}

run().catch((err) => {
  console.error('AUTOMATION_ERROR', err.message);
  process.exit(1);
});
