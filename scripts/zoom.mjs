// Zoom into a region with a fine coordinate grid (source px) to place exact polygons.
import sharp from 'sharp';
import fs from 'node:fs';
sharp.cache(false);
const [file, out, x, y, w, h, step = '20'] = process.argv.slice(2);
const [X, Y, Wd, Hd, st] = [x, y, w, h, step].map(Number);
const OW = 900, k = OW / Wd, OH = Math.round(Hd * k);
const img = await sharp(fs.readFileSync(file)).extract({ left: X, top: Y, width: Wd, height: Hd }).resize(OW, OH).png().toBuffer();
let svg = `<svg width="${OW}" height="${OH}">`;
for (let gx = Math.ceil(X / st) * st; gx < X + Wd; gx += st) { const p = (gx - X) * k; const major = gx % (st * 5) === 0; svg += `<line x1="${p}" y1="0" x2="${p}" y2="${OH}" stroke="${major ? '#0f0' : '#0a0'}" stroke-width="${major ? 1 : 0.4}"/>` + (major ? `<text x="${p + 2}" y="11" font-size="11" fill="#0f0">${gx}</text>` : ''); }
for (let gy = Math.ceil(Y / st) * st; gy < Y + Hd; gy += st) { const p = (gy - Y) * k; const major = gy % (st * 5) === 0; svg += `<line x1="0" y1="${p}" x2="${OW}" y2="${p}" stroke="${major ? '#0f0' : '#0a0'}" stroke-width="${major ? 1 : 0.4}"/>` + (major ? `<text x="2" y="${p - 2}" font-size="11" fill="#0f0">${gy}</text>` : ''); }
svg += '</svg>';
await sharp(img).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 85 }).toFile(out);
