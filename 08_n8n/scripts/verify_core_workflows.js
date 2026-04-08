#!/usr/bin/env node
/**
 * verify_core_workflows.js
 *
 * Validates the Frecuencia Global operational core in n8n Cloud:
 * - Confirms SUB-002 / SUB-004 / WF-001 / WF-002 / WF-003 / WF-005 / WF-006 are active
 * - Confirms core workflow JSON no longer contains placeholders or legacy fixed IDs
 * - Optionally checks Telegram bot/chat health if variables are present
 * - Runs an end-to-end smoke flow:
 *   WF-001 intake -> WF-002 tracker -> WF-003 QA -> WF-006 publish-ready
 * - Verifies GitHub side effects in briefs, tracker, QA, publish-ready, and operations log
 *
 * Usage:
 *   node verify_core_workflows.js [--env path/to/.env.cloud]
 *   node verify_core_workflows.js --base-url https://... --api-key n8n_xxx
 *   node verify_core_workflows.js --env .env.cloud --pieza P1_001
 *
 * Notes:
 * - Without --pieza, the script creates a fresh test piece through WF-001.
 * - WF-005 is cron-based, so this script validates it structurally (active + cron expression)
 *   but does not force-run it.
 */

'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const url = require('url');

const TARGETS = ['SUB-002', 'SUB-004', 'WF-001', 'WF-002', 'WF-003', 'WF-005', 'WF-006'];
const PLACEHOLDERS = [
  '__LINK_SUB_002__',
  '__LINK_SUB_004__',
  '__PLACEHOLDER_GH_AUTH__',
  '__PLACEHOLDER_BRIDGE_AUTH__',
  'a1b2c3d4-0002-4000-8000-000000000002',
  'a1b2c3d4-0004-4000-8000-000000000004',
  'V0SuupEfkzLlD5iJ',
];

const cliArgs = {};
process.argv.slice(2).forEach((arg, index, arr) => {
  if (arg.startsWith('--')) cliArgs[arg.slice(2)] = arr[index + 1] || true;
});

function loadEnv(envPath) {
  const cfg = {};
  if (!fs.existsSync(envPath)) return cfg;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 1) continue;
    cfg[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return cfg;
}

const defaultEnvPath = path.resolve(__dirname, '..', '.env.cloud');
const envPath = typeof cliArgs.env === 'string' ? path.resolve(cliArgs.env) : defaultEnvPath;
const envCfg = loadEnv(envPath);

const BASE_URL = String(cliArgs['base-url'] || envCfg.N8N_BASE_URL || '').replace(/\/$/, '');
const API_KEY = String(cliArgs['api-key'] || envCfg.N8N_API_KEY || '');
const GITHUB_OWNER = String(envCfg.GITHUB_OWNER || '');
const GITHUB_REPO = String(envCfg.GITHUB_REPO || '');
const GITHUB_BRANCH = String(envCfg.GITHUB_BRANCH || 'main');
const GITHUB_PAT = String(envCfg.GITHUB_PAT || '');
const TELEGRAM_BOT_TOKEN = String(envCfg.TELEGRAM_BOT_TOKEN || '');
const TELEGRAM_CHAT_ID = String(envCfg.TELEGRAM_CHAT_ID || '');
const EXISTING_PIEZA = String(cliArgs.pieza || '').trim();

if (!BASE_URL || !API_KEY) {
  console.error('ERROR: missing n8n access.');
  console.error('Provide either:');
  console.error('  node verify_core_workflows.js --base-url https://... --api-key n8n_xxx');
  console.error('or create 08_n8n/.env.cloud with N8N_BASE_URL and N8N_API_KEY.');
  process.exit(1);
}

const hasGitHubAccess = Boolean(
  GITHUB_OWNER &&
  GITHUB_REPO &&
  GITHUB_BRANCH &&
  GITHUB_PAT &&
  !GITHUB_PAT.includes('xxxxxxxx')
);

const hasTelegramConfig = Boolean(
  TELEGRAM_BOT_TOKEN &&
  TELEGRAM_CHAT_ID &&
  TELEGRAM_BOT_TOKEN !== 'TU_TOKEN_AQUI' &&
  TELEGRAM_CHAT_ID !== 'TU_CHAT_ID_AQUI'
);

function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

function ok(message) {
  console.log(`[OK] ${message}`);
}

