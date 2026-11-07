// Smoke tests that need no npm install: Node 22.13+ (built-in TypeScript stripping and node:sqlite).
// Run: cd web && npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { ROLES, PROPERTY_TYPES, PROPERTIES, UNITS, LEASE_AGREEMENTS, USERS, OCCUPANTS } from '../lib/database.ts';

test('seed data is internally consistent', () => {
  assert.equal(ROLES.length, 11);
  assert.equal(new Set(ROLES.map((r) => r.role_id)).size, ROLES.length);
  assert.equal(PROPERTY_TYPES.length, 5);
  const roleIds = new Set(ROLES.map((r) => r.role_id));
  for (const u of USERS) assert.ok(roleIds.has(u.role_id), `${u.username} has a known role`);
  assert.equal(new Set(USERS.map((u) => u.username)).size, USERS.length, 'usernames unique');
  const propIds = new Set(PROPERTIES.map((p) => p.property_id));
  for (const p of PROPERTIES) assert.ok(PROPERTY_TYPES.some((t) => t.type_id === p.property_type_id));
  for (const u of UNITS) assert.ok(propIds.has(u.property_id), `unit ${u.unit_number} on a known property`);
  for (const l of LEASE_AGREEMENTS) {
    const unit = UNITS.find((u) => u.unit_id === l.unit_id);
    assert.ok(unit && unit.property_id === l.property_id, `lease ${l.lease_id} unit belongs to its property`);
    assert.equal(l.monthly_rent, unit.monthly_rent, `lease ${l.lease_id} rent matches its unit`);
  }
  for (const o of OCCUPANTS) assert.ok(LEASE_AGREEMENTS.some((l) => l.lease_id === o.lease_id));
});

test('GTI seed unit charges 30% of the income its comment states', () => {
  assert.equal(UNITS.find((u) => u.unit_number === '12A').monthly_rent, 0.3 * 3200);
});

// Characterises the session-expiry comparison in app/api/auth/session/route.ts:
// POST stores new Date(...).toISOString(); GET filters on expires_at > datetime('now').
test('session expiry: ISO expires_at outlives 15 minutes in SQLite; SQLite-format expires_at does not', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE sessions (session_id TEXT PRIMARY KEY, expires_at DATETIME NOT NULL)');
  const insert = db.prepare('INSERT INTO sessions VALUES (?, ?)');
  const expired = new Date(Date.now() - 60 * 1000); // expired one minute ago
  insert.run('iso', expired.toISOString());
  insert.run('sqlite', expired.toISOString().replace('T', ' ').slice(0, 19)); // proposed fix
  const live = db.prepare("SELECT session_id FROM sessions WHERE expires_at > datetime('now') ORDER BY session_id").all().map((r) => r.session_id);
  db.close();
  // Same UTC date: 'T' sorts after ' ', so the ISO row survives. Across midnight it would not; skip that minute.
  if (expired.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)) assert.deepEqual(live, ['iso']);
  assert.ok(!live.includes('sqlite'), 'the fixed format rejects an expired session');
});
