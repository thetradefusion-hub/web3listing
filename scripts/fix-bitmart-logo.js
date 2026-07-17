const sharp = require("sharp");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "logos", "partners");
const src = path.join(dir, "bitmart.png");
const out = path.join(dir, "bitmart.png");

async function run() {
  const meta = await sharp(src).metadata();
  // Icon occupies roughly the top ~62% of the stacked lockup; crop and trim it out.
  const iconRaw = await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.66) })
    .trim({ threshold: 12 })
    .toBuffer();
  const iconMeta = await sharp(iconRaw).metadata();

  const iconTargetH = 200;
  const iconTargetW = Math.round((iconMeta.width / iconMeta.height) * iconTargetH);
  const iconResized = await sharp(iconRaw).resize({ height: iconTargetH, width: iconTargetW }).toBuffer();

  const gap = 22;
  const textSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="620" height="${iconTargetH}">
      <text x="0" y="${iconTargetH / 2 + 62}" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="700" letter-spacing="2" fill="#1BADA6">BitMart</text>
    </svg>`;
  const textBuf = Buffer.from(textSvg);
  const textPng = await sharp(textBuf).png().toBuffer();
  const textMeta = await sharp(textPng).metadata();
  const textTrimmed = await sharp(textPng).trim({ threshold: 12 }).toBuffer();
  const textTrimmedMeta = await sharp(textTrimmed).metadata();

  const canvasW = iconTargetW + gap + textTrimmedMeta.width;
  const canvasH = Math.max(iconTargetH, textTrimmedMeta.height);

  const composed = await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: iconResized, left: 0, top: Math.round((canvasH - iconTargetH) / 2) },
      { input: textTrimmed, left: iconTargetW + gap, top: Math.round((canvasH - textTrimmedMeta.height) / 2) },
    ])
    .png()
    .toBuffer();

  const final = await sharp(composed).trim({ threshold: 4 }).toBuffer();
  await sharp(final).toFile(out + ".tmp.png");
  const fs = require("fs");
  fs.renameSync(out + ".tmp.png", out);
  const finalMeta = await sharp(out).metadata();
  console.log("bitmart.png ->", finalMeta.width, "x", finalMeta.height);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
