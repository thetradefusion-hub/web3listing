/** Same-size local wordmark logos (icon mark + brand name), sourced from official brand assets. */
export const PARTNER_LOCAL_LOGOS: Record<string, string> = {
  OKX: "/logos/partners/okx.svg",
  HTX: "/logos/partners/htx.png",
  Binance: "/logos/partners/binance.png",
  KuCoin: "/logos/partners/kucoin-wordmark.png",
  Upbit: "/logos/partners/upbit.png",
  "Gate.io": "/logos/partners/gate-io.svg",
  MEXC: "/logos/partners/mexc.svg",
  Bitget: "/logos/partners/bitget.png",
  LBank: "/logos/partners/lbank.png",
  BitMart: "/logos/partners/bitmart.png",
  Phemex: "/logos/partners/phemex.png",
  Coinstore: "/logos/partners/coinstore.png",
  BingX: "/logos/partners/bingx.png",
  XT: "/logos/partners/xt.png",
  Coinbase: "/logos/partners/coinbase.png",
  CoinMarketCap: "/logos/partners/coinmarketcap.png",
  Poloniex: "/logos/partners/poloniex.png",
  LATOKEN: "/logos/partners/latoken.png",
  Kraken: "/logos/partners/kraken.png",
};

export function getPartnerLocalLogo(name: string) {
  return PARTNER_LOCAL_LOGOS[name] ?? null;
}
