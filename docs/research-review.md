# Research and engineering review

Scope: the whole repository at branch `site/live-dashboard`. DingDong BMS is a product
prototype (Next.js 16, React 19, better-sqlite3), not a study, so the research rubric
is applied as far as it fits and the engineering rubric carries most of the weight.
Every count below can be regenerated with `cd site && npm run build`, which prints
them and fails if the source no longer matches.

**Overall grade: C+.** The domain model is ambitious and coherent. Verification was
close to absent: no automated tests, no CI, and README claims that no artifact backs.
This branch adds the cheap fixes; the rest needs a running app and is costed below.

## Rubric

| Criterion | Grade | Evidence |
| :--- | :--- | :--- |
| Question / purpose | B | Clear product goal: one system for 11 housing roles across 5 Canadian tenure types (`web/lib/database.ts`). |
| Hypotheses / claims | C | The README makes testable claims (15-minute sessions, persistence round trip, ~20 ms session creation) but states none as something to test. |
| Method / design | B- | A coherent role, tenure, property, unit, lease, occupant model. Two auth paths that don't connect (see Findings). |
| Baselines | n/a | A product prototype; there is no competing system or prior version measured against. |
| Statistics / uncertainty | D | Performance figures have no benchmark, sample size or spread. Now labelled "not measured" in the README. |
| Reproducibility | C- → C+ | Setup steps work as documented in principle, but 2 of 4 demo logins in the README were wrong and 4 listed paths did not exist. Fixed on this branch; smoke tests and CI added. |
| Threats to validity | D | `TEST_VERIFICATION.md` says "FULLY OPERATIONAL" with no test output. Nothing questions its own evidence. |
| Related work | D | No comparison with existing property-management or social-housing systems. |
| Limitations | D → C | No limitations section existed. The README now has a Known issues section. |
| Engineering: tests | F → C- | No automated tests existed. `web/tests/smoke.test.mjs` now checks seed consistency and the session comparison. |
| Engineering: CI | F → C | No `.github/` folder. `.github/workflows/pages.yml` now runs the smoke tests and the dashboard's known-answer checks on every push to master. It does not build the Next app. |
| Engineering: security | D | Plaintext passwords in source, no server-side permission checks, no rate limiting (a TODO). Acceptable for a demo only. |

## Findings

1. **Session expiry bug (confirmed by reproduction).** `web/app/api/auth/session/route.ts`
   stores `expires_at` as `toISOString()` (`YYYY-MM-DDTHH:MM:SS.sssZ`) and the GET handler
   filters on `expires_at > datetime('now')` (`YYYY-MM-DD HH:MM:SS`). SQLite compares them as
   text; on the same date `T` (0x54) sorts after a space (0x20), so a session is valid until the
   next UTC midnight, not for 15 minutes. Reproduced in `web/tests/smoke.test.mjs` with
   `node:sqlite` and in `site/src/facts.check.mjs` against JavaScript and SQLite.
2. **Occupant API auth most likely broken (static reading, not run).** `validateSession()` in
   `web/lib/api-auth.ts` reads cookies (`dingdong_session_token`, `dingdong_session_id`) that no
   code sets (the browser stores those names in localStorage), selects `WHERE id = ?` although the
   sessions key is `session_id`, and opens `./dingdong.db` while `web/lib/db.ts` writes
   `data/dingdong.db`. The leaseholder page's `fetch` calls send no session header. The README's
   "add an occupant, refresh, still there" check would then fail with 401.
3. **Authorization not enforced.** The occupant route checks none of the permission strings in
   `ROLES`; any valid session could edit or delete any occupant. No property scoping.
4. **role_name mapping.** The ternary in the session POST covers role ids 1, 2, 3, 4 and 11; the
   6 roles 5 to 10 are stored as `'USER'`.
5. **Plaintext credentials.** Login compares against the in-memory `USERS` array, not SQLite.
   Seed users carry SIN/BN-format strings (fictional). "Real SQLite Database" covers sessions and
   occupants only.
6. **README drift (fixed).** Two demo logins were wrong; `app/login/`, `lib/utils.ts`,
   `tailwind.config.js` and `documentation/` were listed but absent; support links pointed at
   channels that don't appear to exist.
7. **Unbacked claims.** "~20 ms session creation", "~5 ms occupant load", "<2 s refresh" and
   "Production Ready - 0 build errors" have no benchmark, log or CI run behind them.
8. **Regulatory text uncited.** The 2.5% Ontario cap, GTI 30%, AODA tiers and an "Accessibility
   for Seniors Act" appear in seed strings without citations; at least the last name may not
   exist as written. The dashboard shows them as "as encoded in seed data" only.
9. **Placeholders.** `withRateLimit` is a TODO; the README's 5 screenshot slots are empty.

## Fixed on this branch (cheap)

- README: corrected demo logins, removed nonexistent paths from the structure tree, labelled
  performance figures "not measured", replaced placeholder support channels, added Known issues
  and the live dashboard link, softened "production-ready" to "prototype".
- `web/tests/smoke.test.mjs` + `npm test` (no install; Node 22.13+): seed referential integrity,
  the GTI seed check, and a characterisation of the expiry comparison that also proves the fix.
- CI: `.github/workflows/pages.yml` runs those tests and the dashboard's known-answer checks.
- `site/`: a dashboard whose every number is read from source at build time, with each README
  claim marked pass, fail, partial or unmeasured.

## Remaining gaps and exactly what they need

| Gap | What it needs |
| :--- | :--- |
| Fix the expiry bug | Owner sign-off for an app behaviour change. One line in `route.ts`: store `expiresAt.toISOString().replace('T', ' ').slice(0, 19)` (or compare with `julianday()`). Flip the smoke test to assert the fixed behaviour. No new dependency. |
| Confirm finding 2 by running it | `cd web && npm install && npm run dev` (installs Next 16 and builds the native better-sqlite3 module; minutes on a laptop), then log in as `alice_lease`, open the leaseholder Occupants tab and record the `/api/occupants` status code. |
| Fix the occupant auth path | After that run: point `validateSession` at the `x-session-id` / `x-session-token` headers and `session_id`, reuse `web/lib/db.ts`, and send the headers from the leaseholder `fetch` calls. Behaviour change, needs sign-off plus a local `next dev` smoke run. |
| Server-side authorization | A `requirePermission(session, 'register_occupants')` check in the occupant route, plus property scoping from the session's `properties`. Small code change; needs the auth path fixed first. |
| role_name mapping | Replace the ternary with `getRoleById(user.role_id).role_name`. Same file, tiny diff; changes stored values, so sign-off. |
| Performance claims | A benchmark script (e.g. `autocannon` against `next start` with a seeded DB) and a committed result with N and spread, or delete the figures. Needs the app installed and running; one local session. |
| "0 build errors" | A CI job running `npm ci && npm run lint && npx tsc --noEmit && npm run build` in `web/`. Needs a committed `web/package-lock.json` (the root `.gitignore` currently ignores lockfiles) and a few minutes of free Actions time per run. |
| Hashed passwords | Move `USERS` into SQLite with bcrypt/argon2 hashes. Adds one dependency and a migration. |
| Regulatory accuracy | A citation per rule to the statute or program page (Ontario RTA guideline, provincial GTI rules), checked by someone who can read them; rename or drop the unverified act name. Desk research only. |
| Related work | A short comparison with existing property-management and social-housing tools. Desk research only. |
| Screenshots | Capture the 5 README slots from a running app (needs the install above). |
