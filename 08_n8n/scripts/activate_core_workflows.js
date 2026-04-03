#!/usr/bin/env node
/**
 * activate_core_workflows.js
 *
 * Activates the operational core in an existing n8n Cloud instance:
 * - SUB-002 (Telegram)
 * - SUB-004 (Operations Log)
 * - WF-001
 * - WF-002
 * - WF-003
 * - WF-005
 * - WF-006
 *
 * Usage:
 *   node activate_core_workflows.js [--env path/to/.env.cloud]
 *   node activate_core_workflows.js --base-url https://... --api-key n8n_xxx
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const url = require('url');

const TARGETS = ['SUB-002', 'SUB-004', 'WF-001', 'WF-002', 'WF-003', 'WF-005', 'WF-006'];

const cliArgs = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (arg.startsWith('--')) cliArgs[arg.slice(2)] = arr[i + 1] || true;
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
const envCfg = loadEnv(typeof cliArgs.env === 'string' ? path.resolve(cliArgs.env) : defaultEnvPath);

const BASE_URL = (cliArgs['base-url'] || envCfg.N8N_BASE_URL || '').replace(/\/$/, '');
const API_KEY = cliArgs['api-key'] || envCfg.N8N_API_KEY || '';

if (!BASE_URL || !API_KEY) {
  console.error('ERROR: missing n8n access.');
  console.error('Provide either:');
  console.error('  node activate_core_workflows.js --base-url https://... --api-key n8n_xxx');
  console.error('or create 08_n8n/.env.cloud with N8N_BASE_URL and N8N_API_KEY.');
  process.exit(1);
}

function apiRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(apiPath, BASE_URL);
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('\nActivating Frecuencia Global core workflows');
  console.log(`Target: ${BASE_URL}`);

  const listRes = await apiRequest('GET', '/api/v1/workflows?limit=100');
  if (listRes.status !== 200) {
    console.error(`ERROR: failed to fetch workflows (${listRes.status})`);
    console.error(listRes.body);
    process.exit(1);
  }

  const workflows = listRes.body.data || listRes.body || [];
  let activated = 0;
  let alreadyActive = 0;
  let missing = 0;
  let failed = 0;

  for (const target of TARGETS) {
    const wf = workflows.find(item => item.name && item.name.includes(target));
    if (!wf) {
      console.log(`  MISSING  ${target}`);
      missing++;
      continue;
    }

    if (wf.active) {
      console.log(`  OK       ${wf.name} (already active)`);
      alreadyActive++;
      continue;
    }

    const patchRes = await apiRequest('PATCH', `/api/v1/workflows/${wf.id}`, { active: true });
    if (patchRes.status === 200 || patchRes.status === 204) {
      console.log(`  ACTIVE   ${wf.name}`);
      activated++;
    } else {
      console.log(`  FAIL     ${wf.name} (${patchRes.status})`);
      failed++;
    }
  }

  console.log('\nSummary');
  console.log(`  Activated: ${activated}`);
  console.log(`  Already active: ${alreadyActive}`);
  console.log(`  Missing: ${missing}`);
  console.log(`  Failed: ${failed}`);
}

main().catch((error) => {
  console.error('\nFATAL:', error.message || error);
  process.exit(1);
});
