import { Archivo, Space_Mono } from "next/font/google";

/**
 * Archivo — variable font. We load the full weight range plus the `wdth`
 * (width) axis so `font-stretch:125%` in the ported CSS resolves to the
 * expanded weights the prototype uses.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/** Space Mono — used for all mono / label typography. */
export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});
