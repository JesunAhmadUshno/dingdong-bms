// Build-time fact extraction + known-answer check. Runs first in `npm run build`.
// Reads web/ source and the repo's markdown, asserts the page's maths against known answers
// (including real SQLite text comparison via node:sqlite), then writes src/facts.json.
// Only safe fields are written: demo users become {username, role_id}; no password or SIN-format string.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { sqliteNow, sessionCheck, fixedAccepted, compareRoles, gtiRent, capRent, rentRoll } from './logic.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const WEB = path.join(ROOT, 'web');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const must = (m, what) => { assert.ok(m, `could not parse ${what}`); return m; };

const db = await import(path.join(WEB, 'lib/database.ts'));
const { ROLES, PROPERTY_TYPES, PROPERTIES, UNITS, LEASE_AGREEMENTS, USERS, OCCUPANTS } = db;

// ---------- file inventory ----------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', 'site', 'dist'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(path.relative(ROOT, p));
  }
  return out;
}
const files = walk(ROOT);
const tsx = files.filter((f) => f.startsWith('web/') && f.endsWith('.tsx'));
const tsAll = files.filter((f) => f.startsWith('web/') && /\.tsx?$/.test(f));
const md = files.filter((f) => f.endsWith('.md'));
const tsLines = tsAll.reduce((s, f) => s + read(f).split('\n').length, 0);
const routeFiles = files.filter((f) => /^web\/app\/api\/.*route\.ts$/.test(f));
const handlers = routeFiles.flatMap((f) => [...read(f).matchAll(/export const (GET|POST|PUT|DELETE|PATCH)\b/g)].map((m) => `${m[1]} /${path.dirname(f).replace('web/app/', '')}`));

// ---------- source reads ----------
const dbRaw = read('web/lib/database.ts');
const route = read('web/app/api/auth/session/route.ts');
const apiAuth = read('web/lib/api-auth.ts');
const dbTs = read('web/lib/db.ts');
const occRoute = read('web/app/api/occupants/route.ts');
const leasePage = read('web/app/portal/leaseholder/page.tsx');
const authCtx = read('web/lib/auth-context.tsx');
const readme = read('README.md');

