#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// 1. Locate and parse .env.e2e
const envFiles = [
  path.resolve(__dirname, '../.env.e2e'),
  path.resolve(__dirname, '../../.env.e2e'),
  path.resolve(process.cwd(), '.env.e2e'),
];

let envPath = envFiles.find(p => fs.existsSync(p));
let e2eDbUrl = process.env.DATABASE_URL;

if (envPath) {
  console.log(`[E2E Runner] Loading environment from: ${envPath}`);
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
      if (key === 'DATABASE_URL') e2eDbUrl = val;
    }
  }
}

// 2. Safety Assertion Rule
console.log(`[E2E Safety Guard] Validating target database URL...`);
if (!e2eDbUrl) {
  console.error(`❌ FATAL: DATABASE_URL not found in environment or .env.e2e.`);
  process.exit(1);
}

const isSafeTestDb = 
  e2eDbUrl.includes('echo_lms_e2e') || 
  e2eDbUrl.includes('echo_lms_test') || 
  e2eDbUrl.endsWith('_test') || 
  e2eDbUrl.endsWith('_e2e') ||
  process.env.NODE_ENV === 'test' ||
  process.env.E2E_SAFE_OVERRIDE === 'true';

if (!isSafeTestDb) {
  console.error(`\n⛔ DANGER: Target database "${e2eDbUrl}" is NOT an isolated E2E test database!`);
  console.error(`Expected database name to include 'echo_lms_e2e' or '_test'.`);
  console.error(`Aborting immediately to protect production/development data.\n`);
  process.exit(1);
}

console.log(`🛡️ Target database validated as safe E2E database: ${e2eDbUrl.replace(/:[^:@]+@/, ':***@')}`);

// 3. Reset Schema & Push
const dbDir = path.resolve(__dirname, '..');
const schemaPath = path.resolve(dbDir, 'prisma/schema.prisma');
const seedScript = path.resolve(dbDir, 'prisma/seed-e2e.ts');

try {
  console.log(`🔄 [1/3] Generating Prisma Client...`);
  execSync(`npx prisma generate --schema="${schemaPath}"`, {
    cwd: dbDir,
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: e2eDbUrl }
  });

  console.log(`🔄 [2/3] Resetting schema on E2E database...`);
  execSync(`npx prisma db push --force-reset --accept-data-loss --schema="${schemaPath}"`, {
    cwd: dbDir,
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: e2eDbUrl }
  });

  console.log(`🌱 [3/3] Running deterministic multi-tenant E2E seed...`);
  try {
    execSync(`npx tsx "${seedScript}"`, {
      cwd: dbDir,
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: e2eDbUrl, NODE_ENV: 'test' }
    });
  } catch {
    execSync(`npx ts-node --transpile-only "${seedScript}"`, {
      cwd: dbDir,
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: e2eDbUrl, NODE_ENV: 'test' }
    });
  }

  console.log(`\n🎉 [E2E Reset Complete] echo_lms_e2e is ready with multi-tenant test hierarchy!\n`);
} catch (err) {
  console.error(`\n❌ [E2E Reset Failed]:`, err.message);
  process.exit(1);
}
