"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * First-party, cookie-free beacon. Renders nothing; after mount it reports a
 * pageview and delegates one click listener for WhatsApp / phone / portfolio
 * links. navigator.sendBeacon is fire-and-forget (queued by the browser, never
 * blocks paint, survives navigation), so this has zero performance impact.
 *
 * Never tracks /dashboard, and never tracks a browser that has visited it
 * (the ws_exclude cookie — the server drops those events too).
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;
    if (document.cookie.includes("ws_exclude=1")) return;
    if (!("sendBeacon" in navigator)) return;

    const send = (type: string, path: string, referrer = "") => {
      try {
        navigator.sendBeacon(
          "/api/track",
          new Blob([JSON.stringify({ type, path, referrer })], { type: "application/json" })
        );
      } catch {
        // fire-and-forget
      }
    };

    send("pageview", pathname, document.referrer);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      // Clicks carry the landing referrer too, so taps stay attributable to
      // their source (Instagram, Google, …) in the dashboard's Sources card.
      const ref = document.referrer;
      if (href.startsWith("tel:")) send("tel_click", pathname, ref);
      else if (href.includes("wa.me/")) send("whatsapp_click", pathname, ref);
      else if (a.classList.contains("pf-live")) send("portfolio_click", href, ref);
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}
