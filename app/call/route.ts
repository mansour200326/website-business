import { logServerEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/**
 * Tracked phone redirect — websmith.ae/call logs a tel_click (referrer
 * preserved, ?src= supported like /wa) then 302s to the dialer.
 */
export async function GET(req: Request) {
  await logServerEvent(req, "tel_click", "/call");
  return new Response(null, { status: 302, headers: { Location: "tel:+971585461253" } });
}
