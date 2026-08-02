"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Admin analytics dashboard (/dashboard). Password-gated by /api/login
 * (httpOnly cookie); reads aggregates from /api/stats; auto-refreshes every
 * 60 s. Visiting this page also sets the ws_exclude cookie so the admin's own
 * browser is never counted in the stats.
 */

interface Stats {
  configured: boolean;
  kpis?: { pageviews: number; visitors: number; whatsapp: number; tel: number; portfolio: number; conversion: number };
  series?: Array<{ day: string; views: number; visitors: number }>;
  pages?: Array<{ key: string; count: number }>;
  referrers?: Array<{ key: string; count: number }>;
  countries?: Array<{ key: string; count: number }>;
  devices?: Array<{ key: string; count: number }>;
  leads?: { total: number | null; week: number | null; latest: Array<{ business: string; buildType: string; date: string }> };
}

type Range = "today" | "7d" | "30d";
const RANGE_LABELS: Array<[Range, string]> = [
  ["today", "Today"],
  ["7d", "7 days"],
  ["30d", "30 days"],
];

const INK = "#141416";
const CYAN_DEEP = "#0097A7"; // visitors series — passes 3:1 on ivory (validated)

function LineChart({ series }: { series: Array<{ day: string; views: number; visitors: number }> }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 220;
  const PAD = { l: 34, r: 64, t: 12, b: 26 };
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const max = Math.max(4, ...series.map((s) => s.views));
  const x = (i: number) => PAD.l + (series.length < 2 ? iw / 2 : (i / (series.length - 1)) * iw);
  const y = (v: number) => PAD.t + ih - (v / max) * ih;
  const path = (get: (s: { views: number; visitors: number }) => number) =>
    series.map((s, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(get(s)).toFixed(1)}`).join("");
  const ticks = [0, Math.round(max / 2), max];
  const label = (d: string) => `${Number(d.slice(8, 10))}/${Number(d.slice(5, 7))}`;
  const step = Math.max(1, Math.ceil(series.length / 8));
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / iw) * (series.length - 1));
    setHover(i >= 0 && i < series.length ? i : null);
  };
  const h = hover !== null ? series[hover] : null;

  return (
    <div className="dash-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="dash-chart"
        role="img"
        aria-label="Daily page views and unique visitors"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="rgba(20,20,22,.08)" />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" className="dash-tick">
              {t}
            </text>
          </g>
        ))}
        {series.map((s, i) =>
          i % step === 0 ? (
            <text key={s.day} x={x(i)} y={H - 8} textAnchor="middle" className="dash-tick">
              {label(s.day)}
            </text>
          ) : null
        )}
        <path d={path((s) => s.views)} fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d={path((s) => s.visitors)} fill="none" stroke={CYAN_DEEP} strokeWidth="2" strokeLinejoin="round" />
        {series.length <= 14 &&
          series.map((s, i) => (
            <g key={s.day}>
              <circle cx={x(i)} cy={y(s.views)} r="3" fill={INK} />
              <circle cx={x(i)} cy={y(s.visitors)} r="3" fill={CYAN_DEEP} stroke="#F6F4EF" strokeWidth="1.5" />
            </g>
          ))}
        {/* direct end labels — identity is never color-alone. Nudged apart when
            the two line ends converge, so the labels can never collide. */}
        {(() => {
          const last = series[series.length - 1];
          let yv = y(last.views) + 4;
          let yu = y(last.visitors) + 4;
          if (Math.abs(yv - yu) < 14) {
            const mid = (yv + yu) / 2;
            yv = mid + (yv <= yu ? -7 : 7);
            yu = mid + (yv <= yu ? 7 : -7);
          }
          return (
            <>
              <text x={W - PAD.r + 8} y={yv} className="dash-endlabel" fill={INK}>
                Views
              </text>
              <text x={W - PAD.r + 8} y={yu} className="dash-endlabel" fill={CYAN_DEEP}>
                Visitors
              </text>
            </>
          );
        })()}
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} stroke="rgba(20,20,22,.25)" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(h.views)} r="4.5" fill={INK} stroke="#F6F4EF" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(h.visitors)} r="4.5" fill={CYAN_DEEP} stroke="#F6F4EF" strokeWidth="2" />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div className="dash-tooltip" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <strong>{h.day}</strong>
          <span>{h.views} views</span>
          <span>{h.visitors} visitors</span>
        </div>
      )}
      <div className="dash-legend">
        <span>
          <i style={{ background: INK }} /> Page views
        </span>
        <span>
          <i style={{ background: CYAN_DEEP }} /> Unique visitors
        </span>
      </div>
    </div>
  );
}

function Bars({ title, rows, total }: { title: string; rows: Array<{ key: string; count: number }>; total: number }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="dash-card dash-list">
      <div className="dash-card-label">{title}</div>
      {rows.length === 0 && <p className="dash-empty">Nothing yet</p>}
      {rows.map((r) => (
        <div className="dash-row" key={r.key} title={`${r.count} (${total ? Math.round((r.count / total) * 100) : 0}%)`}>
          <span className="dash-row-key">{r.key}</span>
          <span className="dash-row-bar">
            <i style={{ width: `${(r.count / max) * 100}%` }} />
          </span>
          <span className="dash-row-count">{r.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [range, setRange] = useState<Range>("7d");
  const [stats, setStats] = useState<Stats | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const rangeRef = useRef<Range>(range);
  rangeRef.current = range;

  // Exclude this (admin) browser from tracking, permanently.
  useEffect(() => {
    document.cookie = "ws_exclude=1; path=/; max-age=31536000; samesite=lax";
  }, []);

  const load = useCallback(async (r: Range) => {
    try {
      const res = await fetch(`/api/stats?range=${r}`, { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = (await res.json()) as Stats;
      setAuthed(true);
      setStats(data);
      setUpdatedAt(new Date());
    } catch {
      /* keep last good data */
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [range, load]);

  // Auto-refresh every 60 s.
  useEffect(() => {
    const id = setInterval(() => {
      if (authed) load(rangeRef.current);
    }, 60_000);
    return () => clearInterval(id);
  }, [authed, load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      load(rangeRef.current);
    } else {
      const data = await res.json().catch(() => null);
      setLoginError(data?.error || "Wrong password");
    }
  };

  if (authed === false) {
    return (
      <main className="dash-login">
        <form className="dash-login-card" onSubmit={login}>
          <div className="wordmark wm-tone-ink" style={{ fontSize: 30 }}>
            Websmith<span className="wm-dot">.</span>
          </div>
          <p className="dash-login-hint">Admin dashboard</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            aria-label="Admin password"
          />
          <button className="btn" type="submit">
            Sign in
          </button>
          {loginError && <p className="dash-login-error">{loginError}</p>}
        </form>
      </main>
    );
  }

  const k = stats?.kpis;
  const fmtDate = (iso: string) =>
    /^\d{4}-/.test(iso) ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : iso;

  return (
    <main className="dash">
      <header className="dash-head">
        <div>
          <div className="wordmark wm-tone-ink" style={{ fontSize: 26 }}>
            Websmith<span className="wm-dot">.</span>
          </div>
          <span className="dash-sub">Dashboard</span>
        </div>
        <div className="dash-ranges" role="tablist" aria-label="Time range">
          {RANGE_LABELS.map(([r, label]) => (
            <button key={r} role="tab" aria-selected={range === r} className={range === r ? "on" : ""} onClick={() => setRange(r)}>
              {label}
            </button>
          ))}
        </div>
      </header>

      {stats && !stats.configured && (
        <div className="dash-card dash-notice">
          Supabase isn&apos;t configured yet — set <code>SUPABASE_URL</code> and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>, and run <code>supabase/schema.sql</code>.
        </div>
      )}

      {k && (
        <section className="dash-kpis">
          {[
            ["Page views", String(k.pageviews)],
            ["Unique visitors", String(k.visitors)],
            ["WhatsApp taps", String(k.whatsapp)],
            ["Phone taps", String(k.tel)],
            ["Conversion", `${(k.conversion * 100).toFixed(1)}%`],
          ].map(([label, value]) => (
            <div className="dash-card dash-kpi" key={label}>
              <div className="dash-card-label">{label}</div>
              <div className="dash-kpi-value">{value}</div>
            </div>
          ))}
        </section>
      )}

      {stats?.series && stats.series.length > 0 && (
        <section className="dash-card">
          <div className="dash-card-label">Views &amp; visitors per day</div>
          <LineChart series={stats.series} />
        </section>
      )}

      {stats?.configured && (
        <section className="dash-grid">
          <Bars title="Top pages" rows={stats.pages || []} total={k?.pageviews || 0} />
          <Bars title="Top referrers" rows={stats.referrers || []} total={k?.pageviews || 0} />
          <Bars title="Countries" rows={stats.countries || []} total={k?.pageviews || 0} />
          <Bars title="Devices" rows={stats.devices || []} total={k?.pageviews || 0} />
        </section>
      )}

      {stats?.leads && (
        <section className="dash-card">
          <div className="dash-card-label">Leads</div>
          <div className="dash-leads-kpis">
            <span>
              <strong>{stats.leads.total ?? "—"}</strong> briefs total
            </span>
            <span>
              <strong>{stats.leads.week ?? "—"}</strong> this week
            </span>
          </div>
          {stats.leads.latest.length > 0 ? (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Build</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.leads.latest.map((l, i) => (
                  <tr key={i}>
                    <td>{l.business}</td>
                    <td>{l.buildType}</td>
                    <td>{fmtDate(l.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="dash-empty">No briefs yet</p>
          )}
        </section>
      )}

      <div className="dash-foot">
        {updatedAt && <span>Updated {updatedAt.toLocaleTimeString()}</span>}
        <span>Auto-refreshes every 60s · your browser is excluded from tracking</span>
      </div>
    </main>
  );
}
