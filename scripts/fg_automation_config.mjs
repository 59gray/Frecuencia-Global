import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SCRIPTS_DIR = __dirname;
export const REPO_ROOT = path.resolve(__dirname, '..');

export const WEBSITE_URL = process.env.FG_WEBSITE_URL ?? 'https://frecuenciaglobal.vercel.app';
export const WEBSITE_PREVIEW_URL = process.env.FG_WEBSITE_PREVIEW_URL ?? 'https://website-three-rho-26.vercel.app';
export const PODCAST_HOST = process.env.FG_PODCAST_HOST ?? 'rss.com';
export const PODCAST_SLUG = process.env.FG_PODCAST_SLUG ?? 'frecuencia-global-podcast';
export const PODCAST_RSS_URL = process.env.FG_PODCAST_RSS_URL ?? `https://media.rss.com/${PODCAST_SLUG}/feed.xml`;
export const PODCAST_SHOW_URL = process.env.FG_PODCAST_SHOW_URL ?? `https://rss.com/podcasts/${PODCAST_SLUG}`;

export const TIKTOK_HANDLE = process.env.FG_TIKTOK_HANDLE ?? 'frecuenciaglobal';
export const TIKTOK_PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}`;
export const TIKTOK_PROFILE_IMAGE = path.join(
  REPO_ROOT,
  'Frecuencia_Global_Assets_Base',
  'assets',
  'fg_tiktok_profile_200x200.png',
);

export function repoPath(...segments) {
  return path.join(REPO_ROOT, ...segments);
}

export function chromeExecutable() {
  const candidates = [
    process.env.FG_CHROME_EXE,
    path.join(process.env.ProgramFiles ?? 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] ?? 'C:/Program Files (x86)', 'Google/Chrome/Application/chrome.exe'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

export function chromeUserDataDir() {
  if (process.env.FG_CHROME_USER_DATA_DIR) {
    return process.env.FG_CHROME_USER_DATA_DIR;
  }

  return path.join(process.env.LOCALAPPDATA ?? path.join(os.homedir(), 'AppData', 'Local'), 'Google', 'Chrome', 'User Data');
}
