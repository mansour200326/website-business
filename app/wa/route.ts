import { logServerEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const DEST = "https://wa.me/971585461253?text=Hi%20Websmith%2C%20I%27d%20like%20to%20start%20a%20project";

/**
 * Tracked WhatsApp redirect — put this short link (websmith.ae/wa) in bios and
 * ads. Logs a whatsapp_click with the referrer preserved (so Instagram-sourced
 * taps are identifiable — add ?src=instagram where in-app browsers strip the
 * Referer header), then 302s straight to the chat. No visible page.
 */
export async function GET(req: Request) {
  await logServerEvent(req, "whatsapp_click", "/wa");
  return new Response(null, { status: 302, headers: { Location: DEST } });
}
