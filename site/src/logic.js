// Pure functions shared by the page and by src/facts.check.mjs (which asserts them in `npm run build`).

// SQLite's datetime('now') text format: 'YYYY-MM-DD HH:MM:SS' (UTC).
export const sqliteNow = (ms) => new Date(ms).toISOString().replace('T', ' ').slice(0, 19);

// Reproduces web/app/api/auth/session/route.ts:
//   POST stores  expires_at = new Date(Date.now() + 15*60*1000).toISOString()
//   GET  accepts WHERE expires_at > datetime('now')   (SQLite compares the two as TEXT)
export function sessionCheck(loginMs, minutesSince, sessionMinutes) {
  const expiresAt = new Date(loginMs + sessionMinutes * 60 * 1000).toISOString();
  const nowMs = loginMs + minutesSince * 60 * 1000;
  const now = sqliteNow(nowMs);
  // Text comparison: same date prefix, then 'T' (0x54) vs ' ' (0x20) decides, so 'T' always wins.
  const accepted = expiresAt > now;
  const intended = minutesSince < sessionMinutes;
  const e = new Date(expiresAt);
  // The stored string loses to datetime('now') only once the UTC date moves past its own date.
  const actualEndMs = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate() + 1);
  return { expiresAt, now, accepted, intended, actualMinutes: (actualEndMs - loginMs) / 60000 };
}

// Same comparison with the proposed fix: store expires_at in SQLite's own format.
export const fixedAccepted = (loginMs, minutesSince, sessionMinutes) =>
  sqliteNow(loginMs + sessionMinutes * 60000) > sqliteNow(loginMs + minutesSince * 60000);

export function compareRoles(a, b) {
  const A = new Set(a.permissions), B = new Set(b.permissions);
  return {
    shared: a.permissions.filter((p) => B.has(p)),
    onlyA: a.permissions.filter((p) => !B.has(p)),
    onlyB: b.permissions.filter((p) => !A.has(p)),
  };
}

export const gtiRent = (monthlyIncome, pct) => Math.round(monthlyIncome * pct) / 100;
export const capRent = (rent, pct) => Math.round(rent * (100 + pct)) / 100;

export function rentRoll(properties, units, leases) {
  return properties.map((p) => {
    const us = units.filter((u) => u.property_id === p.property_id);
    const ls = leases.filter((l) => l.property_id === p.property_id);
    return {
      ...p,
      seededUnits: us.length,
      occupied: us.filter((u) => u.status === 'occupied').length,
      monthlyRent: us.reduce((s, u) => s + u.monthly_rent, 0),
      leaseRent: ls.reduce((s, l) => s + l.monthly_rent, 0),
      leases: ls.length,
      units: us,
    };
  });
}
