import fs from "node:fs";
import path from "node:path";

export interface WorkShot {
  /** true when a screenshot exists — otherwise the card uses the gradient fallback */
  has: boolean;
  /** public src of the screenshot */
  src: string;
  /** intrinsic pixel width (for next/image; prevents layout shift) */
  width: number;
  /** intrinsic pixel height */
  height: number;
}

const WORK_DIR = path.join(process.cwd(), "public", "work");
/** Extensions tried, in order of preference. */
const EXTENSIONS = ["png", "jpeg"] as const;
/** Fallback intrinsic size if a file's header can't be parsed. */
const DEFAULT_SIZE = { width: 1600, height: 1050 };

/**
 * Read a PNG/JPEG's intrinsic dimensions from its header — no dependencies.
 * Returns null if the format isn't recognised.
 */
function imageSize(file: string): { width: number; height: number } | null {
  const buf = fs.readFileSync(file);
  // PNG: signature then IHDR (width @16, height @20, big-endian)
  if (buf.length >= 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: scan segments for a Start-Of-Frame marker
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) {
        off++;
        continue;
      }
      const marker = buf[off + 1];
      // SOF0–SOF15 carry the frame dimensions, excluding DHT/DAC/RSTn markers
      const isSOF =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSOF) {
        return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
      }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
        off += 2; // standalone markers, no length
      } else {
        off += 2 + buf.readUInt16BE(off + 2); // skip this segment
      }
    }
  }
  return null;
}

/**
 * Resolve, at build/render time, a scene's screenshot in /public/work. For each
 * slug we try `${slug}-desktop.png` first, then `.jpeg`, and read its intrinsic
 * size so the card reserves the right space. A missing file falls back to the
 * gradient + wordmark treatment. Runs on the server — never bundled to the client.
 */
export function workShot(slug: string): WorkShot {
  for (const ext of EXTENSIONS) {
    const file = `${slug}-desktop.${ext}`;
    const abs = path.join(WORK_DIR, file);
    if (fs.existsSync(abs)) {
      const size = imageSize(abs) ?? DEFAULT_SIZE;
      return { has: true, src: `/work/${file}`, ...size };
    }
  }
  return { has: false, src: "", ...DEFAULT_SIZE };
}