function info(message) {
  console.log(`[INFO] ${message}`);
}

function warn(message) {
  console.log(`[WARN] ${message}`);
}

function fail(message) {
  console.log(`[FAIL] ${message}`);
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function requestJson(fullUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(fullUrl);
    const body = options.body == null
      ? null
      : (typeof options.body === 'string' ? options.body : JSON.stringify(options.body));

    const requestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.headers || {}),
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
      },
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsedBody = data;
        try {
          parsedBody = data ? JSON.parse(data) : {};
        } catch {
          parsedBody = data;
        }

        resolve({
          status: res.statusCode,
          body: parsedBody,
          headers: res.headers,
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function n8nRequest(method, apiPath, body) {
  return requestJson(new url.URL(apiPath, BASE_URL).toString(), {
    method,
    body,
    headers: {
      'X-N8N-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });
}

function webhookPost(webhookPath, body) {
  return requestJson(new url.URL(webhookPath, BASE_URL).toString(), {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function webhookPostWithRetry(webhookPath, body, attempts = 3) {
  let lastResponse = null;
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await webhookPost(webhookPath, body);
      if (response.status >= 200 && response.status < 300) return response;
      lastResponse = response;
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) {
      warn(`Webhook ${webhookPath} not ready yet. Retry ${attempt + 1}/${attempts} in 3s...`);
      await sleep(3000);
    }
  }

  if (lastError) throw lastError;
  return lastResponse;
}

function githubContentUrl(filePath) {
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  return `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}/contents/${encodedPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
}

function githubRequest(method, targetUrl, body) {
  return requestJson(targetUrl, {
    method,
    body,
    headers: {
      Authorization: `token ${GITHUB_PAT}`,
      'Content-Type': 'application/json',
      'User-Agent': 'fg-core-verifier',
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    },
  });
}

async function readGitHubFile(filePath) {
  const res = await githubRequest('GET', githubContentUrl(filePath));
  if (res.status === 404) return null;
  ensure(res.status === 200, `GitHub GET failed for ${filePath} (${res.status})`);
  return res.body;
}

async function readGitHubText(filePath) {
  const file = await readGitHubFile(filePath);
  if (!file) return null;
  ensure(file.content, `GitHub file has no content: ${filePath}`);
  return Buffer.from(String(file.content).replace(/\n/g, ''), 'base64').toString('utf8');
}

async function fetchWorkflowMap() {
  const listRes = await n8nRequest('GET', '/api/v1/workflows?limit=100');
  ensure(listRes.status === 200, `Cannot fetch workflows (${listRes.status})`);
  const workflows = listRes.body.data || listRes.body || [];
  return workflows;
}

async function fetchVariableMap() {
  const listRes = await n8nRequest('GET', '/api/v1/variables?limit=100');
  ensure(listRes.status === 200, `Cannot fetch variables (${listRes.status})`);
  const variables = listRes.body.data || listRes.body || [];
  const map = {};
  for (const item of variables) {
    if (item && item.key) map[item.key] = item.value;
  }
  return map;
}

async function verifyActiveTargets() {
  logSection('Workflow Activation');
  const workflows = await fetchWorkflowMap();
  const results = {};

  for (const target of TARGETS) {
    const match = workflows.find((item) => item.name && item.name.includes(target));
    ensure(match, `${target} not found in n8n Cloud`);
    ensure(match.active, `${match.name} is inactive`);
    ok(`${match.name} active`);
    results[target] = match;
  }

  return results;
}

function deriveBridgeHealthUrl(bridgeUrl, xPublishWebhookUrl) {
  if (bridgeUrl) return `${String(bridgeUrl).replace(/\/$/, '')}/api/health`;
  if (xPublishWebhookUrl && String(xPublishWebhookUrl).includes('/api/publish/x')) {
    return String(xPublishWebhookUrl).replace(/\/api\/publish\/x\/?$/, '/api/health');
  }
  return '';
}

async function verifyDefinitions(workflowMap) {
  logSection('Workflow Linking');

  for (const target of TARGETS) {
    const wf = workflowMap[target];
    const detailRes = await n8nRequest('GET', `/api/v1/workflows/${wf.id}`);
    ensure(detailRes.status === 200, `Cannot fetch workflow detail for ${wf.name} (${detailRes.status})`);

    const raw = JSON.stringify(detailRes.body);
    const leftovers = PLACEHOLDERS.filter((token) => raw.includes(token));
    ensure(leftovers.length === 0, `${wf.name} still contains placeholders/legacy refs: ${leftovers.join(', ')}`);

    if (target === 'WF-005') {
      const scheduleNode = (detailRes.body.nodes || []).find((node) => node.type === 'n8n-nodes-base.scheduleTrigger');
      ensure(scheduleNode, 'WF-005 has no schedule trigger node');
      const cronExpression = scheduleNode.parameters?.rule?.interval?.[0]?.expression || '';
      ensure(cronExpression === '0 9 * * *', `WF-005 cron mismatch: expected 0 9 * * *, got "${cronExpression}"`);
      ok(`${wf.name} linked and cron set to 0 9 * * *`);
      continue;
    }

    ok(`${wf.name} linked with live workflow IDs/credentials`);
  }
}

async function verifyXPilotReadiness() {
  logSection('WF-007 X Pilot Readiness');

  const workflows = await fetchWorkflowMap();
  const wf = workflows.find((item) => item.name && item.name.includes('WF-007'));
  ensure(wf, 'WF-007 not found in n8n Cloud');

  if (wf.active) ok(`${wf.name} active`);
  else warn(`${wf.name} is present but inactive`);

  const detailRes = await n8nRequest('GET', `/api/v1/workflows/${wf.id}`);
  ensure(detailRes.status === 200, `Cannot fetch workflow detail for ${wf.name} (${detailRes.status})`);

  const raw = JSON.stringify(detailRes.body);
  const leftovers = PLACEHOLDERS.filter((token) => raw.includes(token));
  ensure(leftovers.length === 0, `${wf.name} still contains placeholders/legacy refs: ${leftovers.join(', ')}`);

  const nodes = detailRes.body.nodes || [];
  const publishNode = nodes.find((node) => node.name === 'Publicar en X');
  ensure(publishNode, 'WF-007 missing node "Publicar en X"');
  ensure(publishNode.type === 'n8n-nodes-base.httpRequest', 'WF-007 "Publicar en X" is not an HTTP Request node');

  const publishUrl = String(publishNode.parameters?.url || '');
  ensure(
    publishUrl.includes('BRIDGE_URL') || publishUrl.includes('X_PUBLISH_WEBHOOK_URL'),
    'WF-007 publish node does not reference BRIDGE_URL or X_PUBLISH_WEBHOOK_URL'
  );
  ensure(publishNode.credentials?.httpHeaderAuth, 'WF-007 publish node has no Header Auth credential bound');
  ok('WF-007 publish node points to bridge-based URL expression');

  const variables = await fetchVariableMap();
  const bridgeUrl = String(variables.BRIDGE_URL || '').trim();
  const xPublishWebhookUrl = String(variables.X_PUBLISH_WEBHOOK_URL || '').trim();

  if (bridgeUrl) ok(`BRIDGE_URL present: ${bridgeUrl}`);
  else warn('BRIDGE_URL missing in n8n Cloud variables');

  if (xPublishWebhookUrl) info(`X_PUBLISH_WEBHOOK_URL present: ${xPublishWebhookUrl}`);

  if (bridgeUrl && xPublishWebhookUrl) {
    const expected = `${bridgeUrl.replace(/\/$/, '')}/api/publish/x`;
    if (xPublishWebhookUrl === expected) ok('X_PUBLISH_WEBHOOK_URL matches BRIDGE_URL');
    else warn(`X_PUBLISH_WEBHOOK_URL mismatch. Expected ${expected} but found ${xPublishWebhookUrl}`);
  }

  const healthUrl = deriveBridgeHealthUrl(bridgeUrl, xPublishWebhookUrl);
  if (!healthUrl) {
    warn('No bridge health URL could be derived from BRIDGE_URL/X_PUBLISH_WEBHOOK_URL');
    return;
  }

  try {
    const healthRes = await requestJson(healthUrl);
    ensure(healthRes.status === 200, `Bridge healthcheck failed (${healthRes.status})`);
    ensure(healthRes.body && healthRes.body.ok === true, 'Bridge healthcheck returned ok=false');
    ok(`Bridge healthcheck OK (${healthUrl})`);
  } catch (error) {
    warn(`Bridge healthcheck unavailable: ${error.message || error}`);
  }
}

async function verifyTelegramHealth() {
  logSection('Telegram Health');

  if (!hasTelegramConfig) {
    warn('Telegram variables missing or blank in .env.cloud. Health check skipped.');
    return;
  }

  const meRes = await requestJson(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
  ensure(meRes.status === 200, `Telegram getMe failed (${meRes.status})`);
  ensure(meRes.body.ok === true, `Telegram getMe returned error: ${JSON.stringify(meRes.body)}`);
  ok(`Bot token valid (${meRes.body.result?.username || 'bot'})`);

  const chatUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=${encodeURIComponent(TELEGRAM_CHAT_ID)}`;
  const chatRes = await requestJson(chatUrl);
  ensure(chatRes.status === 200, `Telegram getChat failed (${chatRes.status})`);
  ensure(chatRes.body.ok === true, `Telegram getChat returned error: ${JSON.stringify(chatRes.body)}`);
  ok(`Chat accessible (${chatRes.body.result?.title || chatRes.body.result?.username || chatRes.body.result?.id || TELEGRAM_CHAT_ID})`);
}

function normalizeJsonBody(value) {
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string' || !value.trim()) return {};
  try {
    return JSON.parse(value);
  } catch {
    return { raw: value };
  }
}

async function runFullCoreVerification() {
  logSection('End-to-End Core Check');

  if (!hasGitHubAccess) {
    warn('GitHub config missing in .env.cloud. End-to-end check skipped after activation/link verification.');
    return;
  }

  let pieza = EXISTING_PIEZA;
  const verifyStamp = new Date().toISOString().replace(/[:.]/g, '-');
  const verifyTitle = `[CORE VERIFY ${verifyStamp}] Pipeline editorial`;

  if (!pieza) {
    info('Running WF-001 intake smoke test...');
    const intakeRes = await webhookPostWithRetry('/webhook/intake', {
      titulo: verifyTitle,
      pilar: 'GD',
      angulo: 'Verificacion automatica del core editorial',
      formato: 'carousel',
      plataformas: 'X, Instagram, LinkedIn, TikTok',
      autor: 'Codex',
    });

    ensure(intakeRes.status === 200, `WF-001 returned HTTP ${intakeRes.status}`);
    const intakeBody = normalizeJsonBody(intakeRes.body);
    ensure(intakeBody.ok === true, `WF-001 did not return ok=true: ${JSON.stringify(intakeBody)}`);
    ensure(intakeBody.idPieza, 'WF-001 response missing idPieza');
    pieza = intakeBody.idPieza;

    const briefPath = `${pieza}_Brief.md`;
    const briefText = await readGitHubText(`03_Editorial/${briefPath}`);
    ensure(briefText && briefText.includes(verifyTitle), `Brief not created correctly for ${pieza}`);
    ok(`WF-001 created ${briefPath}`);
  } else {
    info(`Using existing piece ${pieza}; WF-001 creation step skipped by --pieza.`);
    const briefText = await readGitHubText(`03_Editorial/${pieza}_Brief.md`);
    ensure(briefText, `Brief not found for existing piece ${pieza}`);
    ok(`Existing brief found for ${pieza}`);
  }

  info('Running WF-002 tracker update...');
  const registerRes = await webhookPostWithRetry('/webhook/register-brief', { pieza, estado: 'BRIEF_READY' });
  ensure(registerRes.status === 200, `WF-002 returned HTTP ${registerRes.status}`);
  const registerBody = normalizeJsonBody(registerRes.body);
  ensure(registerBody.ok === true, `WF-002 did not return ok=true: ${JSON.stringify(registerBody)}`);
  ensure(registerBody.estado === 'BRIEF_READY', `WF-002 returned unexpected estado: ${registerBody.estado}`);
  ok(`WF-002 moved ${pieza} to BRIEF_READY`);

  const trackerAfterRegister = JSON.parse(await readGitHubText('04_Produccion/pipeline_tracker.json') || '{}');
  ensure(trackerAfterRegister[pieza], `Tracker entry missing after WF-002 for ${pieza}`);
  ensure(trackerAfterRegister[pieza].estado_actual === 'BRIEF_READY', `Tracker estado_actual mismatch after WF-002 for ${pieza}`);
  ok(`Tracker updated for ${pieza}`);

  info('Running WF-003 QA generation...');
  const qaRes = await webhookPostWithRetry('/webhook/qa', { pieza });
  ensure(qaRes.status === 200, `WF-003 returned HTTP ${qaRes.status}`);
  const qaBody = normalizeJsonBody(qaRes.body);
  ensure(qaBody.ok === true, `WF-003 did not return ok=true: ${JSON.stringify(qaBody)}`);
  const qaText = await readGitHubText(`04_Produccion/${pieza}_QA.md`);
  ensure(qaText && qaText.includes(pieza), `QA file not created correctly for ${pieza}`);
  ok(`WF-003 created ${pieza}_QA.md`);

  info('Running WF-006 publish-ready generation...');
  const prepRes = await webhookPostWithRetry('/webhook/prepare-publish', { pieza });
  ensure(prepRes.status === 200, `WF-006 returned HTTP ${prepRes.status}`);
  const prepBody = normalizeJsonBody(prepRes.body);
  ensure(prepBody.ok === true, `WF-006 did not return ok=true: ${JSON.stringify(prepBody)}`);
  ensure(typeof prepBody.xCharCount === 'number', 'WF-006 response missing xCharCount');
  const publishReadyText = await readGitHubText(`04_Produccion/${pieza}_PublishReady.md`);
  ensure(publishReadyText && publishReadyText.includes('## X (Twitter)'), `PublishReady missing X section for ${pieza}`);
  ensure(publishReadyText.includes('## Instagram'), `PublishReady missing Instagram section for ${pieza}`);
  ensure(publishReadyText.includes('## LinkedIn'), `PublishReady missing LinkedIn section for ${pieza}`);
  ensure(publishReadyText.includes('## TikTok'), `PublishReady missing TikTok section for ${pieza}`);
  ok(`WF-006 created ${pieza}_PublishReady.md`);

  const trackerAfterPublish = JSON.parse(await readGitHubText('04_Produccion/pipeline_tracker.json') || '{}');
  ensure(trackerAfterPublish[pieza], `Tracker entry missing after WF-006 for ${pieza}`);
  ensure(trackerAfterPublish[pieza].estado_actual === 'PUBLISH_READY', `Tracker estado_actual mismatch after WF-006 for ${pieza}`);
  const historyStates = (trackerAfterPublish[pieza].historial || []).map((entry) => entry.estado);
  ensure(historyStates.includes('BRIEF_READY'), `Tracker history missing BRIEF_READY for ${pieza}`);
  ensure(historyStates.includes('PUBLISH_READY'), `Tracker history missing PUBLISH_READY for ${pieza}`);
  ok(`Tracker reached PUBLISH_READY for ${pieza}`);

  const operationsLog = await readGitHubText('07_Operaciones/FG_Operations_Log.md');
  ensure(operationsLog && operationsLog.includes(`| BRIEF_CREATED | ${pieza} |`), `Operations log missing BRIEF_CREATED for ${pieza}`);
  ensure(operationsLog.includes(`| ESTADO_ACTUALIZADO | ${pieza} |`), `Operations log missing ESTADO_ACTUALIZADO for ${pieza}`);
  ensure(operationsLog.includes(`| QA_GENERADO | ${pieza} |`), `Operations log missing QA_GENERADO for ${pieza}`);
  ensure(operationsLog.includes(`| PUBLISH_READY | ${pieza} |`), `Operations log missing PUBLISH_READY for ${pieza}`);
  ok(`Operations log captured the full core flow for ${pieza}`);

  console.log(`\nCore verification piece: ${pieza}`);
  console.log(`Brief: 03_Editorial/${pieza}_Brief.md`);
  console.log(`QA: 04_Produccion/${pieza}_QA.md`);
  console.log(`Ready: 04_Produccion/${pieza}_PublishReady.md`);
}

async function main() {
  console.log('Frecuencia Global - Cloud Workflow Verification');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Env: ${envPath}`);

  const startedAt = Date.now();
  await verifyActiveTargets().then(verifyDefinitions);
  await verifyXPilotReadiness();
  await verifyTelegramHealth();
  await runFullCoreVerification();

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\nVerification finished in ${elapsed}s`);
}

main().catch((error) => {
  console.error(`\nFATAL: ${error.message || error}`);
  process.exit(1);
});
