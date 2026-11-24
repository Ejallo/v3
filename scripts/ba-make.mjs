// Build aligned before/after pair (same canvas) from the two source shots.
import sharp from 'sharp';
const [before, after, outB, outA, s, dxr, dyr] = process.argv.slice(2);
const OW = 2000;
const mb = await sharp(before).metadata();
const OH = Math.round(OW * (mb.height / mb.width));
const scale = +s, dx = Math.round(+dxr * OW), dy = Math.round(+dyr * OH);
const w = Math.round(OW * scale), h = Math.round(OH * scale);
const A = await sharp(after).rotate().resize(w, h, { fit: 'fill' }).toBuffer();
const left = Math.round((OW - w) / 2) + dx, top = Math.round((OH - h) / 2) + dy;
const alignedA = await sharp({ create: { width: OW, height: OH, channels: 3, background: '#000' } })
  .composite([{ input: A, left, top }]).png().toBuffer();
// crop margins so the shifted edge never shows; keep a 4:5 frame around the car
const cw = Math.round(OW * 0.94), ch = Math.round(cw * 1.25);
const cx = Math.round((OW - cw) / 2), cy = Math.round(OH * 0.30);
const crop = { left: cx, top: cy, width: cw, height: Math.min(ch, OH - cy - Math.round(OH * 0.04)) };
await sharp(before).rotate().resize(OW, OH, { fit: 'fill' }).extract(crop).jpeg({ quality: 88 }).toFile(outB);
await sharp(alignedA).extract(crop).jpeg({ quality: 88 }).toFile(outA);
console.log(crop);
