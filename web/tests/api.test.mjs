// API route tests that need no npm install (Node 22.15+, run with --experimental-transform-types): the real route handlers run against node:sqlite,
// with next/server, next/headers, zod and better-sqlite3 swapped for the tiny stand-ins below.
// Run: cd web && npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stub = (src) => 'data:text/javascript,' + encodeURIComponent(src);
const STUBS = {
  'next/server': stub(`export class NextRequest extends Request { get nextUrl() { return new URL(this.url); } }
    export const NextResponse = { json: (body, init) => Response.json(body, init) };`),
  'next/headers': stub(`export const cookies = async () => ({ get: (n) => globalThis.__cookies?.[n] === undefined ? undefined : { value: globalThis.__cookies[n] } });`),
  zod: stub('export class ZodSchema {}'),
  'better-sqlite3': stub(`import { DatabaseSync } from 'node:sqlite';
    export default class Database extends DatabaseSync { pragma(s) { this.exec('PRAGMA ' + s); } }`),
};
registerHooks({
  resolve(spec, ctx, next) {
    if (STUBS[spec]) return { url: STUBS[spec], shortCircuit: true };
    if (spec.startsWith('@/')) spec = pathToFileURL(path.join(WEB, spec.slice(2))).href;
    if ((spec.startsWith('.') || spec.startsWith('file:')) && !path.extname(spec)) {
      for (const ext of ['.ts', '.tsx']) {
        try { return next(spec + ext, ctx); } catch {}
      }
    }
    return next(spec, ctx);
  },
  // Sources import interfaces without `import type`; the bundler drops those, Node does not.
  // Give every exported interface/type a placeholder value so those imports resolve.
  load(url, ctx, next) {
    const out = next(url, ctx);
    if (!url.startsWith(pathToFileURL(WEB).href) || !/\.tsx?$/.test(url)) return out;
    const names = [...String(out.source).matchAll(/^export (?:interface|type) (\w+)/gm)].map((m) => m[1]);
    return { ...out, source: out.source + names.map((n) => `\nexport const ${n} = undefined;`).join('') };
  },
});

// lib/db.ts opens <cwd>/data/dingdong.db, so run in a throwaway directory.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dingdong-api-'));
process.chdir(tmp);
process.env.NODE_ENV = 'test';

let session, occupants, db, NextRequest;
before(async () => {
  console.log = console.error = () => {}; // routes log every request
  ({ NextRequest } = await import('next/server'));
  session = await import(path.join(WEB, 'app/api/auth/session/route.ts'));
  occupants = await import(path.join(WEB, 'app/api/occupants/route.ts'));
  db = (await import(path.join(WEB, 'lib/db.ts'))).default;
});

after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const req = (method, url, { headers = {}, body } = {}) =>
  new NextRequest('http://localhost' + url, { method, headers: { 'content-type': 'application/json', ...headers }, body: body && JSON.stringify(body) });

async function login() {
  const res = await session.POST(req('POST', '/api/auth/session', { body: { username: 'alice_lease', password: 'leasepass456' } }));
  assert.equal(res.status, 201);
  const { sessionId, token } = await res.json();
  return { 'x-session-id': sessionId, 'x-session-token': token };
}

test('a logged-in leaseholder can list, add and remove occupants with the session headers auth-context stores', async () => {
  const auth = await login();
  let res = await occupants.GET(req('GET', '/api/occupants?property_id=2', { headers: auth }));
  assert.equal(res.status, 200, JSON.stringify(await res.clone().json()));
  const before = (await res.json()).occupants.length;

  res = await occupants.POST(req('POST', '/api/occupants', { headers: auth, body: { property_id: 2, name: 'Cara', email: 'cara@example.com' } }));
  assert.equal(res.status, 201);
  const { occupant_id } = await res.json();
  res = await occupants.GET(req('GET', '/api/occupants?property_id=2', { headers: auth }));
  assert.equal((await res.json()).occupants.length, before + 1, 'added occupant persists');

  res = await occupants.DELETE(req('DELETE', `/api/occupants?occupant_id=${occupant_id}`, { headers: auth }));
  assert.equal(res.status, 200);
  assert.ok(!fs.existsSync(path.join(tmp, 'dingdong.db')), 'no stray database next to data/');
});

test('occupant API still rejects requests without a valid session', async () => {
  assert.equal((await occupants.GET(req('GET', '/api/occupants'))).status, 401);
  const bad = { 'x-session-id': 'nope', 'x-session-token': 'nope' };
  assert.equal((await occupants.GET(req('GET', '/api/occupants', { headers: bad }))).status, 401);
});

test('GET /api/auth/session rejects a session whose expires_at has passed', async () => {
  const auth = await login();
  assert.equal((await session.GET(req('GET', '/api/auth/session', { headers: auth }))).status, 200, 'fresh session is live');
  const expired = new Date(Date.now() - 1000).toISOString(); // POST stores toISOString(); one second ago
  db.prepare('UPDATE sessions SET expires_at = ? WHERE session_id = ?').run(expired, auth['x-session-id']);
  const res = await session.GET(req('GET', '/api/auth/session', { headers: auth }));
  assert.equal(res.status, 401);
});
