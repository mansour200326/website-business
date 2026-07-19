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

/**
 * Resolve, at build/render time, whether a scene's screenshots are present in
 * /public/work. Missing files fall back to the gradient frame for that scene
 * only (requirement 5). Runs on the server — never bundled to the client.
 */
export function workShots(slug: string): WorkShots {
  const desktopFile = `${slug}-desktop.png`;
  const mobileFile = `${slug}-mobile.png`;
  return {
    hasDesktop: fs.existsSync(path.join(WORK_DIR, desktopFile)),
    hasMobile: fs.existsSync(path.join(WORK_DIR, mobileFile)),
    desktopSrc: `/work/${desktopFile}`,
    mobileSrc: `/work/${mobileFile}`,
  };
}
