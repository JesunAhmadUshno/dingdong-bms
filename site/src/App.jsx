import { useMemo, useState, useEffect, useId } from 'react';
import F from './facts.json';
import { sessionCheck, fixedAccepted, compareRoles, gtiRent, capRent, rentRoll } from './logic.js';

const REPO = 'https://github.com/JesunAhmadUshno/dingdong-bms';
const blob = (p) => `${REPO}/blob/master/${p}`;
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const money = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const hm = (mins) => `${Math.floor(mins / 60)}h ${String(Math.round(mins % 60)).padStart(2, '0')}m`;
const CATS = ['Occupant', 'Owner', 'Manager', 'Support', 'Government'];
const roleById = Object.fromEntries(F.roles.map((r) => [r.role_id, r]));
const typeById = Object.fromEntries(F.propertyTypes.map((t) => [t.type_id, t]));
const S = F.session, A = F.access, R = F.readme;
const EX = sessionCheck(Date.UTC(2026, 0, 15, 10), 120, S.minutes); // worked example, asserted in facts.check.mjs

const SECTIONS = [['top', 'Overview', '◎'], ['roles', 'Roles', '⊞'], ['session', 'Session', '◷'], ['access', 'Access', '⇢'], ['rent', 'Rent', '⌂'], ['claims', 'Claims', '✓'], ['arch', 'Architecture', '⇄'], ['run', 'Run', '❯_']];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function MenuBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  return (
    <div className="menubar" role="banner">
      <span className="apple" aria-hidden="true">◆</span>
      <a className="app" href="#top">DingDong BMS</a>
      <a className="m" href={blob('docs/research-review.md')}>Research review</a>
      <a className="m" href={blob('ARCHITECTURE.md')}>Architecture</a>
      <a className="m" href={blob('CODE_REVIEW.md')}>Code review</a>
      <span className="spacer" />
      <span className="status"><i /> Built from source</span>
      <a href={REPO}>GitHub ↗</a>
      <span className="clock">{now.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span>
    </div>
  );
}

function Dock() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="dock" aria-label="Sections">
      {SECTIONS.map(([id, label, icon]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>
          <span className="ico" aria-hidden="true">{icon}</span><span className="lbl">{label}</span>
        </a>
      ))}
    </nav>
  );
}

function Range({ label, value, min, max, step, onChange, show }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label} <span>{show}</span></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

function Select({ label, value, onChange, children }) {
  const id = useId();
  return (
    <div className="field"><label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(+e.target.value)}>{children}</select>
    </div>
  );
}

const Pill = ({ s, children }) => <span className={`pill ${s}`}>{children}</span>;

export default function App() {
  useReveal();
  return (
    <div className="wrap">
      <MenuBar />
      <div className="glow" aria-hidden="true" />
      <Hero />
      <Roles />
      <Session />
      <Access />
      <Rent />
      <Claims />
      <Architecture />
      <Run />
      <Dock />
      <footer>
        DingDong BMS, MIT licence, branding credit TriMatrixLab. Every number on this page is read from <code>web/</code> and the repo's markdown at build time by <code>site/src/facts.check.mjs</code>; the explorers run in your browser. Seed data, not real buildings or people.
      </footer>
    </div>
  );
}

