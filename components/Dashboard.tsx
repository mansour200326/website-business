"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Admin analytics dashboard (/dashboard). Password-gated by /api/login
 * (httpOnly cookie); reads aggregates from /api/stats; auto-refreshes every
 * 60 s. Visiting this page also sets the ws_exclude cookie so the admin's own
 * browser is never counted in the stats.
 *
 * The full layout ALWAYS renders — zeroed KPIs, empty chart, section headings —
 * even before data arrives or when Supabase isn't reachable; failures surface
 * as a visible error banner, never as a blank page.
 */

interface Stats {
  configured: boolean;
  error?: string;
  kpis?: { pageviews: number; visitors: number; whatsapp: number; tel: number; portfolio: number; conversion: number };
  series?: Array<{ day: string; views: number; visitors: number }>;
  pages?: Array<{ key: string; count: number }>;
  referrers?: Array<{ key: string; count: number }>;
  countries?: Array<{ key: string; count: number }>;
  devices?: Array<{ key: string; count: number }>;
  sources?: Array<{ key: string; visitors: number; whatsapp: number }>;
  lastEvent?: { at: string; type: string } | null;
  leads?: { total: number | null; week: number | null; latest: Array<{ business: string; buildType: string; date: string }>; error?: string };
}

type Range = "today" | "7d" | "30d";
const RANGE_LABELS: Array<[Range, string]> = [
  ["today", "Today"],
  ["7d", "7 days"],
  ["30d", "30 days"],
];
const RANGE_DAYS: Record<Range, number> = { today: 1, "7d": 7, "30d": 30 };

const ZERO_KPIS = { pageviews: 0, visitors: 0, whatsapp: 0, tel: 0, portfolio: 0, conversion: 0 };
const ZERO_SOURCES = ["Instagram", "Google", "Direct", "Other"].map((key) => ({ key, visitors: 0, whatsapp: 0 }));

/** Zero-filled placeholder series so the chart renders before/without data. */
function zeroSeries(range: Range): Array<{ day: string; views: number; visitors: number }> {
  const days = RANGE_DAYS[range];
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() + 4 * 3600_000 - i * 86400_000); // Dubai-local day keys
    out.push({ day: d.toISOString().slice(0, 10), views: 0, visitors: 0 });
  }
  return out;
}

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

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
  const [fetchError, setFetchError] = useState("");
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
      if (!res.ok) {
        setAuthed(true);
        setFetchError(`/api/stats failed with HTTP ${res.status}`);
        return;
      }
      const data = (await res.json()) as Stats;
      setAuthed(true);
      setStats(data);
      setFetchError("");
      setUpdatedAt(new Date());
    } catch (e) {
      setFetchError(`Couldn't load stats — ${(e as Error).message || "network error"}`);
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

  // Everything below ALWAYS renders — real data when present, zeros otherwise.
  const k = stats?.kpis ?? ZERO_KPIS;
  const series = stats?.series?.length ? stats.series : zeroSeries(range);
  const sources = stats?.sources?.length ? stats.sources : ZERO_SOURCES;
  const banner = fetchError || stats?.error || "";
  const loading = !stats && !fetchError && authed === null;
  const maxSource = Math.max(1, ...sources.map((s) => Math.max(s.visitors, s.whatsapp)));
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

      {banner && (
        <div className="dash-card dash-error" role="alert">
          <strong>Analytics problem:</strong> {banner}
        </div>
      )}
      {loading && <div className="dash-card dash-notice">Loading…</div>}

      <section className="dash-kpis">
        <div className="dash-card dash-kpi big">
          <div className="dash-card-label">Page views</div>
          <div className="dash-kpi-value">{k.pageviews}</div>
        </div>
        <div className="dash-card dash-kpi big">
          <div className="dash-card-label">WhatsApp taps</div>
          <div className="dash-kpi-value">{k.whatsapp}</div>
        </div>
        <div className="dash-card dash-kpi">
          <div className="dash-card-label">Unique visitors</div>
          <div className="dash-kpi-value">{k.visitors}</div>
        </div>
        <div className="dash-card dash-kpi">
          <div className="dash-card-label">Phone taps</div>
          <div className="dash-kpi-value">{k.tel}</div>
        </div>
        <div className="dash-card dash-kpi">
          <div className="dash-card-label">Conversion</div>
          <div className="dash-kpi-value">{(k.conversion * 100).toFixed(1)}%</div>
        </div>
      </section>

      <section className="dash-card">
        <div className="dash-card-label">Views &amp; visitors per day</div>
        <LineChart series={series} />
      </section>

      <section className="dash-card">
        <div className="dash-card-label">Sources — visitors &amp; WhatsApp taps</div>
        <div className="dash-sources-head">
          <span />
          <span>Visitors</span>
          <span>WhatsApp</span>
        </div>
        {sources.map((s) => (
          <div className="dash-source-row" key={s.key}>
            <span className="dash-row-key">{s.key}</span>
            <span className="dash-source-cell">
              <i className="v" style={{ width: `${(s.visitors / maxSource) * 100}%` }} />
              <em>{s.visitors}</em>
            </span>
            <span className="dash-source-cell">
              <i className="w" style={{ width: `${(s.whatsapp / maxSource) * 100}%` }} />
              <em>{s.whatsapp}</em>
            </span>
          </div>
        ))}
      </section>

      <section className="dash-grid">
        <Bars title="Top pages" rows={stats?.pages || []} total={k.pageviews} />
        <Bars title="Top referrers" rows={stats?.referrers || []} total={k.pageviews} />
        <Bars title="Countries" rows={stats?.countries || []} total={k.pageviews} />
        <Bars title="Devices" rows={stats?.devices || []} total={k.pageviews} />
      </section>

      <section className="dash-card">
        <div className="dash-card-label">Leads</div>
        {stats?.leads?.error && <p className="dash-empty">{stats.leads.error}</p>}
        <div className="dash-leads-kpis">
          <span>
            <strong>{stats?.leads?.total ?? "—"}</strong> briefs total
          </span>
          <span>
            <strong>{stats?.leads?.week ?? "—"}</strong> this week
          </span>
        </div>
        {stats?.leads?.latest?.length ? (
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

      <div className="dash-foot">
        <span>
          {stats?.lastEvent
            ? `Last event: ${stats.lastEvent.type} · ${timeAgo(stats.lastEvent.at)}`
            : "Last event: none recorded yet"}
          {updatedAt && ` · updated ${updatedAt.toLocaleTimeString()}`}
        </span>
        <span>Auto-refreshes every 60s · your browser is excluded from tracking</span>
      </div>
    </main>
  );
}
