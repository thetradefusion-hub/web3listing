export type LegalSectionGroup = {
  title: string;
  bullets: string[];
};

export type LegalSection = {
  number: number;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  groups?: LegalSectionGroup[];
  closing?: string;
};

export type LegalDocument = {
  slug: string;
  title: string;
  site: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  slug: "terms",
  title: "Terms & Conditions",
  site: "TokenWeb3Listing.com",
  lastUpdated: "June 2026",
  sections: [
    {
      number: 1,
      title: "Acceptance of Terms",
      paragraphs: [
        "By accessing TokenWeb3Listing.com, creating an account, submitting information, purchasing services, or using our platform, you agree to comply with these Terms & Conditions.",
        "If you do not agree, you must discontinue use of the platform.",
      ],
    },
    {
      number: 2,
      title: "Services",
      paragraphs: ["TokenWeb3Listing.com provides:"],
      bullets: [
        "Exchange Listing Consulting",
        "CoinMarketCap & CoinGecko Support",
        "Market Making Services",
        "Liquidity & Token Lock Services",
        "Blockchain Explorer Updates",
        "Wallet Integration Support",
        "Crypto PR Distribution",
        "Influencer Marketing",
        "Community Management",
        "Smart Contract Audit Coordination",
        "AI Support Solutions",
        "Related Web3 Services",
      ],
      closing: "All services are provided on a best-effort basis.",
    },
    {
      number: 3,
      title: "No Guarantee",
      paragraphs: ["We do not guarantee:"],
      bullets: [
        "Exchange Listing Approval",
        "CoinMarketCap Approval",
        "CoinGecko Approval",
        "Wallet Listing Approval",
        "Media Publication Approval",
        "Trending Rankings",
        "Trading Volume",
        "Fundraising Success",
        "Token Price Appreciation",
        "Community Growth Results",
      ],
      closing: "Final decisions remain under the control of third-party providers.",
    },
    {
      number: 4,
      title: "Client Responsibilities",
      paragraphs: ["Clients must:"],
      bullets: [
        "Provide accurate information.",
        "Submit valid documentation.",
        "Comply with applicable laws.",
        "Respond to requests promptly.",
        "Maintain project legitimacy.",
      ],
      closing: "Any delay caused by the client may affect delivery timelines.",
    },
    {
      number: 5,
      title: "Prohibited Projects",
      paragraphs: ["We reserve the right to reject or terminate services for:"],
      bullets: [
        "Scam Projects",
        "Fraudulent Activities",
        "Money Laundering Activities",
        "Sanctioned Entities",
        "Terrorism Financing",
        "Illegal Securities Offerings",
        "Adult Content Projects",
        "Gambling Projects (where restricted)",
        "Projects violating applicable regulations",
      ],
    },
    {
      number: 6,
      title: "Payments",
      paragraphs: [
        "Full payment is required before work begins.",
        "Certain enterprise services may require milestone payments.",
        "Payments are non-refundable except where specifically covered by the Refund Policy.",
        "Crypto payments are considered completed after blockchain confirmation.",
      ],
    },
    {
      number: 7,
      title: "Intellectual Property",
      paragraphs: [
        "Clients retain ownership of their projects and submitted materials.",
        "TokenWeb3Listing.com retains ownership of its website, branding, systems, reports, documentation, and proprietary processes.",
      ],
    },
    {
      number: 8,
      title: "Limitation of Liability",
      paragraphs: [
        "The maximum liability of TokenWeb3Listing.com shall not exceed the amount paid for the specific service purchased.",
        "We shall not be liable for:",
      ],
      bullets: [
        "Financial Losses",
        "Trading Losses",
        "Regulatory Actions",
        "Token Price Changes",
        "Exchange Decisions",
        "Publication Decisions",
        "Audit Results",
      ],
    },
    {
      number: 9,
      title: "Termination",
      paragraphs: ["We reserve the right to suspend or terminate any account for:"],
      bullets: ["Fraud", "Abuse", "Chargeback Fraud", "AML Violations", "Policy Violations"],
    },
    {
      number: 10,
      title: "Governing Law",
      paragraphs: [
        "Any disputes shall be governed by the laws applicable to the jurisdiction in which the company is registered.",
        "Arbitration and mediation may be required before court proceedings.",
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  site: "TokenWeb3Listing.com",
  lastUpdated: "June 2026",
  sections: [
    {
      number: 1,
      title: "Introduction",
      paragraphs: [
        "TokenWeb3Listing.com respects your privacy and is committed to protecting your personal and business information.",
        "This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform.",
      ],
    },
    {
      number: 2,
      title: "Information We Collect",
      groups: [
        {
          title: "Personal Information",
          bullets: [
            "Full Name",
            "Email Address",
            "Phone Number",
            "Telegram Username",
            "Company Name",
            "Billing Information",
          ],
        },
        {
          title: "Business Information",
          bullets: ["Project Name", "Website", "Whitepaper", "Social Media Links"],
        },
        {
          title: "Blockchain Information",
          bullets: ["Exchange Information"],
        },
        {
          title: "Technical Information",
          bullets: [
            "IP Address",
            "Browser Information",
            "Device Information",
            "Login Activity",
            "Cookies & Analytics Data",
          ],
        },
      ],
    },
    {
      number: 3,
      title: "How We Use Information",
      paragraphs: ["We may use information for:"],
      bullets: [
        "Account Management",
        "Service Delivery",
        "Customer Support",
        "Payment Processing",
        "Compliance Verification",
        "Security Monitoring",
        "Marketing Communications",
        "Platform Improvement",
      ],
    },
    {
      number: 4,
      title: "Information Sharing",
      paragraphs: ["We do not sell personal data.", "Information may be shared with:"],
      bullets: [
        "Service Providers",
        "Audit Firms",
        "Exchanges",
        "Wallet Providers",
        "Payment Processors",
        "Legal Authorities when required",
      ],
      closing: "Only information necessary for service delivery will be shared.",
    },
    {
      number: 5,
      title: "Data Security",
      paragraphs: ["We implement:"],
      bullets: [
        "SSL Encryption",
        "Access Controls",
        "Role-Based Permissions",
        "Secure Storage",
        "Activity Monitoring",
      ],
      closing: "However, no system can guarantee 100% security.",
    },
    {
      number: 6,
      title: "Data Retention",
      paragraphs: ["We may retain information for:"],
      bullets: [
        "Service Records",
        "Accounting Requirements",
        "Legal Compliance",
        "Fraud Prevention",
      ],
      closing: "Data may be retained even after account closure where legally required.",
    },
    {
      number: 7,
      title: "User Rights",
      paragraphs: ["Users may request:"],
      bullets: [
        "Access to Information",
        "Correction of Information",
        "Account Closure",
        "Data Deletion (where legally permitted)",
      ],
    },
    {
      number: 8,
      title: "Policy Updates",
      paragraphs: [
        "TokenWeb3Listing.com may update this policy without prior notice.",
        "Continued use of the platform constitutes acceptance of updated policies.",
      ],
    },
  ],
};

export const AML_KYC_POLICY: LegalDocument = {
  slug: "aml-kyc",
  title: "AML & KYC Policy",
  site: "TokenWeb3Listing.com",
  lastUpdated: "June 2026",
  sections: [
    {
      number: 1,
      title: "Purpose",
      paragraphs: ["TokenWeb3Listing.com is committed to preventing:"],
      bullets: [
        "Money Laundering",
        "Terrorist Financing",
        "Fraud",
        "Financial Crimes",
        "Sanctions Violations",
      ],
    },
    {
      number: 2,
      title: "KYC Requirements",
      paragraphs: ["We reserve the right to request:"],
      groups: [
        {
          title: "Individual Verification",
          bullets: [
            "Government ID",
            "Passport",
            "Driving License",
            "Proof of Address",
            "Selfie Verification",
          ],
        },
        {
          title: "Business Verification",
          bullets: [
            "Certificate of Incorporation",
            "Company Registration Documents",
            "Shareholder Information",
            "Director Information",
            "Business Address Verification",
          ],
        },
      ],
    },
    {
      number: 3,
      title: "Enhanced Due Diligence",
      paragraphs: ["Additional verification may be required for:"],
      bullets: [
        "Large Transactions",
        "High-Risk Jurisdictions",
        "Politically Exposed Persons",
        "Complex Ownership Structures",
      ],
    },
    {
      number: 4,
      title: "Restricted Activities",
      paragraphs: ["We do not support projects related to:"],
      bullets: [
        "Terrorism Financing",
        "Sanctioned Entities",
        "Fraud Schemes",
        "Ponzi Schemes",
        "Scam Projects",
        "Illegal Securities Offerings",
        "Money Laundering Activities",
      ],
    },
    {
      number: 5,
      title: "Transaction Monitoring",
      paragraphs: ["We reserve the right to:"],
      bullets: [
        "Review Transactions",
        "Request Additional Information",
        "Suspend Accounts",
        "Reject Transactions",
        "Report Suspicious Activity",
      ],
    },
    {
      number: 6,
      title: "Compliance Cooperation",
      paragraphs: ["We may cooperate with:"],
      bullets: [
        "Financial Authorities",
        "Regulatory Agencies",
        "Law Enforcement",
        "Courts and Government Bodies",
      ],
      closing: "Where legally required.",
    },
    {
      number: 7,
      title: "Right to Refuse Service",
      paragraphs: [
        "TokenWeb3Listing.com reserves the right to refuse any client, project, transaction, or relationship without explanation if compliance concerns exist.",
      ],
    },
  ],
};

export const REFUND_POLICY: LegalDocument = {
  slug: "refund",
  title: "Refund Policy",
  site: "TokenWeb3Listing.com",
  lastUpdated: "June 2026",
  sections: [
    {
      number: 1,
      title: "Eligible Refund Cases",
      paragraphs: ["Refunds may be approved when:"],
      bullets: [
        "Payment is duplicated.",
        "Service cannot be delivered.",
        "Service has not started within the agreed timeline.",
        "Order is cancelled by TokenWeb3Listing.com.",
      ],
    },
    {
      number: 2,
      title: "Non-Refundable Cases",
      paragraphs: ["Refunds will NOT be provided when:"],
      bullets: [
        "Third-party platforms reject applications.",
        "Exchange listing applications are declined.",
        "CoinMarketCap or CoinGecko applications are rejected.",
        "Wallet integrations are rejected.",
        "Media publications are declined.",
        "Audit providers reject projects.",
        "Clients provide incorrect information.",
        "Work has already started.",
        "Work has been completed.",
      ],
    },
    {
      number: 3,
      title: "Partial Refunds",
      paragraphs: [
        "If partial work has been completed, a partial refund may be issued after deducting operational and service costs.",
      ],
    },
    {
      number: 4,
      title: "Refund Processing",
      paragraphs: ["Approved refunds will be processed within:"],
      bullets: ["7–14 Business Days"],
      closing: "The original payment method may be used whenever possible.",
    },
    {
      number: 5,
      title: "Crypto Payments",
      paragraphs: [
        "Due to blockchain volatility and transaction costs, crypto refunds may be processed in equivalent value rather than original token amounts.",
      ],
    },
  ],
};

export const SLA_POLICY: LegalDocument = {
  slug: "sla",
  title: "Service Level Agreement (SLA)",
  site: "TokenWeb3Listing.com",
  lastUpdated: "June 2026",
  sections: [
    {
      number: 1,
      title: "Objective",
      paragraphs: ["This SLA defines expected service standards and response times."],
    },
    {
      number: 2,
      title: "Support Channels",
      bullets: [
        "Ticket System",
        "Telegram Support",
        "Email Support",
        "Account Manager Support",
      ],
    },
    {
      number: 3,
      title: "Response Times",
      groups: [
        {
          title: "Standard Support",
          bullets: ["Response Time: Within 24 Hours"],
        },
        {
          title: "Priority Support",
          bullets: ["Response Time: Within 12 Hours"],
        },
        {
          title: "Enterprise Support",
          bullets: ["Response Time: Within 4 Hours"],
        },
      ],
    },
    {
      number: 4,
      title: "Service Delivery Timelines",
      groups: [
        {
          title: "Standard Services",
          bullets: ["Expected Delivery: 24–72 Hours"],
        },
        {
          title: "Enterprise Services",
          bullets: ["Timeline: Custom Based on Scope"],
        },
        {
          title: "Third-Party Services",
          bullets: ["Timeline: Dependent upon External Providers"],
        },
      ],
    },
    {
      number: 5,
      title: "Service Status Updates",
      paragraphs: ["Clients will receive:"],
      bullets: [
        "Order Confirmation",
        "Progress Updates",
        "Completion Notification",
        "Delay Notification (if applicable)",
      ],
    },
    {
      number: 6,
      title: "Client Responsibilities",
      paragraphs: ["Clients must:"],
      bullets: [
        "Submit complete information.",
        "Respond to requests promptly.",
        "Provide required documents.",
        "Maintain communication.",
      ],
      closing: "Failure to do so may extend delivery timelines.",
    },
    {
      number: 7,
      title: "Force Majeure",
      paragraphs: ["TokenWeb3Listing.com shall not be responsible for delays caused by:"],
      bullets: [
        "Exchange Delays",
        "Wallet Provider Delays",
        "Media Publication Delays",
        "Government Actions",
        "Network Outages",
        "Natural Disasters",
        "Third-Party Failures",
      ],
    },
    {
      number: 8,
      title: "Service Credits",
      paragraphs: [
        "Service credits may be considered only when delays are directly caused by TokenWeb3Listing.com and not by external providers or client actions.",
      ],
    },
  ],
};

export const DISCLAIMER_POLICY: LegalDocument = {
  slug: "disclaimer",
  title: "Legal Disclaimer",
  site: "TokenWeb3Listing.com",
  lastUpdated: "June 2026",
  sections: [
    {
      number: 1,
      title: "General Disclaimer",
      paragraphs: [
        "TokenWeb3Listing.com is an independent Web3 consulting, marketing, listing support, and service marketplace platform.",
        "We provide consulting, coordination, onboarding assistance, project management, and execution support for blockchain, cryptocurrency, Web3, AI, DeFi, NFT, GameFi, and related technology projects.",
        "TokenWeb3Listing.com does not own, operate, control, or represent any cryptocurrency exchange, blockchain explorer, wallet provider, media publication, audit company, influencer network, market maker, launchpad, or third-party service provider unless explicitly stated through a separate written partnership agreement.",
      ],
    },
    {
      number: 2,
      title: "No Official Affiliation",
      paragraphs: [
        "References to exchanges, wallets, media platforms, audit firms, blockchain explorers, launchpads, or third-party service providers are provided solely for informational and service coordination purposes.",
        "TokenWeb3Listing.com is not affiliated with, endorsed by, sponsored by, or officially partnered with any third-party company unless specifically disclosed.",
        "All company names, trademarks, service marks, logos, and intellectual property belong to their respective owners.",
      ],
    },
    {
      number: 3,
      title: "Exchange Listing Disclaimer",
      paragraphs: [
        "TokenWeb3Listing.com provides exchange listing consulting, preparation assistance, documentation review, communication support, and project onboarding services.",
        "We do not own or control any exchange listing process.",
        "Final approval, rejection, pricing, timelines, requirements, and listing decisions remain solely under the control of the respective exchange.",
        "We do not guarantee exchange listing approval under any circumstances.",
      ],
    },
    {
      number: 4,
      title: "CoinMarketCap & CoinGecko Disclaimer",
      paragraphs: [
        "TokenWeb3Listing.com assists clients with application preparation, documentation review, project readiness verification, and submission support.",
        "CoinMarketCap and CoinGecko independently evaluate applications.",
        "We do not control their review process and cannot guarantee listing approval.",
      ],
    },
    {
      number: 5,
      title: "Wallet Integration Disclaimer",
      paragraphs: [
        "Wallet listing, token visibility, asset integration, and wallet ecosystem support services are dependent upon the policies and review processes of the respective wallet providers.",
        "Approval, display, integration, and visibility decisions remain entirely with the wallet provider.",
      ],
    },
    {
      number: 6,
      title: "Blockchain Explorer Disclaimer",
      paragraphs: [
        "Explorer update services are limited to assisting with the submission and coordination process.",
        "Approval of token logos, social links, project information, and contract verification remains subject to the policies of the respective blockchain explorer.",
      ],
    },
    {
      number: 7,
      title: "Smart Contract Audit Disclaimer",
      paragraphs: [
        "TokenWeb3Listing.com does not perform security audits unless specifically stated.",
        "Audit services are coordinated through independent third-party security firms.",
        "Audit reports, findings, recommendations, and certifications are issued exclusively by the selected audit provider.",
        "We do not guarantee the security, performance, or vulnerability-free operation of any smart contract.",
      ],
    },
    {
      number: 8,
      title: "Media & PR Disclaimer",
      paragraphs: [
        "Publication opportunities may be available through various media outlets and distribution networks.",
        "Editorial approval remains solely under the control of the respective publication.",
        "We do not guarantee publication approval, publication timelines, article placement, article retention, audience engagement, investor interest, or media coverage results.",
      ],
    },
    {
      number: 9,
      title: "Influencer Marketing Disclaimer",
      paragraphs: [
        "Influencer marketing results may vary depending on audience engagement, market conditions, campaign quality, and platform policies.",
        "We do not guarantee views, engagement, token performance, community growth, investment activity, fundraising results, or project success.",
      ],
    },
    {
      number: 10,
      title: "Market Making Disclaimer",
      paragraphs: [
        "Market making, liquidity management, trading support, and automated trading services involve significant risks.",
        "TokenWeb3Listing.com does not provide investment advice, financial advice, portfolio management services, securities services, brokerage services, or regulated financial services.",
        "Past performance does not guarantee future results.",
        "Clients remain fully responsible for all trading activities and regulatory compliance.",
      ],
    },
    {
      number: 11,
      title: "No Investment Advice",
      paragraphs: [
        "Information provided by TokenWeb3Listing.com is for business and operational purposes only.",
        "Nothing contained on this website shall be considered:",
      ],
      bullets: [
        "Investment Advice",
        "Financial Advice",
        "Legal Advice",
        "Tax Advice",
        "Securities Advice",
        "Trading Advice",
      ],
      closing:
        "Users should seek independent professional advice before making any financial, legal, tax, or investment decisions.",
    },
    {
      number: 12,
      title: "No Guarantee of Results",
      paragraphs: ["TokenWeb3Listing.com does not guarantee:"],
      bullets: [
        "Exchange Listings",
        "CoinMarketCap Approval",
        "CoinGecko Approval",
        "Wallet Listings",
        "Audit Certifications",
        "Media Publications",
        "Trending Rankings",
        "Trading Volume",
        "Investor Participation",
        "Token Price Increases",
        "Fundraising Success",
        "Community Growth",
        "Revenue Generation",
      ],
      closing: "All services are provided on a best-effort basis.",
    },
    {
      number: 13,
      title: "Compliance Responsibility",
      paragraphs: ["Clients are solely responsible for ensuring that their projects comply with:"],
      bullets: [
        "Local Laws",
        "International Regulations",
        "AML Requirements",
        "KYC Requirements",
        "Securities Regulations",
        "Tax Obligations",
        "Consumer Protection Laws",
      ],
      closing:
        "TokenWeb3Listing.com reserves the right to reject, suspend, or terminate services for any project suspected of fraud, scams, illegal activity, sanctions violations, money laundering, market manipulation, or regulatory violations.",
    },
    {
      number: 14,
      title: "Limitation of Liability",
      paragraphs: [
        "Under no circumstances shall TokenWeb3Listing.com, its owners, employees, contractors, affiliates, partners, or service providers be liable for any direct, indirect, incidental, consequential, special, regulatory, financial, trading, or business losses arising from the use of our services.",
        "The maximum liability of TokenWeb3Listing.com shall be limited to the amount paid by the client for the specific service in question.",
      ],
    },
    {
      number: 15,
      title: "Acceptance of Terms",
      paragraphs: [
        "By accessing our website, submitting information, purchasing services, or engaging with our platform, you acknowledge that you have read, understood, and agreed to this disclaimer and all related policies, terms, and conditions.",
      ],
    },
  ],
};

export const PARTNER_POLICY: LegalDocument = {
  slug: "partner-policy",
  title: "Partner & Affiliate Policy",
  site: "TokenWeb3Listing.com",
  lastUpdated: "June 2026",
  sections: [
    {
      number: 1,
      title: "Commission Structure",
      paragraphs: [
        "Agents may earn commissions ranging from 10% to 30% depending on service category and agreement level.",
      ],
    },
    {
      number: 2,
      title: "Commission Eligibility",
      paragraphs: ["Commissions are earned only when:"],
      bullets: [
        "Client payment is successfully received.",
        "Order is verified.",
        "Refund period has expired.",
      ],
    },
    {
      number: 3,
      title: "Commission Withdrawal",
      groups: [
        {
          title: "Minimum Withdrawal",
          bullets: ["$10 USD"],
        },
        {
          title: "Supported Methods",
          bullets: ["USDT", "Bank Transfer"],
        },
      ],
    },
    {
      number: 4,
      title: "Fraud Prevention",
      groups: [
        {
          title: "Agents may not",
          bullets: [
            "Create fake orders.",
            "Use misleading marketing.",
            "Impersonate official partners.",
            "Make false guarantees.",
          ],
        },
        {
          title: "Violation may result in",
          bullets: ["Account Suspension", "Commission Cancellation", "Permanent Ban"],
        },
      ],
    },
    {
      number: 5,
      title: "Independent Status",
      paragraphs: [
        "Agents operate as independent contractors and are not employees, representatives, or legal partners of TokenWeb3Listing.com.",
        "Agents are responsible for their own taxes, regulatory obligations, and local compliance requirements.",
      ],
    },
    {
      number: 6,
      title: "Marketing Rules",
      paragraphs: ["Agents must not claim:"],
      bullets: [
        "Guaranteed Listings",
        "Guaranteed Publications",
        "Guaranteed Trending",
        "Official Partnerships",
      ],
      closing: "unless explicitly authorized in writing.",
    },
  ],
};

const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  terms: TERMS_AND_CONDITIONS,
  privacy: PRIVACY_POLICY,
  "aml-kyc": AML_KYC_POLICY,
  refund: REFUND_POLICY,
  sla: SLA_POLICY,
  disclaimer: DISCLAIMER_POLICY,
  "partner-policy": PARTNER_POLICY,
};

export function getLegalDocument(slug: string): LegalDocument | null {
  return LEGAL_DOCUMENTS[slug] ?? null;
}

/** Plain-text version for database seed / migration sync */
export function legalDocumentToPlainText(doc: LegalDocument): string {
  const lines: string[] = [
    doc.title.toUpperCase(),
    doc.site,
    `Last Updated: ${doc.lastUpdated}`,
    "",
  ];

  for (const section of doc.sections) {
    lines.push(`${section.number}. ${section.title}`);
    if (section.paragraphs) {
      lines.push(...section.paragraphs);
    }
    if (section.groups) {
      for (const group of section.groups) {
        lines.push(group.title);
        lines.push(...group.bullets.map((b) => `• ${b}`));
      }
    }
    if (section.bullets) {
      lines.push(...section.bullets.map((b) => `• ${b}`));
    }
    if (section.closing) {
      lines.push(section.closing);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}
