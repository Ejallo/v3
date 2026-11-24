import sharp from 'sharp';
const [a, b, out] = process.argv.slice(2);
const W = 700, H = 1050;
const A = await sharp(a).rotate().resize(W, H, { fit: 'cover' }).toBuffer();
const B = await sharp(b).rotate().resize(W, H, { fit: 'cover' }).extract({ left: W / 2, top: 0, width: W / 2, height: H }).toBuffer();
await sharp(A).composite([{ input: B, left: W / 2, top: 0 }]).jpeg({ quality: 75 }).toFile(out);
