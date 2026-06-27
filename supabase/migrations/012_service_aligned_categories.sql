-- Replace legacy service_categories with 9 categories aligned to core services (1 category per service).

INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES
(
  'CEX Exchange Listing Services',
  'cex-exchange-listing-services',
  'Centralized exchange listing support for Web3 tokens',
  'building-2',
  1,
  true
),
(
  'Web3 Wallet Listing Services',
  'web3-wallet-listing-services',
  'Wallet ecosystem integration and asset listing',
  'wallet',
  2,
  true
),
(
  'Market Making (MM) Bot Services',
  'market-making-mm-bot-services',
  'Market making bot deployment for CEX and DEX pairs',
  'trending-up',
  3,
  true
),
(
  'Top DEX Exchange Listing Services',
  'top-dex-exchange-listing-services',
  'DEX launch and listing on decentralized exchanges',
  'layers',
  4,
  true
),
(
  'Top DEX Crypto Website Listing Services',
  'top-dex-crypto-website-listing-services',
  'Crypto discovery websites and DEX aggregator listings',
  'globe',
  5,
  true
),
(
  'Smart Contract Audit Services',
  'smart-contract-audit-services',
  'Smart contract security audit and vulnerability assessment',
  'shield',
  6,
  true
),
(
  'CoinMarketCap & CoinGecko Listing Services',
  'coinmarketcap-coingecko-listing-services',
  'CoinMarketCap and CoinGecko data platform listings',
  'bar-chart-3',
  7,
  true
),
(
  'Influencer Marketing Services',
  'influencer-marketing-services',
  'Crypto influencer and KOL marketing campaigns',
  'users',
  8,
  true
),
(
  'Top Crypto Platforms Advertising Services',
  'top-crypto-platforms-advertising-services',
  'Premium advertising on top crypto media platforms',
  'megaphone',
  9,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

-- Link each service to its matching category (category slug = service slug).
UPDATE services s
SET category_id = c.id
FROM service_categories c
WHERE c.slug = s.slug;

-- Remove old unused categories (keep only the 9 service-aligned slugs).
DELETE FROM service_categories
WHERE slug NOT IN (
  'cex-exchange-listing-services',
  'web3-wallet-listing-services',
  'market-making-mm-bot-services',
  'top-dex-exchange-listing-services',
  'top-dex-crypto-website-listing-services',
  'smart-contract-audit-services',
  'coinmarketcap-coingecko-listing-services',
  'influencer-marketing-services',
  'top-crypto-platforms-advertising-services'
);
