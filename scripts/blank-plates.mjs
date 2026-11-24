// Paint the white field of each licence plate with its own plate colour (blue EU band stays).
// Polygons are in source pixels of the 2400px masters in src/assets/photos.
import sharp from 'sharp';
import fs from 'node:fs';
sharp.cache(false);
const dir = 'src/assets/photos';
const PLATES = {
  'hero-m3-studio.jpg': [[1088, 1469], [1314, 1440], [1308, 1497], [1086, 1530]],
  'm3-doorway.jpg': [[1246, 1318], [1290, 1297], [1285, 1328], [1243, 1349]],
  'wash-pressure.jpg': [[727, 1589], [1011, 1540], [1004, 1644], [720, 1680]],
  'grille-detail.jpg': [[79, 1291], [992, 1215], [986, 1431], [82, 1472]],
  'wheel-detail.jpg': [[740, 1380], [1166, 1383], [1169, 1494], [740, 1449]],
  'headlight-foam.jpg': [[1468, 1713], [1600, 1742], [1600, 1950], [1468, 1905]],
  'ba-before-al.jpg': [[762, 865], [1151, 862], [1151, 944], [762, 948]],
  'ba-after-al.jpg': [[755, 867], [1148, 866], [1148, 948], [755, 950]],
  // split before/after shot: two halves either side of the white divider
  'hero-main.jpg': [[[1043, 954], [1270, 954], [1270, 1070], [1043, 1070]], [[1289, 950], [1580, 950], [1580, 1072], [1289, 1072]]],
};
const inside = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
// Usage: node scripts/blank-plates.mjs [file ...]  (no args = all files)
const only = process.argv.slice(2);
for (const [file, entry] of Object.entries(PLATES)) {
  if (only.length && !only.includes(file)) continue;
  for (const poly of Array.isArray(entry[0][0]) ? entry : [entry]) await blank(file, poly);
}
async function blank(file, poly) {
  const path = `${dir}/${file}`;
  const src = fs.readFileSync(path);
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const px = [];
  for (let y = Math.min(...ys); y <= Math.max(...ys); y++) for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
    if (!inside(x, y, poly)) continue;
    const i = (y * info.width + x) * info.channels;
    px.push([data[i], data[i + 1], data[i + 2]]);
  }
  px.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  const bright = px.slice(Math.floor(px.length * 0.55), Math.floor(px.length * 0.95));
  const avg = [0, 1, 2].map((c) => Math.round(bright.reduce((s, p) => s + p[c], 0) / bright.length));
  const pts = poly.map((p) => p.join(',')).join(' ');
  const mask = await sharp(Buffer.from(`<svg width="${info.width}" height="${info.height}"><polygon points="${pts}" fill="#fff"/></svg>`)).blur(1.2).greyscale().raw().toBuffer();
  const color = await sharp({ create: { width: info.width, height: info.height, channels: 3, background: { r: avg[0], g: avg[1], b: avg[2] } } }).raw().toBuffer();
  const overlay = await sharp(color, { raw: { width: info.width, height: info.height, channels: 3 } }).joinChannel(mask, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  const out = await sharp(src).composite([{ input: overlay }]).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  fs.writeFileSync(path, out);
  console.log(file, 'rgb', avg.join(','));
}
