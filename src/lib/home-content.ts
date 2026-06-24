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
    title: "Exchange Listing",
    desc: "Listing strategy, exchange communication, documentation, and onboarding support across 20+ partner ecosystems.",
    href: "/services?category=listing-services",
  },
  {
    title: "Market Making",
    desc: "Liquidity strategy, MM bot setup, spread optimization, and post-listing market support on CEX and DEX.",
    href: "/services?category=market-making",
  },
  {
    title: "Marketing & PR",
    desc: "Crypto media distribution, KOL campaigns, influencer outreach, and brand visibility across global publications.",
    href: "/services?category=pr-distribution",
  },
  {
    title: "Data Platform Support",
    desc: "CoinMarketCap, CoinGecko, DEXTools, and explorer updates — increase discoverability across the Web3 stack.",
    href: "/services?category=listing-services",
  },
  {
    title: "Advisory Services",
    desc: "Exchange readiness, tokenomics review, fundraising prep, and strategic consulting from Web3 growth experts.",
    href: "/services?category=premium-advisory",
  },
] as const;

export const PRICING_PACKAGES = [
  {
    name: "Package A",
    subtitle: "Self Service",
    badge: "Fixed Price",
    price: "From $99",
    priceNote: "Transparent pricing · Order directly",
    features: [
      "BSCScan & explorer logo updates",
      "DEXTools & data platform updates",
      "Liquidity lock & LP setup",
      "AI Telegram bot setup",
      "Instant order placement",
      "100% advance payment",
    ],
    cta: "Browse Fixed Services",
    href: "/services",
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
    badge: "Consultation Required",
    price: "From $199",
    priceNote: "Third-party approval not guaranteed",
    features: [
      "Binance ecosystem advisory",
      "CoinMarketCap & CoinGecko support",
      "Trust Wallet & wallet integrations",
      "Audit coordination (CertiK, etc.)",
      "Fundraising & investor introductions",
      "Book consultation before order",
    ],
    cta: "Book Consultation",
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
] as const;

export const DISCLAIMER =
  "TokenWeb3Listing.com is an independent Web3 consulting and service marketplace. We are not affiliated with, endorsed by, or officially partnered with any exchange, wallet provider, media company, audit firm, or third-party platform unless specifically disclosed. All trademarks and brand names belong to their respective owners. Final approvals for listings, publications, audits, wallet integrations, and other third-party services remain under the control of the respective organizations.";
