#!/usr/bin/env node
/**
 * deploy_cloud.js — Frecuencia Global n8n Cloud Go-Live
 *
 * Automates the full cloud deployment:
 *   1. Create n8n Variables
 *   2. Create GitHub Header Auth credential
 *   3. Import all workflows in correct order
 *   4. Link SUB placeholders / legacy fixed IDs to the actual cloud UUIDs
 *   5. Activate core workflows automatically
 *   6. Leave social workflows imported and ready for final credential binding
 *   6. Smoke test (optional)
 *
 * Usage:
 *   node deploy_cloud.js [--env path/to/.env.cloud]
 *
 * Default env file: ../  .env.cloud (08_n8n/.env.cloud)
 *
 * Dependencies: none (Node.js built-ins only)
 */

'use strict';

const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const url    = require('url');

// ─── Config ────────────────────────────────────────────────────────────────────

const WORKFLOWS_DIR = path.resolve(__dirname, '..', 'workflows_cloud');

/** Import order: SUBs first, then WFs */
const IMPORT_ORDER = [
  'sub/SUB-002_notificar_telegram.json',
  'sub/SUB-004_registrar_evento.json',
  'sub/SUB-001_escribir_markdown.json',
  'sub/SUB-003_template_filler.json',
  'WF-001_intake_ideas.json',
  'WF-002_registro_brief.json',
  'WF-003_qa_checklist.json',
  'WF-004_notificacion_log.json',
  'WF-005_pipeline_status.json',
  'WF-006_preparar_publicacion.json',
  'WF-007_publicar_x.json',
  'WF-008_publicar_instagram.json',
  'WF-009_publicar_linkedin.json',
  'WF-010_publicar_tiktok.json',
];

/**
 * Core activation profile:
 * - Telegram active via SUB-002
 * - Operations log active via SUB-004
 * - Editorial core active via WF-001 / 002 / 003 / 005 / 006
 * WF-004 is left imported but inactive by default because SUB-004 already
 * covers the logging path used by the core workflows.
 */
const AUTO_ACTIVATE = ['SUB-002', 'SUB-004', 'WF-001', 'WF-002', 'WF-003', 'WF-005', 'WF-006'];

/** n8n Variables to push (keys map to .env.cloud values) */
const N8N_VARIABLES = [
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'GITHUB_BRANCH',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'BRIDGE_URL',
  'X_PUBLISH_WEBHOOK_URL',
  'IG_PUBLISH_WEBHOOK_URL',
  'TIKTOK_PUBLISH_WEBHOOK_URL',
  'LINKEDIN_AUTHOR_URN',
];

// ─── .env.cloud loader ─────────────────────────────────────────────────────────

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) {
    console.error(`ERROR: env file not found: ${envPath}`);
    console.error(`Create it: cp .env.cloud.example .env.cloud  then fill in the values.`);
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  const cfg = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    cfg[key] = val;
  }
  return cfg;
}

function validateConfig(cfg) {
  const required = ['N8N_BASE_URL', 'N8N_API_KEY', 'GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_BRANCH', 'GITHUB_PAT'];
  const missing = required.filter(k => !cfg[k] || cfg[k].includes('xxxxxxxx'));
  if (missing.length > 0) {
    console.error('ERROR: Missing or placeholder values in .env.cloud:');
    missing.forEach(k => console.error(`  • ${k}`));
    process.exit(1);
  }
}

// ─── CLI args ──────────────────────────────────────────────────────────────────

const cliArgs = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (arg.startsWith('--')) cliArgs[arg.slice(2)] = arr[i + 1] || true;
});

const envFile = typeof cliArgs['env'] === 'string'
  ? path.resolve(cliArgs['env'])
  : path.resolve(__dirname, '..', '.env.cloud');

const cfg = loadEnv(envFile);
validateConfig(cfg);

const BASE_URL = cfg.N8N_BASE_URL.replace(/\/$/, '');
const API_KEY  = cfg.N8N_API_KEY;
const LEGACY_GH_CREDENTIAL_ID = 'V0SuupEfkzLlD5iJ';
const LEGACY_SUB_002_ID = 'a1b2c3d4-0002-4000-8000-000000000002';
const LEGACY_SUB_004_ID = 'a1b2c3d4-0004-4000-8000-000000000004';
const CURRENT_SUB_002_ID = 'oeydfg22aym5l0';
const CURRENT_SUB_004_ID = 'gU1WpHnU2Jmf3Wgj';

// ─── HTTP helper ───────────────────────────────────────────────────────────────

function apiRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(apiPath, BASE_URL);
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || 443,
      path:     parsed.pathname + parsed.search,
      method,
      headers: {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/** Plain HTTPS POST (no API key — for webhook smoke test) */
function webhookPost(fullUrl, body) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(fullUrl);
    const payload = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || 443,
      path:     parsed.pathname,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

function header(title) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'─'.repeat(60)}`);
}

function ok(msg)   { console.log(`  ✅  ${msg}`); }
function warn(msg) { console.log(`  ⚠️   ${msg}`); }
function info(msg) { console.log(`  ℹ️   ${msg}`); }
function fail(msg) { console.log(`  ❌  ${msg}`); }

function variableValueForKey(key) {
  if (cfg[key]) return cfg[key];

  if (key === 'X_PUBLISH_WEBHOOK_URL' && cfg.BRIDGE_URL) {
    return `${cfg.BRIDGE_URL.replace(/\/$/, '')}/api/publish/x`;
  }

  return '';
}

// ─── Steps ─────────────────────────────────────────────────────────────────────

async function stepVariables() {
  header('STEP 1 — n8n Variables');

  let created = 0;
  let skipped = 0;

  for (const key of N8N_VARIABLES) {
    const value = variableValueForKey(key);
    const res = await apiRequest('POST', '/api/v1/variables', { key, value });

    if (res.status === 200 || res.status === 201) {
      ok(`${key} = "${value || '(blank)'}"`);
      created++;
    } else if (res.status === 409) {
      info(`${key} already exists — skipped`);
      skipped++;
    } else {
      warn(`${key} — unexpected status ${res.status}: ${JSON.stringify(res.body).slice(0, 120)}`);
      skipped++;
    }
  }

  console.log(`\n  Created: ${created}  Skipped/Exists: ${skipped}`);
}

async function stepCredential() {
  header('STEP 2 — GitHub Header Auth Credential');

  const credBody = {
    name: 'FG GitHub Auth',
    type: 'httpHeaderAuth',
    data: {
      name:  'Authorization',
      value: `token ${cfg.GITHUB_PAT}`,
    },
  };

  const res = await apiRequest('POST', '/api/v1/credentials', credBody);

  if (res.status === 200 || res.status === 201) {
    const credId = res.body.id;
    ok(`Credential created: "FG GitHub Auth" — id: ${credId}`);
    return credId;
  }

  if (res.status === 409) {
    // Already exists — try to find it
    info('Credential may already exist. Searching for "FG GitHub Auth"...');
    const listRes = await apiRequest('GET', '/api/v1/credentials?limit=100');
    if (listRes.status === 200) {
      const creds = listRes.body.data || listRes.body || [];
      const existing = creds.find(c => c.name === 'FG GitHub Auth');
      if (existing) {
        ok(`Found existing credential: id ${existing.id}`);
        return existing.id;
      }
    }
    warn('Could not retrieve existing credential ID. Workflows will import without credential link.');
    return null;
  }

  warn(`Credential creation failed (status ${res.status}).`);
  warn('Workflows will import without GitHub credential link.');
  warn('Create manually: Settings → Credentials → "FG GitHub Auth" (Header Auth, Authorization: token <PAT>)');
  return null;
}

async function stepImport(ghCredId) {
  header('STEP 3 — Import Workflows');

  // nameFragment → cloud UUID
  const importMap = {};

  for (const relPath of IMPORT_ORDER) {
    const filePath = path.join(WORKFLOWS_DIR, relPath);

    if (!fs.existsSync(filePath)) {
      fail(`File not found: ${relPath}`);
      continue;
    }

    let raw = fs.readFileSync(filePath, 'utf8');

    // Inject GitHub credential ID if available. Support both placeholder-based
    // and older exports that still carry the original cloud credential ID.
    if (ghCredId) {
      raw = raw.split('__PLACEHOLDER_GH_AUTH__').join(String(ghCredId));
      raw = raw.split(LEGACY_GH_CREDENTIAL_ID).join(String(ghCredId));
    }

    let wfJson;
    try {
      wfJson = JSON.parse(raw);
    } catch (e) {
      fail(`Invalid JSON: ${relPath} — ${e.message}`);
      continue;
    }

    // Remove local id so n8n assigns a fresh cloud UUID
    delete wfJson.id;

    const res = await apiRequest('POST', '/api/v1/workflows', wfJson);

    if (res.status === 200 || res.status === 201) {
      const newId = res.body.id;
      const name  = res.body.name || wfJson.name || relPath;
      ok(`${name}  →  id: ${newId}`);
      importMap[name] = newId;
    } else {
      fail(`${relPath} — status ${res.status}: ${JSON.stringify(res.body).slice(0, 200)}`);
    }
  }

  console.log(`\n  Imported: ${Object.keys(importMap).length} / ${IMPORT_ORDER.length}`);
  return importMap;
}

async function stepLink(importMap) {
  header('STEP 4 — Link SUB Placeholders');

  // Fetch live workflow list
  const listRes = await apiRequest('GET', '/api/v1/workflows?limit=100');
  if (listRes.status !== 200) {
    fail(`Cannot fetch workflows for linking (status ${listRes.status})`);
    return;
  }

  const workflows = listRes.body.data || listRes.body || [];

  const find = (fragment) => workflows.find(w => w.name && w.name.includes(fragment));

  const sub002 = find('SUB-002');
  const sub004 = find('SUB-004');

  if (!sub002) { fail('SUB-002 not found — linking skipped'); return; }
  if (!sub004) { fail('SUB-004 not found — linking skipped'); return; }

  info(`SUB-002 target  →  ${sub002.id}  (${sub002.name})`);
  info(`SUB-004 target  →  ${sub004.id}  (${sub004.name})`);

  const replacements = {
    '__LINK_SUB_002__': sub002.id,
    '__LINK_SUB_004__': sub004.id,
    [LEGACY_SUB_002_ID]: sub002.id,
    [LEGACY_SUB_004_ID]: sub004.id,
    [CURRENT_SUB_002_ID]: sub002.id,
    [CURRENT_SUB_004_ID]: sub004.id,
  };

  const targets = workflows.filter(w =>
    w.name && (/WF-0(0[1-9]|10)/.test(w.name) || /SUB-00[13]/.test(w.name))
  );

  info(`Patching ${targets.length} workflow(s)...\n`);

  let patched = 0;
  let unchanged = 0;

  for (const wf of targets) {
    const getRes = await apiRequest('GET', `/api/v1/workflows/${wf.id}`);
    if (getRes.status !== 200) {
      warn(`${wf.name} — fetch failed (${getRes.status}), skipped`);
      unchanged++;
      continue;
    }

    let raw = JSON.stringify(getRes.body);
    let changed = false;

    for (const [placeholder, realId] of Object.entries(replacements)) {
      if (raw.includes(placeholder)) {
        raw = raw.split(placeholder).join(realId);
        changed = true;
      }
    }

    if (!changed) {
      info(`${wf.name} — no placeholders found`);
      unchanged++;
      continue;
    }

    const putRes = await apiRequest('PUT', `/api/v1/workflows/${wf.id}`, JSON.parse(raw));
    if (putRes.status === 200 || putRes.status === 204) {
      ok(`${wf.name} — linked`);
      patched++;
    } else {
      fail(`${wf.name} — PUT ${putRes.status}: ${JSON.stringify(putRes.body).slice(0, 150)}`);
      unchanged++;
    }
  }

  console.log(`\n  Linked: ${patched}  Unchanged: ${unchanged}`);
}

async function stepActivate() {
  header('STEP 5 — Activate Workflows');

  const listRes = await apiRequest('GET', '/api/v1/workflows?limit=100');
  if (listRes.status !== 200) {
    fail(`Cannot fetch workflows for activation (status ${listRes.status})`);
    return;
  }

  const workflows = listRes.body.data || listRes.body || [];

  let activated = 0;
  let failed    = 0;

  for (const tag of AUTO_ACTIVATE) {
    const wf = workflows.find(w => w.name && w.name.includes(tag));
    if (!wf) {
      warn(`${tag} not found in cloud — skipped`);
      failed++;
      continue;
    }

    const res = await apiRequest('PATCH', `/api/v1/workflows/${wf.id}`, { active: true });
    if (res.status === 200 || res.status === 204) {
      ok(`${wf.name} → active`);
      activated++;
    } else {
      fail(`${wf.name} → PATCH ${res.status}: ${JSON.stringify(res.body).slice(0, 120)}`);
      failed++;
    }
  }

  console.log(`\n  Activated: ${activated}  Failed/Skipped: ${failed}`);
  console.log('\n  Core profile activated automatically:');
  console.log('  - SUB-002 → Telegram notifications');
  console.log('  - SUB-004 → Operations log');
  console.log('  - WF-001 / WF-002 / WF-003 / WF-005 / WF-006');
  console.log('\n  Imported but left inactive:');
  console.log('  - WF-004 → optional wrapper log workflow');
  console.log('  - WF-007 → requires FG Bridge Auth + BRIDGE_URL (or X_PUBLISH_WEBHOOK_URL fallback)');
  console.log('  - WF-008 → requires Instagram auth + IG_PUBLISH_WEBHOOK_URL');
  console.log('  - WF-009 → requires LinkedIn auth + LINKEDIN_AUTHOR_URN');
  console.log('  - WF-010 → requires TikTok auth + TIKTOK_PUBLISH_WEBHOOK_URL');
}

async function stepSmokeTest() {
  header('STEP 6 — Smoke Test');

  const pieza = cfg.SMOKE_TEST_PIEZA;
  if (!pieza) {
    info('SMOKE_TEST_PIEZA is blank — smoke test skipped.');
    info('Set SMOKE_TEST_PIEZA=<pieza_id> in .env.cloud to enable.');
    return;
  }

  const webhookUrl = `${BASE_URL}/webhook/intake`;
  const body = {
    titulo:  `[SMOKE TEST] ${pieza}`,
    pilar:   'GD',
    angulo:  'deploy-test',
    formato: 'carousel',
  };

  info(`POST ${webhookUrl}`);
  info(`Body: ${JSON.stringify(body)}`);

  try {
    const res = await webhookPost(webhookUrl, body);
    if (res.status >= 200 && res.status < 300) {
      ok(`Smoke test passed — HTTP ${res.status}`);
      if (res.body) console.log(`  Response: ${String(res.body).slice(0, 300)}`);
    } else {
      fail(`Smoke test returned HTTP ${res.status}`);
      console.log(`  Response: ${String(res.body).slice(0, 300)}`);
    }
  } catch (e) {
    fail(`Smoke test error: ${e.message}`);
    warn('WF-001 may need a few seconds after activation before accepting webhooks. Retry manually.');
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   FRECUENCIA GLOBAL — n8n Cloud Go-Live Deploy           ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n  Target  : ${BASE_URL}`);
  console.log(`  API Key : ${API_KEY.slice(0, 10)}...`);
  console.log(`  Env     : ${envFile}`);
  console.log(`  Workflows dir: ${WORKFLOWS_DIR}`);

  const summary = { variables: '?', credential: '?', imported: '?', linked: '?', activated: '?', smokeTest: '?' };
  const startTs = Date.now();

  try {
    await stepVariables();
    summary.variables = 'done';
  } catch (e) {
    fail(`Variables step error: ${e.message}`);
    summary.variables = 'ERROR';
  }

  let ghCredId = null;
  try {
    ghCredId = await stepCredential();
    summary.credential = ghCredId ? `id: ${ghCredId}` : 'skipped/failed';
  } catch (e) {
    fail(`Credential step error: ${e.message}`);
    summary.credential = 'ERROR';
  }

  let importMap;
  try {
    importMap = await stepImport(ghCredId);
    summary.imported = `${Object.keys(importMap).length}/${IMPORT_ORDER.length}`;
  } catch (e) {
    fail(`Import step error: ${e.message}`);
    summary.imported = 'ERROR';
  }

  try {
    await stepLink(importMap);
    summary.linked = 'done';
  } catch (e) {
    fail(`Link step error: ${e.message}`);
    summary.linked = 'ERROR';
  }

  try {
    await stepActivate();
    summary.activated = 'done';
  } catch (e) {
    fail(`Activation step error: ${e.message}`);
    summary.activated = 'ERROR';
  }

  try {
    await stepSmokeTest();
    summary.smokeTest = cfg.SMOKE_TEST_PIEZA ? 'done' : 'skipped';
  } catch (e) {
    fail(`Smoke test error: ${e.message}`);
    summary.smokeTest = 'ERROR';
  }

  const elapsed = ((Date.now() - startTs) / 1000).toFixed(1);

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   DEPLOY SUMMARY                                         ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║   Variables     : ${String(summary.variables).padEnd(38)}║`);
  console.log(`║   Credential    : ${String(summary.credential).padEnd(38)}║`);
  console.log(`║   Import        : ${String(summary.imported).padEnd(38)}║`);
  console.log(`║   Link          : ${String(summary.linked).padEnd(38)}║`);
  console.log(`║   Activation    : ${String(summary.activated).padEnd(38)}║`);
  console.log(`║   Smoke test    : ${String(summary.smokeTest).padEnd(38)}║`);
  console.log(`║   Elapsed       : ${String(`${elapsed}s`).padEnd(38)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  console.log('\n  Next steps:');
  console.log('  1. Set BRIDGE_URL once in n8n Cloud for all bridge-based workflows');
  console.log('  2. Bind FG Bridge Auth to WF-007 and activate it when the bridge is reachable');
  console.log('  3. Bind remaining social credentials/variables for WF-008..010 as needed');
  console.log(`  4. Open n8n cloud: ${BASE_URL}\n`);
}

main().catch(e => {
  console.error('\nFATAL:', e.message || e);
  process.exit(1);
});