function Hero() {
  const I = F.inventory, RF = F.readmeFacts;
  const tiles = [
    [I.tsx, '.tsx files under web/', RF.tsx],
    [I.md, 'markdown docs in the repo', RF.md],
    [F.roles.length, 'roles in ROLES', RF.roles],
    [F.propertyTypes.length, 'tenure types in PROPERTY_TYPES', null],
    [I.handlers.length, `API handlers in ${I.routeFiles} route files`, null],
    [fmt(I.tsLines), `lines of TypeScript in ${I.tsFiles} files`, null],
  ];
  return (
    <header className="card hero window" id="top" data-title="dingdong-bms — README.md">
      <div className="head">
        <p className="eyebrow">Source audit · Next.js {F.deps.dependencies.next} prototype</p>
        <Pill s="good">● Session and occupant bugs fixed</Pill>
      </div>
      <h1>DingDong BMS models <em>{F.roles.length} housing roles</em> across {F.propertyTypes.length} Canadian tenure types, and its own source shows how the {S.minutes}-minute session and the occupant API came to match the README.</h1>
      <p className="sub">
        DingDong is a building-management prototype: role portals, leases, occupants and rent rules on Next.js and SQLite.
        It needs a Node server, so it can't run here. This page reads its source instead. It explores the role model, replays the old and fixed session check in your browser,
        traces the occupant API path, and scores each README claim as pass, fail or unmeasured.
      </p>
      <div className="actions">
        <a className="btn primary" href="#session">Try the session simulator</a>
        <a className="btn ghost" href={blob('docs/research-review.md')}>Read the research review</a>
        <span className="hint">Ticks show tiles checked against the README <code>Facts</code> table</span>
      </div>
      <div className="tiles tiles3">
        {tiles.map(([v, cap, readme]) => (
          <div className="tile" key={cap}>
            <div className="num">{v}</div>
            <div className="cap">{cap}{readme != null && (+String(v).replace(/,/g, '') === readme
              ? <span className="ok"> ✓ README says {readme}</span>
              : <span className="no"> ✗ README says {readme}</span>)}</div>
          </div>
        ))}
      </div>
    </header>
  );
}

