import { Archivo, Space_Mono, Instrument_Serif, Manrope } from "next/font/google";

/**
 * Archivo — variable font at normal width. Used for headings and body at
 * weights 500–600 (sentence case). The width axis is intentionally not loaded;
 * the design uses normal-width Archivo only.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

/** Space Mono — reserved for tiny labels and index numbers (weight 400 only). */
export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-space-mono",
});

/**
 * Instrument Serif (italic, 400) and Manrope (medium, 500) — used ONLY for the
 * "Atelier Digital" logotype (and the favicon). Not for body or headings.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-manrope",
});
