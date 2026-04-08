#!/usr/bin/env node
/**
 * link_cloud_workflows.js
 *
 * Post-import script for n8n cloud. After importing all cloud workflow JSONs,
 * this script resolves both portable placeholders and legacy fixed IDs for
 * SUB-002 / SUB-004 to the actual workflow UUIDs assigned by n8n.
 *
 * Usage:
 *   node link_cloud_workflows.js --base-url https://frecuenciaglobal.app.n8n.cloud --api-key n8n_xxx
 *
 * Prerequisites:
 *   - All SUB and WF workflows already imported into n8n cloud
 *   - n8n cloud API key with full access
 */

const https = require('https');
const url = require('url');

// --- CLI argument parsing ---
const args = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (arg.startsWith('--')) args[arg.slice(2)] = arr[i + 1];
});

const BASE_URL = args['base-url'] || process.env.N8N_BASE_URL;
const API_KEY  = args['api-key']  || process.env.N8N_API_KEY;
const LEGACY_SUB_002_ID = 'a1b2c3d4-0002-4000-8000-000000000002';
const LEGACY_SUB_004_ID = 'a1b2c3d4-0004-4000-8000-000000000004';
const CURRENT_SUB_002_ID = 'oeydfg22aym5l0';
const CURRENT_SUB_004_ID = 'gU1WpHnU2Jmf3Wgj';

if (!BASE_URL || !API_KEY) {
  console.error('ERROR: --base-url and --api-key are required.');
  console.error('Example: node link_cloud_workflows.js --base-url https://frecuenciaglobal.app.n8n.cloud --api-key n8n_xxx');
  process.exit(1);
}

// --- HTTP helper (no external deps) ---
function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(path, BASE_URL);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// --- Main ---
async function main() {
  console.log(`\n🔗 FG Cloud Workflow Linker`);
  console.log(`   Base URL : ${BASE_URL}`);
  console.log(`   API Key  : ${API_KEY.slice(0, 8)}...\n`);

  // 1. List all workflows
  console.log('Step 1: Fetching workflow list from n8n cloud...');
  const listRes = await apiRequest('GET', '/api/v1/workflows?limit=100');
  if (listRes.status !== 200) {
    console.error('ERROR: Could not fetch workflows. Status:', listRes.status);
    console.error(listRes.body);
    process.exit(1);
  }

  const workflows = listRes.body.data || listRes.body;
  if (!Array.isArray(workflows) || workflows.length === 0) {
    console.error('ERROR: No workflows returned. Make sure all JSONs are imported first.');
    process.exit(1);
  }

  console.log(`   Found ${workflows.length} workflows.\n`);

  // 2. Find SUB-002 and SUB-004 IDs
  const find = (nameFragment) => workflows.find(w => w.name && w.name.includes(nameFragment));

  const sub002 = find('SUB-002');
  const sub004 = find('SUB-004');

  if (!sub002) { console.error('ERROR: SUB-002 not found. Make sure it is imported.'); process.exit(1); }
  if (!sub004) { console.error('ERROR: SUB-004 not found. Make sure it is imported.'); process.exit(1); }

  console.log(`Step 2: Reference resolution:`);
  console.log(`   SUB-002  →  ${sub002.id}  (${sub002.name})`);
  console.log(`   SUB-004  →  ${sub004.id}  (${sub004.name})\n`);

  const replacements = {
    '__LINK_SUB_002__': sub002.id,
    '__LINK_SUB_004__': sub004.id,
    [LEGACY_SUB_002_ID]: sub002.id,
    [LEGACY_SUB_004_ID]: sub004.id,
    [CURRENT_SUB_002_ID]: sub002.id,
    [CURRENT_SUB_004_ID]: sub004.id,
  };

  // 3. Patch all WF-001 through WF-010 (and optionally SUB-001, SUB-003)
  const targets = workflows.filter(w =>
    w.name && (
      /WF-0(0[1-9]|10)/.test(w.name) ||
      /SUB-00[13]/.test(w.name)
    )
  );

  if (targets.length === 0) {
    console.warn('WARNING: No WF-001..010 or SUB-001/003 workflows found to patch.');
  }

  console.log(`Step 3: Patching ${targets.length} workflow(s)...`);

  let successCount = 0;
  let skipCount = 0;

  for (const wf of targets) {
    // Fetch full workflow (list endpoint may omit nodes)
    const getRes = await apiRequest('GET', `/api/v1/workflows/${wf.id}`);
    if (getRes.status !== 200) {
      console.warn(`   SKIP  ${wf.name} — could not fetch (status ${getRes.status})`);
      skipCount++;
      continue;
    }

    const fullWf = getRes.body;
    let raw = JSON.stringify(fullWf);

    // Apply replacements
    let changed = false;
    for (const [placeholder, realId] of Object.entries(replacements)) {
      if (raw.includes(placeholder)) {
        raw = raw.split(placeholder).join(realId);
        changed = true;
      }
    }

    if (!changed) {
      console.log(`   OK    ${wf.name} — no placeholders found, skipped`);
      skipCount++;
      continue;
    }

    const patched = JSON.parse(raw);

    // PUT updated workflow
    const putRes = await apiRequest('PUT', `/api/v1/workflows/${wf.id}`, patched);
    if (putRes.status === 200 || putRes.status === 204) {
      console.log(`   ✅    ${wf.name} — patched (SUB-002: ${sub002.id}, SUB-004: ${sub004.id})`);
      successCount++;
    } else {
      console.warn(`   FAIL  ${wf.name} — PUT returned ${putRes.status}`);
      console.warn('         ', JSON.stringify(putRes.body).slice(0, 200));
      skipCount++;
    }
  }

  console.log(`\n✅ Done. ${successCount} patched, ${skipCount} skipped/failed.`);
  console.log('\nNext steps:');
  console.log('  1. Activate all workflows in n8n cloud UI');
  console.log('  2. Smoke test: POST https://frecuenciaglobal.app.n8n.cloud/webhook/intake');
  console.log('  3. Check Telegram notifications arrive correctly\n');
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
