import fs from "node:fs";
import path from "node:path";

export interface WorkShots {
  /** true when the desktop screenshot exists — otherwise the scene falls back to the gradient frame */
  hasDesktop: boolean;
  /** true when the mobile screenshot exists — the floating phone is only rendered when true */
  hasMobile: boolean;
  desktopSrc: string;
  mobileSrc: string;
}

const WORK_DIR = path.join(process.cwd(), "public", "work");

/** Extensions tried, in order of preference. */
const EXTENSIONS = ["png", "jpeg"] as const;

/**
 * Find the first existing file for `${name}.<ext>`, trying each extension in
 * order. Returns its public src, or null if none exist.
 */
function resolveShot(name: string): string | null {
  for (const ext of EXTENSIONS) {
    const file = `${name}.${ext}`;
    if (fs.existsSync(path.join(WORK_DIR, file))) {
      return `/work/${file}`;
    }
  }
  return null;
}

/**
 * Resolve, at build/render time, whether a scene's screenshots are present in
 * /public/work. For each image we try .png first, then .jpeg. Missing files
 * fall back to the gradient frame for that scene only (requirement 5). Runs on
 * the server — never bundled to the client.
 */
export function workShots(slug: string): WorkShots {
  const desktop = resolveShot(`${slug}-desktop`);
  const mobile = resolveShot(`${slug}-mobile`);
  return {
    hasDesktop: desktop !== null,
    hasMobile: mobile !== null,
    desktopSrc: desktop ?? "",
    mobileSrc: mobile ?? "",
  };
}
