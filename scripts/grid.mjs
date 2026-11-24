// Contact sheet with a coordinate grid (in source-pixel units) to locate regions.
import sharp from 'sharp';
import fs from 'node:fs';
sharp.cache(false);
const [out, ...files] = process.argv.slice(2);
const W = 600;
const tiles = [];
let x = 0, H = 0;
for (const f of files) {
  const buf = fs.readFileSync(f);
  const m = await sharp(buf).metadata();
  const h = Math.round(W * m.height / m.width), k = m.width / W;
  let svg = `<svg width="${W}" height="${h + 20}"><rect y="${h}" width="${W}" height="20" fill="#fff"/><text x="4" y="${h + 15}" font-size="13" font-family="Arial">${f.split('/').pop()} ${m.width}x${m.height}</text>`;
  for (let gx = 0; gx < m.width; gx += 200) svg += `<line x1="${gx / k}" y1="0" x2="${gx / k}" y2="${h}" stroke="#0f0" stroke-width="0.6"/><text x="${gx / k + 2}" y="10" font-size="9" fill="#0f0">${gx}</text>`;
  for (let gy = 0; gy < m.height; gy += 200) svg += `<line x1="0" y1="${gy / k}" x2="${W}" y2="${gy / k}" stroke="#0f0" stroke-width="0.6"/><text x="2" y="${gy / k - 2}" font-size="9" fill="#0f0">${gy}</text>`;
  svg += '</svg>';
  const img = await sharp(buf).resize(W).png().toBuffer();
  tiles.push({ input: img, left: x, top: 0 }, { input: Buffer.from(svg), left: x, top: 0 });
  x += W + 10; H = Math.max(H, h + 20);
}
await sharp({ create: { width: x, height: H, channels: 3, background: '#333' } }).composite(tiles).jpeg({ quality: 80 }).toFile(out);
