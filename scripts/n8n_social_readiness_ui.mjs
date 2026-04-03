import { chromium } from 'playwright-core';
import { chromeExecutable, repoPath } from './fg_automation_config.mjs';

const BASE_URL = 'https://frecuenciaglobal.app.n8n.cloud';
const USER_DATA_DIR = repoPath('.chrome-n8n-cloud');

const WORKFLOW_TARGETS = [
  'WF-007 — Publicar en X (Cloud)',
  'WF-008 — Publicar en Instagram (Cloud)',
  'WF-009 — Publicar en LinkedIn (Cloud)',
  'WF-010 — Publicar en TikTok (Cloud)',
];

const CREDENTIAL_TARGETS = [
  'FG GitHub Auth',
  'FG X (Twitter)',
  'FG LinkedIn Auth',
  'FG Instagram Auth',
  'FG TikTok Auth',
];

const VARIABLE_TARGETS = [
  'LINKEDIN_AUTHOR_URN',
  'IG_PUBLISH_WEBHOOK_URL',
  'TIKTOK_PUBLISH_WEBHOOK_URL',
];

async function getPage(context) {
  return context.pages()[0] || context.newPage();
}

async function searchPage(page, url, term) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const input = page.getByPlaceholder('Search').first();
  await input.fill(term);
  await page.waitForTimeout(1200);

  const text = await page.locator('body').innerText();
  return text;
}

function hasPublishedCard(text, name) {
  const compact = text.replace(/\s+/g, ' ');
  const index = compact.indexOf(name);
  if (index === -1) {
    return false;
  }
  return compact.slice(index, index + 220).includes('Published');
}

async function main() {
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    executablePath: chromeExecutable(),
    viewport: { width: 1600, height: 1100 },
  });

  try {
    const page = await getPage(context);

    const workflowStatus = {};
    for (const target of WORKFLOW_TARGETS) {
      const text = await searchPage(page, `${BASE_URL}/home/workflows`, target);
      workflowStatus[target] = {
        found: text.includes(target),
        published: hasPublishedCard(text, target),
      };
    }

    const credentialStatus = {};
    for (const target of CREDENTIAL_TARGETS) {
      const text = await searchPage(page, `${BASE_URL}/home/credentials`, target);
      credentialStatus[target] = {
        found: text.includes(target),
      };
    }

    const variableStatus = {};
    for (const target of VARIABLE_TARGETS) {
      const text = await searchPage(page, `${BASE_URL}/home/variables`, target);
      variableStatus[target] = {
        found: text.includes(target),
      };
    }

    const readiness = {
      x_text_post: {
        ready:
          workflowStatus['WF-007 — Publicar en X (Cloud)']?.published &&
          credentialStatus['FG X (Twitter)']?.found,
        blockers: [],
      },
      linkedin_text_post: {
        ready:
          workflowStatus['WF-009 — Publicar en LinkedIn (Cloud)']?.published &&
          credentialStatus['FG LinkedIn Auth']?.found &&
          variableStatus['LINKEDIN_AUTHOR_URN']?.found,
        blockers: [],
      },
      instagram_text_post: {
        ready: false,
        blockers: ['El workflow actual exige imageUrl; no soporta post de solo texto.'],
      },
      tiktok_text_post: {
        ready: false,
        blockers: ['El workflow actual exige videoUrl; no soporta post de solo texto.'],
      },
    };

    if (!workflowStatus['WF-007 — Publicar en X (Cloud)']?.published) {
      readiness.x_text_post.blockers.push('WF-007 no esta published.');
    }
    if (!credentialStatus['FG X (Twitter)']?.found) {
      readiness.x_text_post.blockers.push('Falta credencial FG X (Twitter).');
    }

    if (!workflowStatus['WF-009 — Publicar en LinkedIn (Cloud)']?.published) {
      readiness.linkedin_text_post.blockers.push('WF-009 no esta published.');
    }
    if (!credentialStatus['FG LinkedIn Auth']?.found) {
      readiness.linkedin_text_post.blockers.push('Falta credencial FG LinkedIn Auth.');
    }
    if (!variableStatus['LINKEDIN_AUTHOR_URN']?.found) {
      readiness.linkedin_text_post.blockers.push('Falta variable LINKEDIN_AUTHOR_URN.');
    }

    const output = {
      baseUrl: BASE_URL,
      workflowStatus,
      credentialStatus,
      variableStatus,
      readiness,
    };

    console.log(JSON.stringify(output, null, 2));
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
