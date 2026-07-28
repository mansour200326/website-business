import { Instrument_Serif, Manrope } from "next/font/google";

/**
 * Instrument Serif (regular, 400) — the display/brand serif: the "Websmith."
 * wordmark, oversized project names, and the ghost watermark. Preloaded (it is
 * used above the fold in the hero).
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
  variable: "--font-serif",
});

/** Manrope — all UI text (nav, body, buttons, labels, headlines). Variable. */
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
