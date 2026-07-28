import fs from "node:fs";
import path from "node:path";

export interface PortfolioImage {
  slug: string;
  /** true when a real screenshot/placeholder file exists */
  has: boolean;
  src: string;
  width: number;
  height: number;
}

const DIR = path.join(process.cwd(), "public", "portfolio");
const EXTENSIONS = ["webp", "jpg", "jpeg", "png"] as const;
const DEFAULT = { width: 1600, height: 2000 };

/** Read PNG/JPEG/WebP intrinsic dimensions from the file header — no dependencies. */
function imageSize(file: string): { width: number; height: number } | null {
  const buf = fs.readFileSync(file);
  if (buf.length >= 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // WebP (RIFF): the 4-byte chunk fourcc at offset 12 selects the format.
  if (buf.length >= 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const fourcc = buf.toString("ascii", 12, 16);
    if (fourcc === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (fourcc === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (fourcc === "VP8X") {
      const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { width: w, height: h };
    }
  }
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off++; continue; }
      const m = buf[off + 1];
      const isSOF = m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc;
      if (isSOF) return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
      if (m === 0xd8 || m === 0xd9 || (m >= 0xd0 && m <= 0xd7)) off += 2;
      else off += 2 + buf.readUInt16BE(off + 2);
    }
  }
  return null;
}

/** Resolve a project's screenshot (webp → jpg → jpeg → png) with intrinsic size. */
export function portfolioImage(slug: string): PortfolioImage {
  for (const ext of EXTENSIONS) {
    const file = `${slug}.${ext}`;
    const abs = path.join(DIR, file);
    if (fs.existsSync(abs)) {
      const size = imageSize(abs) ?? DEFAULT;
      return { slug, has: true, src: `/portfolio/${file}`, ...size };
    }
  }
  return { slug, has: false, src: "", ...DEFAULT };
}
