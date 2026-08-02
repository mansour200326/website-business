import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Server-side helpers shared by the analytics routes (/api/track, /api/stats,
 * /api/login). First-party and cookie-free on the visitor side: no raw IPs are
 * ever stored — visitors are counted via a salted SHA-256 that rotates daily.
 */

export const EVENT_TYPES = ["pageview", "whatsapp_click", "tel_click", "portfolio_click"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** Salt for the visitor hash. Set ANALYTICS_SALT; falls back to ADMIN_PASSWORD. */
function salt(): string {
  return process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || "";
}

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Minimal PostgREST call — no client library needed. Returns the Response. */
export async function sb(path: string, init?: RequestInit): Promise<Response> {
  const url = `${process.env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${path}`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return fetch(url, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

/** Today's date key in Dubai time (UAE has no DST — fixed +04:00). */
export function dubaiDay(d: Date = new Date()): string {
  return new Date(d.getTime() + 4 * 3600_000).toISOString().slice(0, 10);
}

/** Start of the Dubai-local day, as a UTC Date. */
export function dubaiDayStart(d: Date = new Date()): Date {
  return new Date(`${dubaiDay(d)}T00:00:00+04:00`);
}

/**
 * Daily-rotating visitor hash: SHA-256(salt | ip | user-agent | Dubai date).
 * The raw IP is used only inside this function and never stored, and the daily
 * rotation means the hash cannot track anyone across days.
 */
export function visitorHash(ip: string, ua: string): string {
  return createHash("sha256").update(`${salt()}|${ip}|${ua}|${dubaiDay()}`).digest("hex");
}

/** Stateless admin session token, derived from the password (no session store). */
export function adminToken(): string {
  return createHash("sha256").update(`ws-admin-v1|${process.env.ADMIN_PASSWORD || ""}`).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Log an event straight from a server route (used by the /wa and /call
 * redirects). Same privacy rules as /api/track: country from Vercel's geo
 * header, device from the UA, daily salted hash — no raw IP stored. Honors the
 * admin's ws_exclude cookie. Never throws.
 */
export async function logServerEvent(req: Request, type: EventType, path: string): Promise<void> {
  try {
    const cookie = req.headers.get("cookie") || "";
    if (cookie.includes("ws_exclude=1")) return;
    if (!supabaseConfigured()) return;
    const ua = req.headers.get("user-agent") || "";
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    // Referer header when the browser sends one; else an explicit ?src= tag
    // (e.g. /wa?src=instagram in the Instagram bio) so the source is never lost.
    const src = new URL(req.url).searchParams.get("src");
    const referrer = req.headers.get("referer") || (src ? `src:${src}` : "");
    await sb("site_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        type,
        path,
        referrer: referrer.slice(0, 300) || null,
        country: req.headers.get("x-vercel-ip-country") || null,
        device: /Mobi|Android|iPhone|iPad|IEMobile/i.test(ua) ? "mobile" : "desktop",
        visitor_hash: visitorHash(ip, ua),
      }),
    });
  } catch {
    // logging must never break the redirect
  }
}

/** Is this request an authenticated admin? (checks the httpOnly session cookie) */
export function isAdmin(req: Request): boolean {
  if (!process.env.ADMIN_PASSWORD) return false;
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)ws_admin=([^;]+)/);
  return Boolean(m && safeEqual(m[1], adminToken()));
}
