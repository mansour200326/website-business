import { Archivo, Space_Mono } from "next/font/google";

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
