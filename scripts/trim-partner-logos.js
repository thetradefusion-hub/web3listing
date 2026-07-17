const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "logos", "partners");

const targets = [
  "binance.png",
  "kucoin-wordmark.png",
  "bitmart.png",
  "lbank.png",
  "htx.png",
  "upbit.png",
  "phemex.png",
  "bingx.png",
  "xt.png",
  "coinbase.png",
  "coinmarketcap.png",
  "poloniex.png",
  "latoken.png",
  "kraken.png",
  "bitget.png",
];

async function run() {
  for (const file of targets) {
    const p = path.join(dir, file);
    if (!fs.existsSync(p)) {
      console.log("SKIP (missing)", file);
      continue;
    }
    const before = await sharp(p).metadata();
    const buf = await sharp(p).trim({ threshold: 12 }).toBuffer();
    const after = await sharp(buf).metadata();
    fs.writeFileSync(p, buf);
    console.log(
      `${file}: ${before.width}x${before.height} -> ${after.width}x${after.height}`
    );
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
