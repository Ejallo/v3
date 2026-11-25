// Removes or thins the baked-in white before/after divider in hero-main.jpg.
// Usage: node scripts/hero-divider.mjs <in> <out> <lineWidthPx (0 = remove)>
import sharp from 'sharp';
const [, , inp, out, lw = '0'] = process.argv;
const L = 1268, R = 1293, MID = 1280; // divider band incl. antialiased edges
const { data, info } = await sharp(inp).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
for (let y = 0; y < H; y++) {
  for (let x = L; x <= R; x++) {
    // mirror neighbours: left half from the left, right half from the right
    const sx = x < MID ? L - 1 - (x - L) : R + 1 + (R - x);
    for (let c = 0; c < C; c++) data[(y * W + x) * C + c] = data[(y * W + sx) * C + c];
  }
  const w = Number(lw);
  if (w > 0) {
    const x0 = MID - Math.floor(w / 2);
    for (let x = x0; x < x0 + w; x++)
      for (let c = 0; c < 3; c++) {
        const i = (y * W + x) * C + c;
        data[i] = Math.round(data[i] * 0.15 + 255 * 0.85);
      }
  }
}
await sharp(data, { raw: { width: W, height: H, channels: C } }).jpeg({ quality: 92, mozjpeg: true }).toFile(out);
