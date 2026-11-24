// Downscale source photos in src/assets/photos to a sane master size (in place).
import sharp from 'sharp';
import fs from 'node:fs';
sharp.cache(false);
const dir = 'src/assets/photos';
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.jpg'))) {
  const p = `${dir}/${f}`;
  const buf = await sharp(fs.readFileSync(p)).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  fs.writeFileSync(p, buf);
  console.log(f, Math.round(buf.length / 1024) + ' KB');
}
