const fs = require("fs");
const path = require("path");

const catalog = [
  {
    cat: "listing-services",
    items: [
      "Binance Ecosystem Support",
      "Bitget Listing Support",
      "MEXC Listing Support",
      "Gate Listing Support",
      "KuCoin Listing Support",
      "BitMart Listing Support",
      "Coinstore Listing Support",
      "LATOKEN Listing Support",
      "XT Listing Support",
      "LBank Listing Support",
      "CoinMarketCap Support",
      "CoinGecko Support",
      "DEXTools Update",
      "DEXScreener Update",
      "GeckoTerminal Update",
      "CoinPaprika Update",
      "CoinCodex Update",
    ],
  },
  {
    cat: "explorer-services",
    items: [
      "Explorer Update",
      "BSCScan Logo Update",
      "Etherscan Logo Update",
      "PolygonScan Update",
      "Arbiscan Update",
      "Basescan Update",
      "Contract Verification",
      "Token Information Update",
      "Social Link Update",
      "Website Update",
    ],
  },
  {
    cat: "wallet-listing",
    items: [
      "Trust Wallet Asset Support",
      "SafePal Asset Support",
      "TokenPocket Support",
      "OKX Wallet Support",
      "Bitget Wallet Support",
      "Gate Wallet Support",
      "MetaMask Integration",
      "Coinbase Wallet Integration",
    ],
  },
  {
    cat: "market-making",
    items: [
      "MM Bot Setup",
      "CEX Market Making",
      "DEX Market Making",
      "Liquidity Management",
      "Volume Strategy",
      "Starter MM",
      "Growth MM",
      "Premium MM",
    ],
  },
  {
    cat: "token-security",
    items: [
      "Smart Contract Audit Coordination",
      "Contract Review",
      "Security Analysis",
      "Third-Party Audit Coordination",
      "Bug Finding",
      "Security Reports",
    ],
  },
  {
    cat: "liquidity-lock",
    items: [
      "Liquidity Lock",
      "LP Lock",
      "Team Token Lock",
      "Vesting Setup",
      "Treasury Lock",
      "PancakeSwap Setup",
      "Uniswap Setup",
      "Raydium Setup",
    ],
  },
  {
    cat: "pr-distribution",
    items: [
      "Basic PR Package",
      "Premium PR Package",
      "Enterprise PR Package",
      "Crypto News Distribution",
      "Regional Publications",
      "Sponsored Articles",
    ],
  },
  {
    cat: "influencer-marketing",
    items: [
      "Twitter KOL",
      "Telegram KOL",
      "YouTube KOL",
      "TikTok KOL",
      "AMA Campaign",
      "Space Campaign",
      "Influencer Threads",
    ],
  },
  {
    cat: "community-management",
    items: [
      "Telegram Moderator",
      "Telegram Manager",
      "Discord Moderator",
      "Discord Manager",
      "Community Building",
      "Engagement Campaign",
      "Shiller Team",
    ],
  },
  {
    cat: "trending-services",
    items: ["DEXTools Trending", "DEXScreener Boost", "Social Trend Campaigns"],
  },
  {
    cat: "ai-services",
    items: [
      "AI Telegram Bot",
      "AI Customer Support Bot",
      "AI Knowledge Base Bot",
      "AI Trading Assistant",
      "AI Community Assistant",
    ],
  },
  {
    cat: "development-services",
    items: [
      "BEP20 Token",
      "ERC20 Token",
      "Solana Token",
      "Staking Platform",
      "Presale Dashboard",
      "Launchpad Development",
      "Landing Page Development",
    ],
  },
  {
    cat: "premium-advisory",
    items: [
      "Tokenomics Review",
      "Exchange Readiness Review",
      "Fundraising Preparation",
      "Investor Pitch Review",
    ],
  },
];

