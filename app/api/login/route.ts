import { adminToken, safeEqual } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/** Simple admin login: correct password → httpOnly session cookie (7 days). */
export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return Response.json({ ok: false, error: "ADMIN_PASSWORD is not set" }, { status: 500 });
  }
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!safeEqual(password, expected)) {
    return Response.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `ws_admin=${adminToken()}; Path=/; Max-Age=${7 * 86400}; HttpOnly; SameSite=Lax${secure}`,
    },
  });
}
