-- Seed 7 core service categories with distinctive Lucide icons.
-- Safe to re-run: upserts by slug.

INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active)
VALUES
(
  'Development',
  'development',
  'Smart contracts, dApps, bots, and custom Web3 product development',
  'blocks',
  1,
  true
),
(
  'Security',
  'security',
  'Smart contract audits, KYC/AML tooling, and token security services',
  'shield-check',
  2,
  true
),
(
  'Marketing',
  'marketing',
  'PR, influencer campaigns, community growth, and brand awareness',
  'megaphone',
  3,
  true
),
(
  'Exchange Listing',
  'exchange-listing',
  'CEX and DEX exchange listing preparation, submission, and follow-up',
  'landmark',
  4,
  true
),
(
  'Market Making',
  'market-making',
  'Liquidity bots, volume support, and market making for CEX/DEX pairs',
  'chart-candlestick',
  5,
  true
),
(
  'Listing Services',
  'listing-services',
  'Tracker, wallet, explorer, and discovery platform listing support',
  'list-checks',
  6,
  true
),
(
  'Growth',
  'growth',
  'Trending, launch support, and full-funnel Web3 growth packages',
  'rocket',
  7,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;
