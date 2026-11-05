// Regenerates all PWA icons from the master logo.
// Usage: node scripts/generate-icons.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = path.join(root, 'public', 'icons');
const master = path.join(root, 'assets', 'logo-1024.png');

// Logo ring sits inside the 80% maskable safe zone, so the same artwork
// works for both "any" and "maskable" icons.
const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const maskableSizes = [192, 512];

const render = (size, file) =>
  sharp(master)
    .resize(size, size, { kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, file))
    .then(() => console.log(`✓ ${file}`));

await Promise.all([
  ...sizes.map((s) => render(s, `icon-${s}x${s}.png`)),
  ...maskableSizes.map((s) => render(s, `icon-maskable-${s}x${s}.png`)),
]);

console.log('Done. badge-96.png is maintained separately (monochrome).');
