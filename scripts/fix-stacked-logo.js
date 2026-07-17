const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const dir = path.join(__dirname, "..", "public", "logos", "partners");

const jobs = [
  {
    file: "kraken.png",
    iconHeightFraction: 0.74,
    text: "kraken",
    color: "#5741D9",
    fontWeight: 600,
  },
];

async function run() {
  for (const job of jobs) {
    const src = path.join(dir, job.file);
    const meta = await sharp(src).metadata();

    const iconCropped = await sharp(src)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * job.iconHeightFraction) })
      .toBuffer();
    const iconRaw = await sharp(iconCropped).trim({ threshold: 12 }).toBuffer();
    const iconMeta = await sharp(iconRaw).metadata();

    const iconTargetH = 200;
    const iconTargetW = Math.round((iconMeta.width / iconMeta.height) * iconTargetH);
    const iconResized = await sharp(iconRaw).resize({ height: iconTargetH, width: iconTargetW }).toBuffer();

    const gap = 18;
    const textSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="700" height="${iconTargetH}">
        <text x="0" y="${iconTargetH / 2 + 60}" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="${job.fontWeight}" fill="${job.color}">${job.text}</text>
      </svg>`;
    const textPng = await sharp(Buffer.from(textSvg)).png().toBuffer();
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
    const tmp = src + ".tmp.png";
    await sharp(final).toFile(tmp);
    fs.renameSync(tmp, src);
    const finalMeta = await sharp(src).metadata();
    console.log(`${job.file} -> ${finalMeta.width}x${finalMeta.height}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
