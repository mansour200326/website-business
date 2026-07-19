import fs from "node:fs";
import path from "node:path";

export interface WorkShot {
  /** true when a screenshot exists — otherwise the card uses the gradient fallback */
  has: boolean;
  /** public src of the screenshot */
  src: string;
}

const WORK_DIR = path.join(process.cwd(), "public", "work");
/** Extensions tried, in order of preference. */
const EXTENSIONS = ["png", "jpeg"] as const;

/**
 * Resolve, at build/render time, a scene's screenshot in /public/work. For
 * each slug we try `${slug}-desktop.png` first, then `.jpeg`. A missing file
 * falls back to the gradient + wordmark treatment for that card only. Runs on
 * the server — never bundled to the client.
 */
export function workShot(slug: string): WorkShot {
  for (const ext of EXTENSIONS) {
    const file = `${slug}-desktop.${ext}`;
    if (fs.existsSync(path.join(WORK_DIR, file))) {
      return { has: true, src: `/work/${file}` };
    }
  }
  return { has: false, src: "" };
}
