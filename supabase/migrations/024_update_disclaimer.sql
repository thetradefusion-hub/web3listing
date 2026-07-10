-- Sync Legal Disclaimer with June 2026 full policy text
UPDATE legal_pages
SET
  title = 'Legal Disclaimer',
  content = 'LEGAL DISCLAIMER
Web3Listing.com
Last Updated: June 2026

1. General Disclaimer
Web3Listing.com is an independent Web3 consulting, marketing, listing support, and service marketplace platform.
We provide consulting, coordination, onboarding assistance, project management, and execution support for blockchain, cryptocurrency, Web3, AI, DeFi, NFT, GameFi, and related technology projects.
Web3Listing.com does not own, operate, control, or represent any cryptocurrency exchange, blockchain explorer, wallet provider, media publication, audit company, influencer network, market maker, launchpad, or third-party service provider unless explicitly stated through a separate written partnership agreement.

2. No Official Affiliation
References to exchanges, wallets, media platforms, audit firms, blockchain explorers, launchpads, or third-party service providers are provided solely for informational and service coordination purposes.
Web3Listing.com is not affiliated with, endorsed by, sponsored by, or officially partnered with any third-party company unless specifically disclosed.
All company names, trademarks, service marks, logos, and intellectual property belong to their respective owners.

3. Exchange Listing Disclaimer
Web3Listing.com provides exchange listing consulting, preparation assistance, documentation review, communication support, and project onboarding services.
We do not own or control any exchange listing process.
Final approval, rejection, pricing, timelines, requirements, and listing decisions remain solely under the control of the respective exchange.
We do not guarantee exchange listing approval under any circumstances.

4. CoinMarketCap & CoinGecko Disclaimer
Web3Listing.com assists clients with application preparation, documentation review, project readiness verification, and submission support.
CoinMarketCap and CoinGecko independently evaluate applications.
We do not control their review process and cannot guarantee listing approval.

5. Wallet Integration Disclaimer
Wallet listing, token visibility, asset integration, and wallet ecosystem support services are dependent upon the policies and review processes of the respective wallet providers.
Approval, display, integration, and visibility decisions remain entirely with the wallet provider.

6. Blockchain Explorer Disclaimer
Explorer update services are limited to assisting with the submission and coordination process.
Approval of token logos, social links, project information, and contract verification remains subject to the policies of the respective blockchain explorer.

7. Smart Contract Audit Disclaimer
Web3Listing.com does not perform security audits unless specifically stated.
Audit services are coordinated through independent third-party security firms.
Audit reports, findings, recommendations, and certifications are issued exclusively by the selected audit provider.
We do not guarantee the security, performance, or vulnerability-free operation of any smart contract.

8. Media & PR Disclaimer
Publication opportunities may be available through various media outlets and distribution networks.
Editorial approval remains solely under the control of the respective publication.
We do not guarantee publication approval, publication timelines, article placement, article retention, audience engagement, investor interest, or media coverage results.

9. Influencer Marketing Disclaimer
Influencer marketing results may vary depending on audience engagement, market conditions, campaign quality, and platform policies.
We do not guarantee views, engagement, token performance, community growth, investment activity, fundraising results, or project success.

10. Market Making Disclaimer
Market making, liquidity management, trading support, and automated trading services involve significant risks.
Web3Listing.com does not provide investment advice, financial advice, portfolio management services, securities services, brokerage services, or regulated financial services.
Past performance does not guarantee future results.
Clients remain fully responsible for all trading activities and regulatory compliance.

11. No Investment Advice
Information provided by Web3Listing.com is for business and operational purposes only.
Nothing contained on this website shall be considered:
• Investment Advice
• Financial Advice
• Legal Advice
• Tax Advice
• Securities Advice
• Trading Advice
Users should seek independent professional advice before making any financial, legal, tax, or investment decisions.

12. No Guarantee of Results
Web3Listing.com does not guarantee:
• Exchange Listings
• CoinMarketCap Approval
• CoinGecko Approval
• Wallet Listings
• Audit Certifications
• Media Publications
• Trending Rankings
• Trading Volume
• Investor Participation
• Token Price Increases
• Fundraising Success
• Community Growth
• Revenue Generation
All services are provided on a best-effort basis.

13. Compliance Responsibility
Clients are solely responsible for ensuring that their projects comply with:
• Local Laws
• International Regulations
• AML Requirements
• KYC Requirements
• Securities Regulations
• Tax Obligations
• Consumer Protection Laws
Web3Listing.com reserves the right to reject, suspend, or terminate services for any project suspected of fraud, scams, illegal activity, sanctions violations, money laundering, market manipulation, or regulatory violations.

14. Limitation of Liability
Under no circumstances shall Web3Listing.com, its owners, employees, contractors, affiliates, partners, or service providers be liable for any direct, indirect, incidental, consequential, special, regulatory, financial, trading, or business losses arising from the use of our services.
The maximum liability of Web3Listing.com shall be limited to the amount paid by the client for the specific service in question.

15. Acceptance of Terms
By accessing our website, submitting information, purchasing services, or engaging with our platform, you acknowledge that you have read, understood, and agreed to this disclaimer and all related policies, terms, and conditions.',
  updated_at = NOW()
WHERE slug = 'disclaimer';
