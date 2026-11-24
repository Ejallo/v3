// Brute-force scale/offset that best lines up the "after" shot with the "before" shot.
import sharp from 'sharp';
const [before, after] = process.argv.slice(2);
const W = 180, H = 270;
const gray = async (f, w, h) => (await sharp(f).rotate().resize(w, h, { fit: 'fill' }).greyscale().raw().toBuffer());
const B = await gray(before, W, H);
const metaA = await sharp(after).metadata();
let best = { err: Infinity };
for (let s = 0.88; s <= 1.06; s += 0.01) {
  const w = Math.round(W * s), h = Math.round(H * s);
  const A = await gray(after, w, h);
  for (let dx = -20; dx <= 20; dx++) for (let dy = -30; dy <= 30; dy++) {
    let err = 0, n = 0;
    // compare central band (car + near background), rows 35%..80%
    for (let y = Math.round(H * 0.35); y < H * 0.8; y += 2) {
      const ay = y - dy - Math.round((H - h) / 2);
      if (ay < 0 || ay >= h) continue;
      for (let x = Math.round(W * 0.1); x < W * 0.9; x += 2) {
        const ax = x - dx - Math.round((W - w) / 2);
        if (ax < 0 || ax >= w) continue;
        err += Math.abs(B[y * W + x] - A[ay * w + ax]); n++;
      }
    }
    if (n > 1500 && err / n < best.err) best = { err: err / n, s: +s.toFixed(2), dx, dy };
  }
}
console.log(JSON.stringify(best), metaA.width, metaA.height);
