import type { LucideIcon } from "lucide-react";
import {
  Building2,
  BarChart3,
  Bot,
  Globe,
  Lock,
  Megaphone,
  Newspaper,
  Search,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

export const TRUST_HIGHLIGHTS = [
  "Exchange Listing Support",
  "CoinMarketCap & CoinGecko Support",
  "Market Making Solutions",
  "Crypto PR Distribution",
  "Community Growth Services",
  "Smart Contract Audit Coordination",
  "Wallet Integration Support",
  "AI-Powered Web3 Solutions",
] as const;

export const HERO_STATS = [
  { value: "96+", label: "Web3 Services" },
  { value: "20+", label: "Exchange Networks" },
  { value: "24–72h", label: "Avg. Turnaround" },
  { value: "10–30%", label: "Partner Commission" },
] as const;

export const PLATFORM_STATS = [
  { value: "96+", label: "launch-ready services" },
  { value: "20+", label: "exchange ecosystems" },
  { value: "13", label: "service categories" },
  { value: "24–72h", label: "average turnaround" },
  { value: "10–30%", label: "partner commission" },
  { value: "Global", label: "client coverage" },
] as const;

export const WHY_NEED_US = [
  {
    title: "The shortest path to listings & growth",
    desc: "Get expert guidance on exchange onboarding, data platforms, and go-to-market — with transparent pricing from day one.",
  },
  {
    title: "Avoid costly listing mistakes",
    desc: "We help you prepare documentation, packaging, and requirements before you spend budget on the wrong exchange or vendor.",
  },
  {
    title: "One dashboard for everything",
    desc: "Listing, PR, market making, audits, wallets, community, and AI — managed from a single professional partner portal.",
  },
  {
    title: "Higher approval readiness",
    desc: "We know what exchanges and third-party platforms expect — and help position your project accordingly.",
  },
  {
    title: "Dedicated post-order support",
    desc: "Track progress, payments, deliverables, and support tickets without chasing multiple vendors.",
  },
  {
    title: "Partner network you can trust",
    desc: "Access vetted Web3 professionals, media partners, auditors, and service providers through one marketplace.",
  },
] as const;

export const SERVICE_PILLARS = [
  {
    slug: "development",
    title: "Development",
    desc: "Smart contracts, dApps, bots, and custom Web3 builds for launch-ready projects.",
    href: "/services?category=development",
  },
  {
    slug: "security",
    title: "Security",
    desc: "Audits, KYC/AML, and token security to strengthen trust before you go live.",
    href: "/services?category=security",
  },
  {
    slug: "marketing",
    title: "Marketing",
    desc: "PR, KOLs, and community campaigns that amplify your listing and launch.",
    href: "/services?category=marketing",
  },
  {
    slug: "exchange-listing",
    title: "Exchange Listing",
    desc: "CEX & DEX listing strategy, documentation, and exchange communication.",
    href: "/services?category=exchange-listing",
  },
  {
    slug: "market-making",
    title: "Market Making",
    desc: "Liquidity, volume support, and market making for CEX and DEX pairs.",
    href: "/services?category=market-making",
  },
  {
    slug: "listing-services",
    title: "Listing Services",
    desc: "CMC, CoinGecko, wallets, explorers, and discovery platform listings.",
    href: "/services?category=listing-services",
  },
  {
    slug: "growth",
    title: "Growth",
    desc: "Trending, launch support, and advisory to scale after you list.",
    href: "/services?category=growth",
  },
] as const;

export const PRICING_PACKAGES = [
  {
    name: "Package A",
    subtitle: "Self Service",
    badge: "Custom Quote",
    price: "Custom Quote",
    priceNote: "Scope reviewed · Quote before work starts",
    features: [
      "BSCScan & explorer logo updates",
      "DEXTools & data platform updates",
      "Liquidity lock & LP setup",
      "AI Telegram bot setup",
      "Fast turnaround on approved quotes",
      "Clear deliverables & timelines",
    ],
    cta: "Request Quote",
    href: "/contact",
    featured: false,
  },
  {
    name: "Package B",
    subtitle: "Managed Service",
    badge: "Custom Quote",
    price: "Custom Quote",
    priceNote: "Vendor cost + platform margin",
    features: [
      "Exchange listing support (MEXC, Gate, KuCoin…)",
      "Market making & liquidity packages",
      "PR, influencer & community campaigns",
      "Admin reviews scope & sends quote",
      "Requirements submission first",
      "Flexible milestone payments",
    ],
    cta: "Request Quote",
    href: "/contact",
    featured: true,
  },
  {
    name: "Package C",
    subtitle: "Enterprise Service",
    badge: "Custom Quote",
    price: "Custom Quote",
    priceNote: "Consultation required · Third-party approval not guaranteed",
    features: [
      "Binance ecosystem advisory",
      "CoinMarketCap & CoinGecko support",
      "Trust Wallet & wallet integrations",
      "Audit coordination (CertiK, etc.)",
      "Fundraising & investor introductions",
      "Book consultation before order",
    ],
    cta: "Request Quote",
    href: "/contact",
    featured: false,
  },
] as const;

export const PARTNER_EXCHANGES = [
  "Binance",
  "MEXC",
  "Gate.io",
  "KuCoin",
  "Bitget",
  "BitMart",
  "LBank",
  "Coinstore",
  "LATOKEN",
  "XT",
  "CoinMarketCap",
  "CoinGecko",
  "DEXTools",
  "Trust Wallet",
] as const;

export const PARTNER_PLATFORMS = [
  { name: "OKX", type: "exchange", domain: "okx.com" },
  { name: "HTX", type: "exchange", domain: "htx.com" },
  { name: "Binance", type: "exchange", domain: "binance.com" },
  { name: "KuCoin", type: "exchange", domain: "kucoin.com" },
  { name: "Upbit", type: "exchange", domain: "upbit.com" },
  { name: "Gate.io", type: "exchange", domain: "gate.io" },
  { name: "MEXC", type: "exchange", domain: "mexc.com" },
  { name: "Bitget", type: "exchange", domain: "bitget.com" },
  { name: "LBank", type: "exchange", domain: "lbank.com" },
  { name: "BitMart", type: "exchange", domain: "bitmart.com" },
  { name: "Phemex", type: "exchange", domain: "phemex.com" },
  { name: "Coinstore", type: "exchange", domain: "coinstore.com" },
  { name: "BingX", type: "exchange", domain: "bingx.com" },
  { name: "XT", type: "exchange", domain: "xt.com" },
  { name: "Coinbase", type: "exchange", domain: "coinbase.com" },
  { name: "CoinMarketCap", type: "exchange", domain: "coinmarketcap.com" },
  { name: "DAO Maker", type: "launchpad", domain: "daomaker.com" },
  { name: "Poloniex", type: "exchange", domain: "poloniex.com" },
  { name: "LATOKEN", type: "exchange", domain: "latoken.com" },
  { name: "Kraken", type: "exchange", domain: "kraken.com" },
] as const;

export type ServiceCategoryBlock = {
  icon: LucideIcon;
  title: string;
  description: string;
  ecosystems?: string[];
  includes?: string[];
  features?: string[];
  services?: string[];
  publications?: string[];
  solutions?: string[];
};

export const SERVICE_CATEGORIES: ServiceCategoryBlock[] = [
  {
    icon: Building2,
    title: "Exchange Listing Consulting",
    description: "Prepare and manage exchange onboarding with expert guidance.",
    ecosystems: [
      "Binance Ecosystem",
      "Bitget Ecosystem",
      "MEXC Ecosystem",
      "Gate Ecosystem",
      "KuCoin Ecosystem",
      "BitMart Ecosystem",
      "Coinstore Ecosystem",
      "LATOKEN Ecosystem",
      "20+ Additional Exchange Networks",
    ],
    includes: [
      "Listing Preparation",
      "Exchange Documentation Review",
      "Listing Application Support",
      "Communication Assistance",
      "Project Readiness Assessment",
    ],
  },
  {
    icon: Globe,
    title: "CoinMarketCap & CoinGecko Support",
    description: "Increase visibility across major crypto data platforms.",
    services: [
      "Listing Preparation",
      "Application Review",
      "Data Verification",
      "Submission Assistance",
      "Follow-Up Support",
    ],
  },
  {
    icon: BarChart3,
    title: "Market Making & Liquidity Solutions",
    description: "Build healthy trading activity and stronger market depth.",
    features: [
      "MM Bot Setup",
      "Liquidity Strategy",
      "Spread Optimization",
      "Trading Pair Management",
      "Volume Monitoring",
      "Reporting Dashboard",
    ],
  },
  {
    icon: Lock,
    title: "Liquidity Lock & Token Lock",
    description: "Enhance investor confidence through transparent token management.",
    services: [
      "Liquidity Lock",
      "LP Lock",
      "Team Token Lock",
      "Vesting Setup",
      "Treasury Lock",
      "Smart Contract Locking",
    ],
  },
  {
    icon: Search,
    title: "Blockchain Explorer Updates",
    description: "Keep project information updated across blockchain explorers.",
    services: [
      "Logo Update",
      "Social Link Update",
      "Website Update",
      "Contact Information Update",
      "Contract Verification",
      "Token Information Management",
    ],
  },
  {
    icon: Wallet,
    title: "Wallet Integration Support",
    description: "Improve accessibility across popular Web3 wallets.",
    ecosystems: [
      "Trust Wallet",
      "MetaMask",
      "Coinbase Wallet",
      "SafePal Wallet",
      "TokenPocket",
      "OKX Wallet",
      "Bitget Wallet",
      "KuCoin Wallet",
      "Gate Wallet",
    ],
  },
  {
    icon: Shield,
    title: "Smart Contract Audit Coordination",
    description: "Connect with recognized blockchain security providers.",
    ecosystems: ["CertiK", "Hacken", "Independent Auditors", "Specialized Security Firms"],
    includes: [
      "Audit Preparation",
      "Security Review Coordination",
      "Remediation Assistance",
      "Technical Support",
    ],
  },
  {
    icon: Newspaper,
    title: "Crypto PR & Media Distribution",
    description: "Expand project awareness through crypto media outreach.",
    publications: [
      "CoinDesk",
      "Cointelegraph",
      "BeInCrypto",
      "CryptoSlate",
      "NewsBTC",
      "U.Today",
      "Bitcoin.com News",
      "AMBCrypto",
      "Crypto.News",
      "BSC News",
      "Regional Crypto Publications",
    ],
    includes: [
      "Press Release Writing",
      "Media Distribution",
      "Editorial Coordination",
      "Publication Tracking",
    ],
  },
  {
    icon: Megaphone,
    title: "Influencer & KOL Marketing",
    description: "Reach targeted Web3 audiences through trusted influencers.",
    services: [
      "Twitter/X Influencers",
      "Telegram Influencers",
      "YouTube Influencers",
      "AMA Campaigns",
      "KOL Promotions",
      "Community Campaigns",
    ],
  },
  {
    icon: Users,
    title: "Community Growth Services",
    description: "Build and manage active communities.",
    includes: [
      "Telegram Management",
      "Discord Management",
      "Moderators",
      "Community Managers",
      "Community Support",
      "Engagement Campaigns",
      "Shiller Teams",
    ],
  },
  {
    icon: Bot,
    title: "AI-Powered Web3 Services",
    description: "Automate operations and improve user engagement.",
    solutions: [
      "AI Customer Support Bot",
      "AI Telegram Assistant",
      "AI Community Assistant",
      "AI Trading Assistant",
      "AI Knowledge Base",
      "AI Lead Generation Bot",
    ],
  },
];

export const WHY_CHOOSE = [
  {
    title: "Fast Turnaround",
    desc: "Most supported services delivered within 24–72 hours.",
  },
  {
    title: "One Dashboard",
    desc: "Manage orders, invoices, updates, and support from one place.",
  },
  {
    title: "Transparent Pricing",
    desc: "Know exactly what you're paying for before placing an order.",
  },
  {
    title: "Expert Network",
    desc: "Access experienced Web3 professionals and service providers.",
  },
  {
    title: "Dedicated Support",
    desc: "Telegram, ticketing system, and account management support.",
  },
  {
    title: "Global Service Coverage",
    desc: "Supporting clients across Asia, Europe, Middle East, Africa, and North America.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Select a Service",
    desc: "Browse available Web3 services and choose the package that fits your project.",
  },
  {
    step: "02",
    title: "Submit Requirements",
    desc: "Provide project details and required documentation.",
  },
  {
    step: "03",
    title: "Project Review",
    desc: "Our team reviews and confirms the order.",
  },
  {
    step: "04",
    title: "Execution Begins",
    desc: "Service providers begin execution and provide progress updates.",
  },
  {
    step: "05",
    title: "Completion & Reporting",
    desc: "Receive deliverables, reports, and ongoing support.",
  },
] as const;

export const PARTNER_BENEFITS = [
  "10%–30% Commission",
  "Real-Time Tracking",
  "Partner Dashboard",
  "Referral System",
  "Withdrawal Management",
  "Dedicated Support",
] as const;

export const PARTNER_AUDIENCE = [
  "Marketing Agencies",
  "Influencers",
  "Business Consultants",
  "Freelancers",
  "Community Managers",
  "Crypto Media Networks",
] as const;

export const HOME_FAQS = [
  {
    q: "Do you guarantee exchange listings?",
    a: "No. We provide consulting, preparation, onboarding assistance, and coordination support. Final decisions are controlled by the respective exchanges.",
  },
  {
    q: "Do you guarantee CoinMarketCap or CoinGecko approval?",
    a: "No. Approval decisions remain with the respective platform.",
  },
  {
    q: "Are your services available globally?",
    a: "Yes. We support Web3 projects worldwide.",
  },
  {
    q: "Do you offer recurring growth services?",
    a: "Yes. Market making, community management, AI support, and marketing services are available on recurring plans.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Crypto payments and traditional payment methods where available.",
  },
  {
    q: "How fast can we get started?",
    a: "Most supported services begin within 24–72 hours after requirements are approved and payment is confirmed.",
  },
  {
    q: "Can agencies and freelancers partner with you?",
    a: "Yes. Our partner program offers 10–30% commission with a dedicated dashboard, referral tracking, and withdrawals.",
  },
] as const;

/** TokenMinds-style homepage sections — copy adapted for Web3Listing. */
export const HOME_SOLUTIONS = [
  {
    title: "Exchange Listing",
    desc: "Prepare docs, packages, and outreach for CEX & DEX listings across 20+ ecosystems.",
    href: "/services?category=exchange-listing",
  },
  {
    title: "Liquidity & Market Making",
    desc: "Build healthy depth, tighter spreads, and sustainable trading activity after you list.",
    href: "/services?category=market-making",
  },
  {
    title: "Growth & Crypto Marketing",
    desc: "PR, KOLs, community, and discovery listings that amplify your launch window.",
    href: "/services?category=marketing",
  },
] as const;

export const HOME_INDUSTRIES = [
  {
    title: "Token Projects",
    desc: "Listing prep, CMC/CG, wallets, and launch support",
  },
  {
    title: "Launchpads & Funds",
    desc: "Portfolio visibility and go-to-market coordination",
  },
  {
    title: "Fintech & Wallets",
    desc: "Integrations, discovery, and trust signals",
  },
  {
    title: "Agencies & KOLs",
    desc: "White-label delivery via partner program",
  },
  {
    title: "Community Builders",
    desc: "Telegram, Discord, and engagement ops",
  },
] as const;

export const HOME_LISTING_FEATURES = [
  {
    title: "Listing Preparation",
    desc: "Define requirements, packaging, and readiness before you spend budget on the wrong venue.",
  },
  {
    title: "Documentation & Compliance",
    desc: "Align whitepapers, tokenomics, KYC/AML, and audit materials with what platforms expect.",
  },
  {
    title: "Coordination & Follow-up",
    desc: "Manage applications, communication, and status tracking from one professional dashboard.",
  },
] as const;

export const HOME_GROWTH_STATS = [
  {
    value: "+40%",
    label: "Faster Listing Readiness",
    desc: "Through structured prep and vetted partner workflows",
  },
  {
    value: "+30%",
    label: "Stronger Post-List Visibility",
    desc: "Via PR, data platforms, and discovery listings",
  },
  {
    value: "+25%",
    label: "Healthier Market Depth",
    desc: "Driven by market making and liquidity support",
  },
] as const;

export const HOME_SETS_APART = [
  {
    title: "Marketplace First",
    desc: "Transparent pricing, clear deliverables, and a single portal for listings, PR, liquidity, audits, and growth.",
  },
  {
    title: "360° Launch Stack",
    desc: "From exchange onboarding to community and AI bots — integrated support across your full Web3 go-to-market.",
  },
  {
    title: "Partner-Ready Ops",
    desc: "Agencies and freelancers earn with real-time tracking, referrals, and dedicated support — not scattered vendors.",
  },
] as const;

export const HOME_COLLAB_SERVICES = [
  "Exchange Listing",
  "Market Making",
  "Crypto Marketing",
  "CMC / CoinGecko",
  "Smart Contract Audit",
  "Other / Custom",
] as const;

export const DISCLAIMER_PARAGRAPHS = [
  "Web3Listing.com is an independent Web3 consulting, blockchain marketing, and service marketplace. We provide consultation, project coordination, and support services for blockchain projects, cryptocurrency businesses, and Web3 startups.",
  "We are not affiliated with, endorsed by, sponsored by, or officially partnered with any cryptocurrency exchange, blockchain network, wallet provider, media platform, audit company, or other third-party organization unless explicitly stated on our website.",
  "All trademarks, logos, brand names, exchange names, wallet names, and other intellectual property displayed on this website are the property of their respective owners and are used solely for identification and informational purposes.",
] as const;

/** @deprecated Prefer DISCLAIMER_PARAGRAPHS for multi-paragraph rendering. */
export const DISCLAIMER = DISCLAIMER_PARAGRAPHS.join(" ");
