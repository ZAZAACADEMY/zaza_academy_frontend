/**
 * optimize-images.mjs
 * Lossless-quality compression of all static images in /public.
 *
 * PNGs  → re-encoded with maximum deflate effort (no pixel change).
 * JPEGs → mozjpeg at quality 85 (perceptually identical, ~40-60% smaller).
 * JFIFs/
 * Other JPEG variants → same treatment.
 * SVGs / GIFs / WebP → skipped (not handled by this script).
 *
 * Usage:  node scripts/optimize-images.mjs
 *         node scripts/optimize-images.mjs --dry-run   (report only, no writes)
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const DRY_RUN = process.argv.includes("--dry-run");

// ─── Config ──────────────────────────────────────────────────────────────────
const JPEG_QUALITY = 85; // 80-90 is perceptually lossless for most photos
const PNG_COMPRESSION = 9; // 0-9, deflate compression level (lossless)
const PNG_EFFORT = 10; // 1-10, zopfli-like effort (lossless, 10 = best)
const MIN_SAVING_BYTES = 1024; // Skip if saving < 1 KB (avoid re-writing tiny gains)

// ─── Helpers ─────────────────────────────────────────────────────────────────
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
}

function fmtKB(bytes) {
  return (bytes / 1024).toFixed(1) + " KB";
}

function fmtPct(before, after) {
  return (((before - after) / before) * 100).toFixed(1) + "%";
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const files = walk(PUBLIC_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;
let skipped = 0;
let optimized = 0;
let errors = 0;

console.log(`\n🖼  Optimizing ${files.length} images in /public…`);
if (DRY_RUN) console.log("   (dry-run mode — no files will be written)\n");
else console.log();

for (const filePath of files) {
  const ext = path.extname(filePath).toLowerCase();
  const relPath = path.relative(PUBLIC_DIR, filePath);
  const beforeSize = fs.statSync(filePath).size;

  try {
    // Read as buffer first — avoids libvips path-encoding issues on Windows
    const inputBuffer = fs.readFileSync(filePath);
    let pipeline = sharp(inputBuffer, { failOn: "none" });

    if (ext === ".png") {
      pipeline = pipeline.png({
        compressionLevel: PNG_COMPRESSION,
        effort: PNG_EFFORT,
        adaptiveFiltering: true,
      });
    } else {
      // .jpg / .jpeg
      pipeline = pipeline.jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true,
      });
    }

    const outputBuffer = await pipeline.toBuffer();
    const afterSize = outputBuffer.length;
    const saving = beforeSize - afterSize;

    totalBefore += beforeSize;

    if (saving < MIN_SAVING_BYTES) {
      // Already well-compressed or negligible gain
      totalAfter += beforeSize;
      console.log(
        `  ⏭  ${relPath.padEnd(55)} ${fmtKB(beforeSize).padStart(10)}  (no significant gain)`,
      );
      skipped++;
      continue;
    }

    totalAfter += afterSize;

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, outputBuffer);
    }

    const tag = DRY_RUN ? "🔍" : "✅";
    console.log(
      `  ${tag} ${relPath.padEnd(55)} ${fmtKB(beforeSize).padStart(10)} → ${fmtKB(afterSize).padStart(10)}  (−${fmtPct(beforeSize, afterSize)})`,
    );
    optimized++;
  } catch (err) {
    totalAfter += beforeSize;
    console.error(`  ❌ ${relPath}: ${err.message}`);
    errors++;
  }
}

const totalSaving = totalBefore - totalAfter;
console.log(
  "\n─────────────────────────────────────────────────────────────────────────",
);
console.log(`  Files processed : ${files.length}`);
console.log(`  Optimized       : ${optimized}`);
console.log(`  Skipped         : ${skipped}`);
if (errors > 0) console.log(`  Errors          : ${errors}`);
console.log(`  Total before    : ${fmtKB(totalBefore)}`);
console.log(`  Total after     : ${fmtKB(totalAfter)}`);
console.log(
  `  Total saved     : ${fmtKB(totalSaving)} (−${fmtPct(totalBefore, totalAfter)})`,
);
console.log(
  "─────────────────────────────────────────────────────────────────────────\n",
);