const sessionMinutes = +must(route.match(/Date\.now\(\) \+ (\d+) \* 60 \* 1000/), 'session minutes')[1];
const storesIso = /expiresAt\.toISOString\(\)/.test(route);
const whereClause = must(route.match(/datetime\(expires_at\) > datetime\('now'\)/), 'GET WHERE clause (datetime-normalised)')[0];
const ternary = Object.fromEntries([...route.matchAll(/role_id === (\d+) \? '(\w+)'/g)].map((m) => [+m[1], m[2]]));
const ternaryFallback = must(route.match(/: '(\w+)',\s*\n\s*JSON\.stringify/), 'ternary fallback')[1];
const loginSource = /USERS\.find\(/.test(route) ? 'in-memory USERS array (web/lib/database.ts)' : 'database';

const capPct = +must(PROPERTY_TYPES.find((t) => t.type_name === 'PRIVATE_RENTAL').rent_control_policy.match(/max ([\d.]+)%/), 'private-rental cap')[1];
const gtiPct = +must(PROPERTY_TYPES.find((t) => t.type_name === 'AFFORDABLE_HOUSING').rent_control_policy.match(/max (\d+)% of household income/), 'GTI share')[1];
const gtiSeed = must(dbRaw.match(/monthly_rent: (\d+), \/\/ (\d+)% of \$(\d+) income/), 'unit 12A GTI comment');

const validateReadsHeaders = /headers\.get\('x-session-id'\)/.test(apiAuth) && /headers\.get\('x-session-token'\)/.test(apiAuth);
const webSrc = tsAll.map((f) => read(f)).join('\n');
const cookieSetters = (webSrc.match(/cookies\(\)\.set|cookieStore\.set|\.cookies\.set|document\.cookie|Set-Cookie/g) || []).length;
const validateSelectsSessionId = /FROM sessions\s+WHERE session_id = \?/.test(apiAuth);
const sessionsCols = must(dbTs.match(/CREATE TABLE IF NOT EXISTS sessions \(([\s\S]*?)\);/), 'sessions table')[1]
  .split('\n').map((l) => l.trim().split(/\s+/)[0]).filter((c) => /^[a-z_]+$/.test(c));
const sessionsPk = must(dbTs.match(/(\w+) TEXT PRIMARY KEY/), 'sessions PK')[1];
const dbPathMain = must(dbTs.match(/path\.join\(process\.cwd\(\), ([^)]*)\)/), 'db.ts path')[1].replace(/['\s]/g, '').replace(',', '/');
const authSharedDb = /import db from '\.\/db'/.test(apiAuth) && !/new Database\(/.test(apiAuth);
const occWithSession = (occRoute.match(/withSession\(/g) || []).length;
const allPerms = [...new Set(ROLES.flatMap((r) => r.permissions))];
const occPermChecks = allPerms.filter((p) => occRoute.includes(`'${p}'`) || occRoute.includes(`"${p}"`)).length;
const leaseFetches = (leasePage.match(/fetch\(/g) || []).length;
const leaseFetchSessionHeaders = (leasePage.match(/sessionHeaders\(\)/g) || []).length;
const occUpdateAllowList = /UPDATABLE_COLUMNS\.includes\(key\)/.test(occRoute);
const clientStore = /localStorage\.setItem\(SESSION_ID_KEY/.test(authCtx) ? 'localStorage' : 'unknown';
const clientHeaders = (authCtx.match(/"x-session-id"/g) || []).length;
const rateLimitTodo = /TODO: Implement actual rate limiting/.test(read('web/lib/middleware.ts'));

// ---------- README parsing ----------
const factsTable = Object.fromEntries([...must(readme.match(/## Facts\n([\s\S]*?)\n\n/), 'README Facts')[1].matchAll(/^\| ([^|]+?) \| ([^|]+?) \|$/gm)].map((m) => [m[1].trim(), m[2].trim()]));
const factNum = (k) => +must((factsTable[k] || '').match(/\d+/), `README fact ${k}`)[0];
const credBlock = must(readme.match(/### Demo Credentials\n+```\n([\s\S]*?)```/), 'README credentials')[1];
const creds = [...credBlock.matchAll(/^(\w+):\n\s+Username: (\S+)\n\s+Password: (\S+)/gm)].map(([, label, username, password]) => {
  const u = USERS.find((x) => x.username === username);
  return { label, username, ok: !!u && u.password === password, reason: !u ? 'no seed user with this username' : u.password !== password ? 'password differs from seed' : 'matches seed user' };
});
const tree = must(readme.match(/## 📁 Project Structure\n+```\n([\s\S]*?)```/), 'README structure tree')[1];
const treeRows = [];
{
  const stack = [];
  for (const line of tree.split('\n')) {
    const i = line.search(/[├└]── /);
    if (i < 0) continue;
    const depth = i / 4, name = line.slice(i + 4).split(/\s+/)[0].replace(/\/$/, '');
    stack.length = depth; stack[depth] = name;
    const p = stack.join('/');
    const generated = /generated|gitignore/i.test(line) || name === 'dingdong.db' || name === 'data';
    treeRows.push({ path: p, ok: generated || exists(p), generated });
  }
}
const treeMissing = treeRows.filter((r) => !r.ok).map((r) => r.path);
const perfLines = must(readme.match(/## 📈 Performance\n+([\s\S]*?)\n\n/), 'README performance')[1].split('\n').filter((l) => l.startsWith('- '));
const benchFiles = files.filter((f) => /bench|perf/i.test(path.basename(f)) && !f.endsWith('.md'));
const appTests = files.filter((f) => f.startsWith('web/') && /\.test\.(m?js|ts)$/.test(f)).length;
const appCI = files.filter((f) => f.startsWith('.github/workflows/') && /run: npm run build\s+working-directory: web\b/.test(read(f))).length;
const buildLogs = files.filter((f) => /build.*\.(log|txt)$/i.test(f));

// ---------- known-answer assertions ----------
assert.equal(ROLES.length, 11); assert.equal(PROPERTY_TYPES.length, 5);
assert.equal(new Set(ROLES.map((r) => r.role_id)).size, ROLES.length, 'role ids unique');
assert.equal(sessionMinutes, 15); assert.ok(storesIso, 'route.ts stores toISOString()');
assert.deepEqual(Object.keys(ternary).map(Number), [1, 2, 3, 4, 11]); assert.equal(ternaryFallback, 'USER');
const toUser = ROLES.filter((r) => !(r.role_id in ternary));
assert.equal(toUser.length, 6);

// session expiry reproduction: two hours after a 10:00 UTC login the session is still accepted until midnight
const t10 = Date.UTC(2026, 0, 15, 10, 0, 0);
let s = sessionCheck(t10, 120, sessionMinutes);
assert.equal(s.expiresAt, '2026-01-15T10:15:00.000Z'); assert.equal(s.now, '2026-01-15 12:00:00');
assert.equal(s.accepted, true); assert.equal(s.intended, false); assert.equal(s.actualMinutes, 14 * 60);
assert.equal(sessionCheck(t10, 10, 15).accepted, true);
assert.equal(sessionCheck(t10, 14 * 60 + 1, 15).accepted, false, 'rejected after UTC midnight');
const t2350 = Date.UTC(2026, 0, 15, 23, 50, 0);
assert.equal(sessionCheck(t2350, 30, 15).accepted, true); assert.equal(sessionCheck(t2350, 30, 15).actualMinutes, 24 * 60 + 10);
assert.equal(fixedAccepted(t10, 120, 15), false); assert.equal(fixedAccepted(t10, 10, 15), true);
// the same comparisons inside real SQLite: the old text compare matches sessionCheck, the shipped
// datetime(expires_at) compare matches fixedAccepted
const sq = new DatabaseSync(':memory:');
const cmp = sq.prepare("SELECT datetime(? , 'unixepoch') AS now, ? > datetime(?, 'unixepoch') AS v, datetime(?) > datetime(?, 'unixepoch') AS f");
for (const [login, mins] of [[t10, 10], [t10, 120], [t10, 900], [t2350, 30], [t2350, 1500]]) {
  const r = sessionCheck(login, mins, sessionMinutes), nowSec = (login + mins * 60000) / 1000;
  const row = cmp.get(nowSec, r.expiresAt, nowSec, r.expiresAt, nowSec);
  assert.equal(row.now, r.now); assert.equal(row.v === 1, r.accepted, `sqlite vs js at ${mins} min`);
  assert.equal(row.f === 1, fixedAccepted(login, mins, sessionMinutes), `fixed sqlite vs js at ${mins} min`);
}
sq.close();

// rent rules as encoded in seed data
assert.equal(capPct, 2.5); assert.equal(gtiPct, 30);
assert.equal(gtiRent(+gtiSeed[3], gtiPct), +gtiSeed[1]); assert.equal(+gtiSeed[1], 960);
assert.equal(UNITS.find((u) => u.unit_number === '12A').monthly_rent, gtiRent(3200, gtiPct));
assert.equal(capRent(2400, capPct), 2460);
const roll = rentRoll(PROPERTIES, UNITS, LEASE_AGREEMENTS);
assert.equal(roll.reduce((a, p) => a + p.monthlyRent, 0), 7360);
assert.equal(roll.reduce((a, p) => a + p.market_value, 0), 7500000);
assert.equal(roll.reduce((a, p) => a + p.total_units, 0), 40);
assert.equal(UNITS.length, 4); assert.equal(PROPERTIES.length, 3);

// roles
const occRoles = ROLES.filter((r) => r.permissions.some((p) => p === 'register_occupants' || p === 'manage_subtenants')).map((r) => r.role_name);
const cmpRL = compareRoles(ROLES[0], ROLES[1]);
assert.equal(cmpRL.shared.length + cmpRL.onlyA.length, ROLES[0].permissions.length);

// inventory vs README facts table
assert.equal(tsx.length, factNum('Frontend files'), 'tsx count vs README');
assert.equal(ROLES.length, factNum('User roles'));
assert.equal(md.length, factNum('Docs'), 'markdown count vs README');
assert.equal(sessionMinutes, factNum('Session timeout'));

// access-path findings the page states
assert.ok(validateReadsHeaders, 'validateSession reads the session headers'); assert.ok(validateSelectsSessionId); assert.equal(sessionsPk, 'session_id');
assert.ok(authSharedDb, 'api-auth uses the shared lib/db.ts connection');
assert.equal(leaseFetchSessionHeaders, leaseFetches, 'every leaseholder occupant fetch sends the session headers');
assert.ok(occUpdateAllowList, 'PUT /api/occupants allow-lists columns'); assert.equal(occPermChecks, 0);

const facts = {
  inventory: { tsx: tsx.length, md: md.length, tsLines, tsFiles: tsAll.length, routeFiles: routeFiles.length, handlers },
  readmeFacts: { tsx: factNum('Frontend files'), md: factNum('Docs'), roles: factNum('User roles'), session: factNum('Session timeout') },
  roles: ROLES, propertyTypes: PROPERTY_TYPES, properties: PROPERTIES, units: UNITS, leases: LEASE_AGREEMENTS,
  occupantsSeeded: OCCUPANTS.length,
  users: USERS.map((u) => ({ username: u.username, role_id: u.role_id })),
  occRoles,
  session: { minutes: sessionMinutes, storesIso, whereClause, ternary, ternaryFallback, toUser: toUser.map((r) => r.role_name), loginSource },
  rent: { capPct, gtiPct, gtiSeed: { rent: +gtiSeed[1], pct: +gtiSeed[2], income: +gtiSeed[3] } },
  access: { cookieSetters, validateReadsHeaders, validateSelectsSessionId, sessionsPk, dbPathMain, authSharedDb, occUpdateAllowList,
    occWithSession, occPermChecks, permCount: allPerms.length, leaseFetches, leaseFetchSessionHeaders, clientStore, clientHeaders, rateLimitTodo },
  readme: { creds, credsOk: creds.filter((c) => c.ok).length, treeRows: treeRows.length, treeMissing, perfLines, benchFiles, buildLogs, appTests, appCI },
  deps: JSON.parse(read('web/package.json')),
};
fs.writeFileSync(path.join(here, 'facts.json'), JSON.stringify(facts, null, 1));
console.log('facts ok', { tsx: tsx.length, md: md.length, roles: ROLES.length, handlers: handlers.length, tsLines, credsOk: `${facts.readme.credsOk}/${creds.length}`, treeMissing });
