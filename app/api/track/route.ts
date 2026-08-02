import { EVENT_TYPES, sb, supabaseConfigured, visitorHash, type EventType } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/**
 * First-party, cookie-free tracking beacon. The client sends only
 * { type, path, referrer } via navigator.sendBeacon; everything sensitive is
 * derived here on the server — country from Vercel's geo header, device from
 * the user agent, and a daily-rotating salted hash instead of any raw IP.
 *
 * Always answers 204: a beacon is fire-and-forget, and a tracking failure must
 * never surface to the visitor.
 */
export async function POST(req: Request) {
  try {
    // The admin's own browser is excluded (visiting /dashboard sets ws_exclude).
    const cookie = req.headers.get("cookie") || "";
    if (cookie.includes("ws_exclude=1")) return new Response(null, { status: 204 });

    const body = await req.json().catch(() => null);
    const type = body?.type as EventType;
    const path = typeof body?.path === "string" ? body.path.slice(0, 300) : "";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : "";
    if (!EVENT_TYPES.includes(type)) return new Response(null, { status: 204 });
    if (path.startsWith("/dashboard")) return new Response(null, { status: 204 });
    if (!supabaseConfigured()) return new Response(null, { status: 204 });

    const ua = req.headers.get("user-agent") || "";
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const country = req.headers.get("x-vercel-ip-country") || null;
    const device = /Mobi|Android|iPhone|iPad|IEMobile/i.test(ua) ? "mobile" : "desktop";

    await sb("site_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        type,
        path: path || null,
        referrer: referrer || null,
        country,
        device,
        visitor_hash: visitorHash(ip, ua),
      }),
    });
  } catch {
    // swallow — never let tracking break the page
  }
  return new Response(null, { status: 204 });
}
