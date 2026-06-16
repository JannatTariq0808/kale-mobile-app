#!/usr/bin/env node
/**
 * Generate /.well-known files for Android App Links + iOS Universal Links.
 *
 * 1. Copy hosting/hosting.config.example.json → hosting/hosting.config.json
 * 2. Paste your SHA-256 fingerprint(s) — debug now, add release later to the array
 * 3. npm run generate:well-known
 * 4. Copy hosting/public/ to your Vercel site repo + merge hosting/vercel.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const hostingDir = path.join(root, 'hosting');
const configPath = path.join(hostingDir, 'hosting.config.json');
const publicDir = path.join(hostingDir, 'public');
const wellKnownDir = path.join(publicDir, '.well-known');

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    console.error(
      'Missing hosting/hosting.config.json — copy hosting.config.example.json and add your SHA-256 values.',
    );
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function normalizeSha256(value) {
  return value.replace(/:/g, '').toUpperCase();
}

function buildAssetLinks(config) {
  const entries = [];

  for (const env of ['production', 'staging']) {
    const block = config.android?.[env];
    if (!block?.packageName) continue;

    const prints = (block.sha256CertFingerprints ?? [])
      .filter((p) => p && !p.includes('PASTE_'))
      .map(normalizeSha256);

    if (!prints.length) {
      console.warn(`Skipping Android ${env}: no SHA-256 configured.`);
      continue;
    }

    entries.push({
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: block.packageName,
        sha256_cert_fingerprints: prints,
      },
    });
  }

  return entries;
}

function buildAppleAssociation(config) {
  const teamId = config.appleTeamId;
  if (!teamId || teamId.includes('PASTE')) {
    throw new Error('Set appleTeamId in hosting.config.json');
  }

  const details = [];

  for (const suffix of ['insure.kale.mobile', 'insure.kale.mobile.staging']) {
    details.push({
      appID: `${teamId}.${suffix}`,
      paths: ['/open-app/reset-password', '/open-app/reset-password/*', '/reset-password', '/reset-password/*', '/__/auth/*'],
    });
  }

  return {
    applinks: {
      apps: [],
      details,
    },
  };
}

function writeOutputs(assetLinks, appleAssociation) {
  fs.mkdirSync(wellKnownDir, { recursive: true });

  const assetLinksPath = path.join(wellKnownDir, 'assetlinks.json');
  const applePath = path.join(wellKnownDir, 'apple-app-site-association');
  const appleRootPath = path.join(publicDir, 'apple-app-site-association');

  fs.writeFileSync(assetLinksPath, `${JSON.stringify(assetLinks, null, 2)}\n`);
  fs.writeFileSync(applePath, `${JSON.stringify(appleAssociation, null, 2)}\n`);
  fs.writeFileSync(appleRootPath, `${JSON.stringify(appleAssociation, null, 2)}\n`);

  // Keep repo copies in sync for review in git
  fs.writeFileSync(path.join(hostingDir, 'assetlinks.json'), `${JSON.stringify(assetLinks, null, 2)}\n`);
  fs.writeFileSync(
    path.join(hostingDir, 'apple-app-site-association'),
    `${JSON.stringify(appleAssociation, null, 2)}\n`,
  );

  console.log(`wrote ${assetLinksPath}`);
  console.log(`wrote ${applePath}`);
  console.log(`wrote ${appleRootPath}`);
  console.log(`Android entries: ${assetLinks.length} (production + staging)`);
  console.log('');
  console.log('Vercel (www.kale.insure): copy hosting/public/ into your website repo public/ folder,');
  console.log('merge hosting/vercel.json headers into the site vercel.json, then redeploy.');
}

const config = loadConfig();
const assetLinks = buildAssetLinks(config);

if (!assetLinks.length) {
  console.error('No Android entries generated. Add SHA-256 values to hosting.config.json');
  process.exit(1);
}

writeOutputs(assetLinks, buildAppleAssociation(config));