/** Per-slug pricing: fixed | quote | enterprise */
const SERVICE_PRICING = {
  // Model 1 — Fixed Price (self-service)
  "bscscan-logo-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "etherscan-logo-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "polygonscan-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "arbiscan-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "basescan-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "explorer-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "contract-verification": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "token-information-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "social-link-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "website-update": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "dextools-update": { pm: "fixed", price: 99, comm: 12, tat: "2-3 Days" },
  "dexscreener-update": { pm: "fixed", price: 99, comm: 12, tat: "2-3 Days" },
  "geckoterminal-update": { pm: "fixed", price: 99, comm: 12, tat: "2-3 Days" },
  "coinpaprika-update": { pm: "fixed", price: 99, comm: 12, tat: "2-3 Days" },
  "coincodex-update": { pm: "fixed", price: 99, comm: 12, tat: "2-3 Days" },
  "liquidity-lock": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "lp-lock": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "team-token-lock": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "vesting-setup": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "treasury-lock": { pm: "fixed", price: 99, comm: 10, tat: "1-2 Days" },
  "pancakeswap-setup": { pm: "fixed", price: 149, comm: 12, tat: "2-3 Days" },
  "uniswap-setup": { pm: "fixed", price: 149, comm: 12, tat: "2-3 Days" },
  "raydium-setup": { pm: "fixed", price: 149, comm: 12, tat: "2-3 Days" },
  "ai-telegram-bot": { pm: "fixed", price: 299, comm: 15, tat: "3-5 Days" },
  "ai-customer-support-bot": { pm: "fixed", price: 299, comm: 15, tat: "3-5 Days" },
  "ai-knowledge-base-bot": { pm: "fixed", price: 299, comm: 15, tat: "3-5 Days" },
  "ai-trading-assistant": { pm: "fixed", price: 299, comm: 15, tat: "3-5 Days" },
  "ai-community-assistant": { pm: "fixed", price: 299, comm: 15, tat: "3-5 Days" },

  // Model 2 — Quote Based (managed service)
  "mexc-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "bitmart-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "gate-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "kucoin-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "bitget-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "coinstore-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "latoken-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "xt-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "lbank-listing-support": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "contract-review": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "security-analysis": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "bug-finding": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "security-reports": { pm: "quote", comm: 15, tat: "Depends on Scope" },
  "mm-bot-setup": { pm: "quote", comm: 25, tat: "Depends on Scope" },
  "cex-market-making": { pm: "quote", comm: 25, tat: "Depends on Scope" },
  "dex-market-making": { pm: "quote", comm: 25, tat: "Depends on Scope" },
  "liquidity-management": { pm: "quote", comm: 25, tat: "Monthly" },
  "volume-strategy": { pm: "quote", comm: 25, tat: "Depends on Scope" },
  "starter-mm": { pm: "quote", comm: 25, tat: "Monthly" },
  "growth-mm": { pm: "quote", comm: 25, tat: "Monthly" },
  "premium-mm": { pm: "quote", comm: 25, tat: "Monthly" },
  "basic-pr-package": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "premium-pr-package": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "enterprise-pr-package": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "crypto-news-distribution": { pm: "quote", comm: 20, tat: "3-7 Days" },
  "twitter-kol": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "telegram-kol": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "youtube-kol": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "tiktok-kol": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "ama-campaign": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "space-campaign": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "influencer-threads": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "telegram-moderator": { pm: "quote", comm: 20, tat: "Monthly" },
  "telegram-manager": { pm: "quote", comm: 20, tat: "Monthly" },
  "discord-moderator": { pm: "quote", comm: 20, tat: "Monthly" },
  "discord-manager": { pm: "quote", comm: 20, tat: "Monthly" },
  "community-building": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "engagement-campaign": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "shiller-team": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "dextools-trending": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "dexscreener-boost": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "social-trend-campaigns": { pm: "quote", comm: 20, tat: "Depends on Scope" },
  "bep20-token": { pm: "quote", comm: 20, tat: "5-10 Days" },
  "erc20-token": { pm: "quote", comm: 20, tat: "5-10 Days" },
  "solana-token": { pm: "quote", comm: 20, tat: "5-10 Days" },
  "staking-platform": { pm: "quote", comm: 20, tat: "5-10 Days" },
  "presale-dashboard": { pm: "quote", comm: 20, tat: "5-10 Days" },
  "launchpad-development": { pm: "quote", comm: 20, tat: "5-10 Days" },
  "landing-page-development": { pm: "quote", comm: 20, tat: "5-10 Days" },
  "tokenomics-review": { pm: "quote", comm: 15, tat: "3-5 Days" },

  // Model 3 — Enterprise / Third Party Approval
  "binance-ecosystem-support": { pm: "enterprise", fee: 299, comm: 15, tat: "Depends on Third Party" },
  "coinmarketcap-support": { pm: "enterprise", fee: 299, comm: 15, tat: "Depends on Third Party" },
  "coingecko-support": { pm: "enterprise", fee: 199, comm: 12, tat: "Depends on Third Party" },
  "trust-wallet-asset-support": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "safepal-asset-support": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "tokenpocket-support": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "okx-wallet-support": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "bitget-wallet-support": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "gate-wallet-support": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "metamask-integration": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "coinbase-wallet-integration": { pm: "enterprise", fee: 149, comm: 15, tat: "Depends on Third Party" },
  "smart-contract-audit-coordination": { pm: "enterprise", fee: 299, comm: 15, tat: "Depends on Third Party" },
  "third-party-audit-coordination": { pm: "enterprise", fee: 299, comm: 15, tat: "Depends on Third Party" },
  "regional-publications": { pm: "enterprise", fee: 299, comm: 20, tat: "Depends on Third Party" },
  "sponsored-articles": { pm: "enterprise", fee: 299, comm: 20, tat: "Depends on Third Party" },
  "exchange-readiness-review": { pm: "enterprise", fee: 299, comm: 15, tat: "Depends on Third Party" },
  "fundraising-preparation": { pm: "enterprise", fee: 399, comm: 15, tat: "Depends on Third Party" },
  "investor-pitch-review": { pm: "enterprise", fee: 299, comm: 15, tat: "Depends on Third Party" },
};

