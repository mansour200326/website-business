import { dubaiDay, dubaiDayStart, isAdmin, sb, supabaseConfigured } from "@/lib/analytics";

export const dynamic = "force-dynamic";

interface EventRow {
  created_at: string;
  type: string;
  path: string | null;
  referrer: string | null;
  country: string | null;
  device: string | null;
  visitor_hash: string | null;
}

const RANGES: Record<string, number> = { today: 1, "7d": 7, "30d": 30 };

/** Page through PostgREST (Supabase caps a single response at ~1000 rows). */
async function fetchEvents(sinceIso: string): Promise<EventRow[]> {
  const rows: EventRow[] = [];
  const chunk = 1000;
  for (let from = 0; from < 20000; from += chunk) {
    const res = await sb(
      `site_events?select=created_at,type,path,referrer,country,device,visitor_hash&created_at=gte.${encodeURIComponent(sinceIso)}&order=created_at.asc`,
      { headers: { Range: `${from}-${from + chunk - 1}` } }
    );
    if (!res.ok && res.status !== 206) break;
    const batch = (await res.json()) as EventRow[];
    rows.push(...batch);
    if (batch.length < chunk) break;
  }
  return rows;
}

function top(counts: Map<string, number>, n = 8): Array<{ key: string; count: number }> {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1);
}

/** Referrer → readable source: hostname, own-site navigation dropped, empty → Direct. */
function refKey(referrer: string | null): string | null {
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (!host || host === "websmith.ae" || host === "localhost") return null;
    return host;
  } catch {
    return "Direct";
  }
}

async function leadsSummary() {
  try {
    const head = { method: "HEAD", headers: { Prefer: "count=exact", Range: "0-0" } } as const;
    const totalRes = await sb("leads?select=id", head);
    const total = Number((totalRes.headers.get("content-range") || "").split("/")[1] ?? NaN);
    const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
    const weekRes = await sb(`leads?select=id&created_at=gte.${encodeURIComponent(weekAgo)}`, head);
    const week = Number((weekRes.headers.get("content-range") || "").split("/")[1] ?? NaN);
    const latestRes = await sb("leads?select=*&order=created_at.desc&limit=10");
    const rows = latestRes.ok ? ((await latestRes.json()) as Array<Record<string, unknown>>) : [];
    const str = (r: Record<string, unknown>, keys: string[]) => {
      for (const k of keys) if (typeof r[k] === "string" && r[k]) return r[k] as string;
      return "—";
    };
    return {
      total: Number.isFinite(total) ? total : null,
      week: Number.isFinite(week) ? week : null,
      latest: rows.map((r) => ({
        business: str(r, ["business_name", "business", "company", "name"]),
        buildType: str(r, ["build_type", "project_type", "package", "type"]),
        date: str(r, ["created_at", "inserted_at"]),
      })),
    };
  } catch {
    return { total: null, week: null, latest: [] };
  }
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!supabaseConfigured()) return Response.json({ configured: false });

  const url = new URL(req.url);
  const days = RANGES[url.searchParams.get("range") || "7d"] ?? 7;
  // Range start = midnight (Dubai) `days-1` days ago, so "today" is one full local day.
  const start = new Date(dubaiDayStart().getTime() - (days - 1) * 86400_000);

  const [events, leads] = await Promise.all([fetchEvents(start.toISOString()), leadsSummary()]);

  const views = events.filter((e) => e.type === "pageview");
  const uniques = new Set(views.map((e) => e.visitor_hash).filter(Boolean));
  const wa = events.filter((e) => e.type === "whatsapp_click").length;
  const tel = events.filter((e) => e.type === "tel_click").length;
  const portfolio = events.filter((e) => e.type === "portfolio_click").length;

  // Continuous daily series (Dubai-local days), zero-filled.
  const series: Array<{ day: string; views: number; visitors: number }> = [];
  const perDay = new Map<string, { views: number; visitors: Set<string> }>();
  for (let i = 0; i < days; i++) {
    const day = dubaiDay(new Date(start.getTime() + i * 86400_000 + 12 * 3600_000));
    perDay.set(day, { views: 0, visitors: new Set() });
    series.push({ day, views: 0, visitors: 0 });
  }
  for (const e of views) {
    const bucket = perDay.get(dubaiDay(new Date(e.created_at)));
    if (!bucket) continue;
    bucket.views++;
    if (e.visitor_hash) bucket.visitors.add(e.visitor_hash);
  }
  for (const s of series) {
    const b = perDay.get(s.day)!;
    s.views = b.views;
    s.visitors = b.visitors.size;
  }

  const pages = new Map<string, number>();
  const referrers = new Map<string, number>();
  const countries = new Map<string, number>();
  const devices = new Map<string, number>();
  for (const e of views) {
    bump(pages, e.path || "/");
    const ref = refKey(e.referrer);
    if (ref) bump(referrers, ref);
    if (e.country) bump(countries, e.country);
    if (e.device) bump(devices, e.device);
  }

  return Response.json({
    configured: true,
    range: url.searchParams.get("range") || "7d",
    kpis: {
      pageviews: views.length,
      visitors: uniques.size,
      whatsapp: wa,
      tel,
      portfolio,
      conversion: uniques.size ? wa / uniques.size : 0,
    },
    series,
    pages: top(pages),
    referrers: top(referrers),
    countries: top(countries),
    devices: top(devices, 2),
    leads,
  });
}
