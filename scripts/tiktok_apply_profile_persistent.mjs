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
const PROFILE_DIRECTORY = process.env.FG_TIKTOK_CHROME_PROFILE ?? 'Default';

async function clickFirst(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
      try {
        await locator.click({ timeout: 3000 });
        return true;
      } catch {}
    }
  }
  return false;
}

async function main() {
  if (!fs.existsSync(TIKTOK_PROFILE_IMAGE)) {
    throw new Error(`Missing TikTok profile image: ${TIKTOK_PROFILE_IMAGE}`);
  }

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_EXE,
    args: [`--profile-directory=${PROFILE_DIRECTORY}`, '--start-maximized'],
    viewport: null,
  });

  const page = context.pages()[0] || (await context.newPage());
  await page.goto(TIKTOK_PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  const hasEdit = await page.locator('button:has-text("Edit profile"), a:has-text("Edit profile")').count();
  const hasLogin = await page.locator('text=Log in').count();

  if (!hasEdit) {
    console.log(hasLogin ? 'BLOCKED_NOT_AUTHENTICATED' : 'BLOCKED_NO_EDIT_BUTTON');
    await context.close();
    process.exit(2);
  }

  await page.locator('button:has-text("Edit profile"), a:has-text("Edit profile")').first().click();
  await page.waitForTimeout(1200);

  const nameInput = page.locator('input[placeholder*="Name" i], input[name*="name" i]').first();
  if (await nameInput.count()) await nameInput.fill(DISPLAY_NAME);

  const bioInput = page.locator('textarea[placeholder*="Bio" i], textarea').first();
  if (await bioInput.count()) await bioInput.fill(BIO);

  const websiteInput = page.locator('input[placeholder*="Website" i], input[placeholder*="Link" i]').first();
  if (await websiteInput.count()) await websiteInput.fill(WEBSITE_URL);

  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count()) await fileInput.setInputFiles(TIKTOK_PROFILE_IMAGE);

  await clickFirst(page, ['button:has-text("Save")', 'button:has-text("Apply")']);

  await page.waitForTimeout(4000);
  console.log('PROFILE_IDENTITY_APPLIED');
  await context.close();
}

main().catch((err) => {
  console.error('AUTOMATION_ERROR', err.message);
  process.exit(1);
});