function slugify(n) {
  return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function esc(s) {
  return s.replace(/'/g, "''");
}

function resolvePricing(slug, name) {
  if (SERVICE_PRICING[slug]) {
    const p = SERVICE_PRICING[slug];
    const isEnterprise = p.pm === "enterprise";
    const isQuote = p.pm === "quote";
    return {
      pm: p.pm,
      price: p.price ?? null,
      fee: p.fee ?? null,
      comm: p.comm,
      tat: p.tat,
      ack: isEnterprise,
      thirdPartyNote: isEnterprise ? "As Per Provider" : null,
      terms: isQuote && p.tat === "Monthly" ? "Milestone" : "100% Advance",
    };
  }
  throw new Error(`Missing pricing for slug: ${slug} (${name})`);
}

let sort = 0;
const rows = [];
for (const g of catalog) {
  for (const name of g.items) {
    sort++;
    const slug = slugify(name);
    const t = resolvePricing(slug, name);
    const desc = esc(
      `${name} for Web3 projects. Partner-fulfilled service with ${t.tat} delivery. Transparent pricing model and partner commission.`
    );
    const price = t.price === null ? "NULL" : t.price;
    const fee = t.fee === null ? "NULL" : t.fee;
    const tpNote = t.thirdPartyNote ? `'${t.thirdPartyNote}'` : "NULL";
    rows.push(
      `  ('${g.cat}', '${esc(name)}', '${slug}', '${desc}', '${t.pm}', ${price}, ${fee}, 'percentage', ${t.comm}, '${t.tat}', '${t.terms}', ${t.ack}, ${tpNote}, ${sort})`
    );
  }
}

const sql = `-- Auto-generated service catalog (${rows.length} services)
-- Pricing models: fixed (self-service) | quote (managed) | enterprise (third-party approval)

INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES
('Listing Services', 'listing-services', 'Exchange and data platform listing support — core revenue', 'building-2', 1),
('Explorer Services', 'explorer-services', 'Blockchain explorer updates and verification', 'search', 2),
('Wallet Listing Services', 'wallet-listing', 'Wallet ecosystem integration support', 'wallet', 3),
('Market Making', 'market-making', 'MM bot setup, liquidity and recurring monthly packages', 'trending-up', 4),
('Token Security', 'token-security', 'Smart contract audit coordination and security analysis', 'shield', 5),
('Liquidity & Lock Services', 'liquidity-lock', 'LP lock, vesting and DEX launch setup', 'lock', 6),
('PR Distribution', 'pr-distribution', 'Crypto media and press distribution packages', 'newspaper', 7),
('Influencer Marketing', 'influencer-marketing', 'KOL and influencer campaigns', 'users', 8),
('Community Management', 'community-management', 'Telegram and Discord management — recurring revenue', 'message-circle', 9),
('Trending Services', 'trending-services', 'Legitimate visibility and trending campaigns', 'zap', 10),
('AI Services', 'ai-services', 'AI bots and automation — platform differentiator', 'bot', 11),
('Development Services', 'development-services', 'Token and platform development', 'code', 12),
('Premium Advisory', 'premium-advisory', 'Consulting and exchange readiness advisory', 'briefcase', 13)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

UPDATE services SET is_active = false;

INSERT INTO services (
  category_id, name, slug, description, pricing_model, price, service_fee,
  commission_type, commission_value, estimated_tat, payment_terms,
  requires_third_party_ack, third_party_fee_note, sort_order, is_active
)
SELECT
  c.id, s.name, s.slug, s.description, s.pricing_model::pricing_model, s.price, s.service_fee,
  s.commission_type::commission_type, s.commission_value, s.tat, s.terms,
  s.ack, s.third_party_note, s.sort, true
FROM (VALUES
${rows.join(",\n")}
) AS s(cat_slug, name, slug, description, pricing_model, price, service_fee, commission_type, commission_value, tat, terms, ack, third_party_note, sort)
JOIN service_categories c ON c.slug = s.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pricing_model = EXCLUDED.pricing_model,
  price = EXCLUDED.price,
  service_fee = EXCLUDED.service_fee,
  commission_type = EXCLUDED.commission_type,
  commission_value = EXCLUDED.commission_value,
  estimated_tat = EXCLUDED.estimated_tat,
  payment_terms = EXCLUDED.payment_terms,
  requires_third_party_ack = EXCLUDED.requires_third_party_ack,
  third_party_fee_note = EXCLUDED.third_party_fee_note,
  sort_order = EXCLUDED.sort_order,
  is_active = true;
`;

const out = path.join(__dirname, "..", "supabase", "migrations", "002_services_catalog.sql");
fs.writeFileSync(out, sql);
console.log(`Wrote ${rows.length} services to ${out}`);