function Roles() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const A_ = roleById[a], B_ = roleById[b];
  const c = compareRoles(A_, B_);
  const grouped = CATS.map((cat) => [cat, F.roles.filter((r) => r.category === cat)]).filter(([, rs]) => rs.length);
  const max = Math.max(...F.roles.map((r) => r.permissions.length));
  const Chips = ({ list, s }) => list.length ? <div className="chips">{list.map((p) => <span key={p} className={`chip ${s}`}>{p}</span>)}</div> : <p className="hint">none</p>;
  return (
    <section id="roles" className="card window reveal" data-title="lib/database.ts — ROLES">
      <p className="eyebrow">Role permission explorer</p>
      <h2>{F.roles.length} roles, {A.permCount} distinct permission strings, {CATS.length} categories.</h2>
      <p className="sub">
        Bars count each role's permissions in <a href={blob('web/lib/database.ts')}>ROLES</a>. Click a bar or use the pickers to compare two roles.
        {' '}{F.occRoles.length} {F.occRoles.length === 1 ? 'role holds' : 'roles hold'} an occupant permission (<code>register_occupants</code> or <code>manage_subtenants</code>): {F.occRoles.join(', ')}.
        The occupant API checks {A.occPermChecks} of these strings (see Access).
      </p>
      <div className="rolebars" role="group" aria-label="Permission count per role, grouped by category">
        {grouped.map(([cat, rs]) => (
          <div key={cat} className="rolecat">
            <h3>{cat}</h3>
            {rs.map((ro) => {
              const tone = ro.role_id === a ? 'a' : ro.role_id === b ? 'b' : '';
              return (
                <button key={ro.role_id} className={`rolebar ${tone}`} aria-pressed={!!tone} onClick={() => ro.role_id !== a && setB(ro.role_id)}>
                  <span className="rn">{ro.role_name}</span>
                  <span className="rt"><span className="rf" style={{ width: `${(ro.permissions.length / max) * 100}%` }} /></span>
                  <span className="rc">{ro.permissions.length}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="controls" style={{ marginTop: 16 }}>
        <Select label="Role A (blue)" value={a} onChange={setA}>{F.roles.map((ro) => <option key={ro.role_id} value={ro.role_id}>{ro.role_name}</option>)}</Select>
        <Select label="Role B (amber)" value={b} onChange={setB}>{F.roles.map((ro) => <option key={ro.role_id} value={ro.role_id}>{ro.role_name}</option>)}</Select>
      </div>
      <div className="grid3">
        <div className="tile"><h3>Only {A_.role_name} <small className="hint">({c.onlyA.length})</small></h3><Chips list={c.onlyA} s="a" /></div>
        <div className="tile"><h3>Shared <small className="hint">({c.shared.length})</small></h3><Chips list={c.shared} s="" /></div>
        <div className="tile"><h3>Only {B_.role_name} <small className="hint">({c.onlyB.length})</small></h3><Chips list={c.onlyB} s="b" /></div>
      </div>
      <p className="hint" style={{ marginTop: 10 }}>{A_.description} · {B_.description}</p>
    </section>
  );
}

function Session() {
  const [loginQ, setLoginQ] = useState(40); // quarter-hours after 00:00 UTC
  const [since, setSince] = useState(120);
  const [fix, setFix] = useState(true);
  const day = Date.UTC(2026, 0, 15);
  const login = day + loginQ * 15 * 60000;
  const r = sessionCheck(login, since, S.minutes);
  const accepted = fix ? fixedAccepted(login, since, S.minutes) : r.accepted;
  const actual = fix ? S.minutes : r.actualMinutes;
  const W = 960, H = 140, pad = { l: 16, r: 16 }, max = 1500;
  const x = (m) => pad.l + (Math.min(max, m) / max) * (W - pad.l - pad.r);
  const loginTime = new Date(login).toISOString().slice(11, 16);
  return (
    <section id="session" className="card window reveal" data-title="api/auth/session/route.ts — before and after the fix">
      <div className="head">
        <div>
          <p className="eyebrow">Session lab · reproduction of repo logic</p>
          <h2>A {S.minutes}-minute session that used to last until UTC midnight.</h2>
          <p className="sub">
            The login handler stores <code>expires_at</code> with <code>toISOString()</code> (<span className="mono">{EX.expiresAt}</span>).
            The session check used to run <code>expires_at &gt; datetime('now')</code>, so SQLite compared the two as text against <span className="mono">{EX.now}</span>.
            On the same date the 11th character decided: <code>T</code> (0x54) sorts after a space (0x20), so an expired session still passed until the date changed.
            The route now runs <code>{S.whereClause}</code>, which compares both as times. This page runs both comparisons; the build checks them against real SQLite.
          </p>
        </div>
        <Pill s={accepted === (since < S.minutes) ? 'good' : 'bad'}>{accepted === (since < S.minutes) ? '● Behaves as intended' : '● Accepts an expired session'}</Pill>
      </div>
      <div className="controls">
        <Range label="Login time (UTC)" value={loginQ} min={0} max={95} step={1} onChange={setLoginQ} show={loginTime} />
        <Range label="Minutes since login" value={since} min={0} max={max} step={5} onChange={setSince} show={hm(since)} />
        <div className="field"><span className="flabel">Storage format</span>
          <div className="seg" role="group" aria-label="Storage format">
            <button aria-pressed={!fix} onClick={() => setFix(false)}>Before the fix</button>
            <button aria-pressed={fix} onClick={() => setFix(true)}>Now: datetime(expires_at)</button>
          </div>
        </div>
      </div>
      <div className="grid2">
        <div className="tile mono-tile">
          <div><span className="hint">{fix ? 'datetime(expires_at)' : 'stored expires_at'}</span><br /><b className="mono">{fix ? r.expiresAt.replace('T', ' ').slice(0, 19) : r.expiresAt}</b></div>
          <div><span className="hint">datetime('now')</span><br /><b className="mono">{r.now}</b></div>
          <div><span className="hint">{fix ? 'datetime(expires_at)' : 'expires_at'} &gt; datetime('now')</span><br /><b className={accepted ? 'ok' : 'no'}>{accepted ? 'true · session accepted' : 'false · session rejected'}</b></div>
        </div>
        <div className="tiles" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0 }}>
          <div className="tile"><div className="num">{S.minutes}m</div><div className="cap">intended lifetime (from route.ts)</div></div>
          <div className="tile"><div className="num" style={{ color: actual > S.minutes ? 'var(--bad)' : 'var(--good)' }}>{hm(actual)}</div><div className="cap">actual lifetime for a {loginTime} UTC login</div></div>
        </div>
      </div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Timeline of intended versus actual session validity" style={{ marginTop: 18 }}>
        {[0, 240, 480, 720, 960, 1200, 1440].map((m) => <g key={m}><line className="axis" x1={x(m)} x2={x(m)} y1={14} y2={H - 26} /><text x={x(m)} y={H - 8} textAnchor="middle">{m / 60}h</text></g>)}
        <text x={pad.l} y={22} style={{ fill: 'var(--text)' }}>intended</text>
        <rect x={x(0)} y={28} width={Math.max(3, x(S.minutes) - x(0))} height={18} rx="4" fill="var(--good)" />
        <text x={pad.l} y={68} style={{ fill: 'var(--text)' }}>{fix ? 'now' : 'before fix'}</text>
        <rect x={x(0)} y={74} width={Math.max(3, x(actual) - x(0))} height={18} rx="4" fill={actual > S.minutes ? 'var(--bad)' : 'var(--good)'} opacity="0.85" />
        <line x1={x(since)} x2={x(since)} y1={10} y2={H - 26} stroke="var(--text)" strokeWidth="2" />
        <circle cx={x(since)} cy={10} r="5" fill={accepted ? 'var(--bad)' : 'var(--text)'} />
      </svg>
      <p className="hint">Minutes since login on the x-axis (0 to 25h). The overrun depends on the login time: compare 23:30 and 23:45 UTC. The fix wraps the stored value in <code>datetime()</code>, which also covers rows already stored; <code>web/tests/api.test.mjs</code> runs the real route against an expired session.</p>
    </section>
  );
}

function Access() {
  const [uid, setUid] = useState(1);
  const u = F.users[uid];
  const role = roleById[u.role_id];
  const stored = S.ternary[u.role_id] ?? S.ternaryFallback;
  const canOcc = role.permissions.includes('register_occupants') || role.permissions.includes('manage_subtenants');
  const steps = [
    ['info', 'Login', `POST /api/auth/session matches ${u.username} against the ${S.loginSource}, not a database table.`],
    [stored === role.role_name ? 'good' : 'warn', 'Session row', `role_id ${u.role_id} is ${role.role_name} in ROLES; the route's ternary stores role_name '${stored}'. ${S.toUser.length} of ${F.roles.length} roles (${S.toUser.join(', ')}) become 'USER'.`],
    ['good', 'Browser keeps the session', `auth-context.tsx saves the id and token in ${A.clientStore} and sends x-session-id / x-session-token headers on ${A.clientHeaders} calls to /api/auth/session.`],
    ['good', 'Leaseholder page calls the occupant API', `${A.leaseFetches} fetch calls in portal/leaseholder/page.tsx; ${A.leaseFetchSessionHeaders} send the session headers via sessionHeaders().`],
    ['good', 'withSession → validateSession', `Reads the same x-session-id / x-session-token headers (it used to read cookies that nothing sets; cookie setters in web/: ${A.cookieSetters}).`],
    ['good', 'Session lookup', `SELECT ... FROM sessions WHERE ${A.sessionsPk} = ? on the shared connection to ${A.dbPathMain} (it used to query a missing id column in a stray dingdong.db).`],
    ['good', 'Occupant updates', `PUT /api/occupants ${A.occUpdateAllowList ? 'only accepts known occupant columns' : 'pastes request keys into SQL'}; unknown keys get a 400 instead of reaching the UPDATE statement.`],
    ['warn', 'Authorization', `${role.role_name} ${canOcc ? 'holds' : 'does not hold'} an occupant permission, but the occupant route checks ${A.occPermChecks} of ${A.permCount} permission strings: any valid session could edit any occupant.`],
  ];
  return (
    <section id="access" className="card window reveal" data-title="lib/api-auth.ts — traced from source">
      <div className="head">
        <div>
          <p className="eyebrow">Access-path tracer · traced from source, covered by tests</p>
          <h2>From login to the occupant API, step by step.</h2>
          <p className="sub">
            Pick a seeded demo account. Each step is read from the files linked below. The README's "add an occupant, refresh, still there" check used to return 401;
            <code>web/tests/api.test.mjs</code> now logs in and lists, adds and removes an occupant through the real route handlers.
          </p>
        </div>
        <Pill s="good">Tested</Pill>
      </div>
      <div className="controls" style={{ maxWidth: 360 }}>
        <Select label="Demo account (usernames only)" value={uid} onChange={setUid}>{F.users.map((x, i) => <option key={x.username} value={i}>{x.username} · {roleById[x.role_id].role_name}</option>)}</Select>
      </div>
      <ol className="steps">
        {steps.map(([s, t, d], i) => (
          <li key={t}><span className={`n ${s}`}>{i + 1}</span><div><div className="steph"><b>{t}</b><Pill s={s}>{{ good: 'Works', bad: 'Breaks', warn: 'Gap', info: 'Note' }[s]}</Pill></div><div className="hint">{d}</div></div></li>
        ))}
      </ol>
      <div className="docs" style={{ marginTop: 18 }}>
        {[['web/app/api/auth/session/route.ts', 'Session route'], ['web/lib/api-auth.ts', 'validateSession'], ['web/app/portal/leaseholder/page.tsx', 'Leaseholder page']].map(([p, t]) => <a key={p} href={blob(p)}><b>{t}</b><small className="mono">{p}</small></a>)}
      </div>
    </section>
  );
}

function Rent() {
  const roll = useMemo(() => rentRoll(F.properties, F.units, F.leases), []);
  const [income, setIncome] = useState(F.rent.gtiSeed.income);
  const [rent, setRent] = useState(F.units[0].monthly_rent);
  const [sel, setSel] = useState(0);
  const P = roll[sel];
  const tot = roll.reduce((t, p) => ({ v: t.v + p.market_value, r: t.r + p.monthlyRent, u: t.u + p.total_units, s: t.s + p.seededUnits }), { v: 0, r: 0, u: 0, s: 0 });
  const gti = gtiRent(income, F.rent.gtiPct);
  const seedOk = gtiRent(F.rent.gtiSeed.income, F.rent.gtiPct) === F.rent.gtiSeed.rent;
  return (
    <section id="rent" className="card window reveal" data-title="lib/database.ts — PROPERTIES · UNITS · seed data">
      <div className="head">
        <div>
          <p className="eyebrow">Portfolio and rent rules · seed data, not real buildings</p>
          <h2>{roll.length} seeded properties, {tot.u} declared units, {tot.s} with records.</h2>
          <p className="sub">
            Rent roll, occupancy and value are summed from PROPERTIES, UNITS and LEASE_AGREEMENTS. The two calculators use percentages parsed from <code>PROPERTY_TYPES.rent_control_policy</code> at build time;
            they show the rules as encoded in seed data, which cites no statute text and has not been checked against current law.
          </p>
        </div>
        <Pill s="warn">Seed data</Pill>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Property</th><th>Tenure type</th><th>Units (records / declared)</th><th>Occupied</th><th>Seeded rent / month</th><th>Market value</th></tr></thead>
          <tbody>
            {roll.map((p, i) => (
              <tr key={p.property_id} className={i === sel ? 'sel' : ''} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
                <td><button className="linkbtn" onClick={() => setSel(i)} aria-pressed={i === sel}>{p.address.split(',')[0]}</button></td>
                <td>{typeById[p.property_type_id].type_name}</td><td>{p.seededUnits} / {p.total_units}</td><td>{p.occupied} of {p.seededUnits}</td><td>{money(p.monthlyRent)}</td><td>{money(p.market_value)}</td>
              </tr>
            ))}
            <tr><th>Total</th><th /><th>{tot.s} / {tot.u}</th><th /><th>{money(tot.r)}</th><th>{money(tot.v)}</th></tr>
          </tbody>
        </table>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        {P.address}: {typeById[P.property_type_id].regulation_framework}, {typeById[P.property_type_id].rent_control_policy.toLowerCase()}. Units: {P.units.map((x) => `${x.unit_number} (${x.bedroom_count} bd, ${money(x.monthly_rent)})`).join(', ')}. Leases on file: {P.leases}.
      </p>
      <div className="grid2" style={{ marginTop: 18 }}>
        <div className="tile">
          <h3>Geared-to-income rent ({F.rent.gtiPct}% of household income)</h3>
          <Range label="Monthly household income" value={income} min={500} max={10000} step={50} onChange={setIncome} show={money(income)} />
          <div className="num">{money(gti)}</div>
          <p className="hint" style={{ margin: 0 }}>Seed check: unit 12A rents for {money(F.rent.gtiSeed.rent)}, and its comment says {F.rent.gtiSeed.pct}% of {money(F.rent.gtiSeed.income)}. <span className={seedOk ? 'ok' : 'no'}>{seedOk ? '✓ consistent' : '✗ inconsistent'}</span></p>
        </div>
        <div className="tile">
          <h3>Private-rental increase cap ({F.rent.capPct}% a year)</h3>
          <Range label="Current monthly rent" value={rent} min={500} max={6000} step={25} onChange={setRent} show={money(rent)} />
          <div className="num">{money(capRent(rent, F.rent.capPct))}</div>
          <p className="hint" style={{ margin: 0 }}>Largest next-year rent the seed rule allows, +{money(capRent(rent, F.rent.capPct) - rent)} a month. The seed text calls it an "Ontario example".</p>
        </div>
      </div>
    </section>
  );
}

function Claims() {
  const I = F.inventory, RF = F.readmeFacts;
  const rows = [
    ['11 distinct user roles', `ROLES has ${F.roles.length} entries with unique ids.`, F.roles.length === RF.roles ? 'pass' : 'fail'],
    [`${RF.session}-minute session timeout`, `Fixed: the old text compare kept sessions valid until UTC midnight (up to ${hm(sessionCheck(Date.UTC(2026, 0, 15), 0, S.minutes).actualMinutes)} for a 00:00 login). The route now runs ${S.whereClause}; web/tests/api.test.mjs checks an expired session gets a 401.`, 'pass'],
    ['Demo credentials work', `${R.credsOk} of ${R.creds.length} README logins match a seed user (checked at build time, passwords never shown).${R.creds.filter((c) => !c.ok).map((c) => ` ${c.username}: ${c.reason}.`).join('')}`, R.credsOk === R.creds.length ? 'pass' : 'fail'],
    ['Project structure tree', `${R.treeRows - R.treeMissing.length} of ${R.treeRows} listed paths exist${R.treeMissing.length ? `; missing: ${R.treeMissing.join(', ')}` : ''}.`, R.treeMissing.length ? 'fail' : 'pass'],
    [`${RF.tsx} .tsx files, ${RF.md} docs`, `Counted at build time: ${I.tsx} .tsx and ${I.md} markdown files.`, I.tsx === RF.tsx && I.md === RF.md ? 'pass' : 'fail'],
    ['Real SQLite database for auth', `Sessions and occupants live in SQLite; logins are checked against the ${S.loginSource} with plaintext passwords.`, 'partial'],
    ['Add an occupant, refresh, still there', `Fixed: the occupant API now reads the session headers the browser sends (see Access). web/tests/api.test.mjs adds an occupant and reads it back.`, 'pass'],
    ['Performance figures', `${R.perfLines.length} README lines (session creation, list load, page refresh...). Benchmark scripts or recorded outputs in the repo: ${R.benchFiles.length}.`, 'unmeasured'],
    ['"Production Ready - 0 build errors"', `Committed build logs: ${R.buildLogs.length}. CI workflows that build web/: ${R.appCI}. Test files under web/: ${R.appTests} (seed-data smoke tests and API route tests, run in CI; they do not build the app).`, 'unmeasured'],
  ];
  const tone = (s) => (s === 'pass' ? 'good' : s === 'unmeasured' || s === 'partial' ? 'warn' : 'bad');
  const count = (k) => rows.filter((r) => tone(r[2]) === k).length;
  return (
    <section id="claims" className="card window reveal" data-title="CODE_REVIEW.md — claims vs source">
      <div className="head">
        <div>
          <p className="eyebrow">Claims vs source · computed at build time</p>
          <h2>Each README claim, checked against the code.</h2>
          <p className="sub">Rows are generated from <code>README.md</code> and <code>web/</code> on every build. "Unmeasured" means no evidence exists in the repo either way; it is not a fail.</p>
        </div>
        <div className="legend"><Pill s="good">{count('good')} pass</Pill><Pill s="warn">{count('warn')} partial or unmeasured</Pill><Pill s="bad">{count('bad')} fail</Pill></div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>README claim</th><th>What the source shows</th><th>Verdict</th></tr></thead>
          <tbody>{rows.map(([c, d, s]) => <tr key={c}><td><b>{c}</b></td><td className="hint">{d}</td><td><Pill s={tone(s)}>{s}</Pill></td></tr>)}</tbody>
        </table>
      </div>
      <h3 style={{ marginTop: 22 }}>Limits of this audit</h3>
      <ul className="limits">
        <li>This page does not run the Next.js app. The access-path and session fixes are covered by <code>web/tests/api.test.mjs</code>, which runs the real route handlers on SQLite; the session lab replays the comparison in JavaScript and SQLite.</li>
        <li>No performance number on this page; none can be checked from the repo.</li>
        <li>Rent rules and regulation names are shown as the seed data encodes them, without legal verification.</li>
        <li>Seed properties, units and people are fictional. Demo passwords and SIN-format strings are kept out of the page bundle.</li>
      </ul>
    </section>
  );
}

function Architecture() {
  const W = 960, H = 330;
  const Box = ({ x, y, w, t, s, bad }) => (
    <g><rect x={x} y={y} width={w} height={56} rx="12" fill="var(--surface-strong)" stroke={bad ? 'var(--bad)' : 'var(--border)'} strokeWidth={bad ? 2 : 1.5} />
      <text x={x + w / 2} y={y + 24} textAnchor="middle" style={{ fill: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{t}</text>
      <text x={x + w / 2} y={y + 42} textAnchor="middle" className="mono">{s}</text></g>
  );
  const Arrow = ({ x1, x2, y, label, bad }) => (
    <g><line x1={x1} x2={x2 - 8} y1={y} y2={y} stroke={bad ? 'var(--bad)' : 'var(--primary)'} strokeWidth="2" strokeDasharray={bad ? '6 5' : ''} />
      <path d={`M${x2 - 9} ${y - 5} L${x2} ${y} L${x2 - 9} ${y + 5}z`} fill={bad ? 'var(--bad)' : 'var(--primary)'} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">{label}</text></g>
  );
  return (
    <section id="arch" className="card window reveal" data-title="ARCHITECTURE.md — two auth paths">
      <p className="eyebrow">Architecture, drawn from source</p>
      <h2>Two auth paths, now one session.</h2>
      <p className="sub">
        The browser keeps the session in localStorage and sends it as headers. The occupant path used to expect cookies, a different column and a different database file;
        it now reads the same headers from the same sessions table.
      </p>
      <div className="scroll-x" style={{ overflowX: 'auto', marginTop: 16 }}>
      <svg className="chart wide" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Diagram: login session path and occupant API path, both reading the same sessions table">
        <text x={0} y={18} style={{ fontWeight: 700, fill: 'var(--good)' }}>Path 1 · login and session restore (works)</text>
        <Box x={0} y={34} w={200} t="Browser" s="localStorage" />
        <Arrow x1={200} x2={340} y={62} label="x-session-id header" />
        <Box x={340} y={34} w={240} t="/api/auth/session" s="GET route.ts" />
        <Arrow x1={580} x2={720} y={62} label={`WHERE ${A.sessionsPk} = ?`} />
        <Box x={720} y={34} w={240} t="sessions table" s={A.dbPathMain} />
        <text x={0} y={152} style={{ fontWeight: 700, fill: 'var(--good)' }}>Path 2 · occupant API (works)</text>
        <Box x={0} y={168} w={200} t="Leaseholder page" s={`fetch() × ${A.leaseFetches}, sessionHeaders()`} />
        <Arrow x1={200} x2={340} y={196} label="x-session-id header" />
        <Box x={340} y={168} w={240} t="/api/occupants" s="withSession → validateSession" />
        <Arrow x1={580} x2={720} y={196} label={`WHERE ${A.sessionsPk} = ?`} />
        <Box x={720} y={168} w={240} t="sessions table" s={A.dbPathMain} />
        <line x1={840} x2={840} y1={90} y2={168} stroke="var(--primary)" strokeWidth="2" />
        <text x={828} y={133} textAnchor="end">same table, same file</text>
        <text x={0} y={H - 30}>Path 1 checks {S.whereClause}, so sessions end after {S.minutes} minutes (Session lab).</text>
        <text x={0} y={H - 10}>withRateLimit: {A.rateLimitTodo ? 'TODO placeholder, no limiting' : 'implemented'}.</text>
      </svg>
      </div>
    </section>
  );
}

function Run() {
  const d = F.deps;
  const stack = [['Next.js', d.dependencies.next], ['React', d.dependencies.react], ['better-sqlite3', d.dependencies['better-sqlite3']], ['Tailwind CSS', d.devDependencies.tailwindcss], ['TypeScript', d.devDependencies.typescript]];
  const docs = [
    ['docs/research-review.md', 'Research review', 'Rubric grade, gaps, what each fix costs'],
    ['README.md', 'README', 'Features, setup, demo logins'],
    ['ARCHITECTURE.md', 'Architecture', 'System design as written'],
    ['DATABASE_AND_AUTH.md', 'Database and auth', 'Sessions and schema'],
    ['CODE_REVIEW.md', 'Code review', 'Earlier review notes'],
    ['USER_AND_PROPERTY_SCHEMA.md', 'Schema', 'Roles, tenure types, properties'],
  ];
  return (
    <section id="run" className="card window reveal" data-title="Terminal — npm run dev">
      <p className="eyebrow">Stack and run locally</p>
      <h2>Runs on your machine, not on this page.</h2>
      <p className="sub">Versions from <code>web/package.json</code>. The app needs a Node server and a native SQLite module, so no live app is embedded here.</p>
      <div className="chips" style={{ marginTop: 14 }}>{stack.map(([k, v]) => <span key={k} className="chip">{k} <b>{v}</b></span>)}</div>
      <ol className="steps" style={{ marginTop: 18 }}>
        <li><span className="n">1</span><div><b>Install and start</b><div className="hint"><code>git clone {REPO}.git && cd dingdong-bms/web && npm install && npm run dev</code></div></div></li>
        <li><span className="n">2</span><div><b>Smoke and API tests (no install needed, Node 22.15+)</b><div className="hint"><code>cd web && npm test</code></div></div></li>
        <li><span className="n">3</span><div><b>Rebuild this page and its checks</b><div className="hint"><code>cd site && npm ci && npm run build</code></div></div></li>
      </ol>
      <div className="docs" style={{ marginTop: 20 }}>
        {docs.map(([p, t, s]) => <a key={p} href={blob(p)}><b>{t}</b><small>{s}</small></a>)}
      </div>
    </section>
  );
}
