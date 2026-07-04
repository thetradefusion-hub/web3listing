-- Sync Terms & Conditions with June 2026 full policy text
UPDATE legal_pages
SET
  title = 'Terms & Conditions',
  content = 'TERMS & CONDITIONS
TokenWeb3Listing.com
Last Updated: June 2026

1. Acceptance of Terms
By accessing TokenWeb3Listing.com, creating an account, submitting information, purchasing services, or using our platform, you agree to comply with these Terms & Conditions.
If you do not agree, you must discontinue use of the platform.

2. Services
TokenWeb3Listing.com provides:
• Exchange Listing Consulting
• CoinMarketCap & CoinGecko Support
• Market Making Services
• Liquidity & Token Lock Services
• Blockchain Explorer Updates
• Wallet Integration Support
• Crypto PR Distribution
• Influencer Marketing
• Community Management
• Smart Contract Audit Coordination
• AI Support Solutions
• Related Web3 Services
All services are provided on a best-effort basis.

3. No Guarantee
We do not guarantee:
• Exchange Listing Approval
• CoinMarketCap Approval
• CoinGecko Approval
• Wallet Listing Approval
• Media Publication Approval
• Trending Rankings
• Trading Volume
• Fundraising Success
• Token Price Appreciation
• Community Growth Results
Final decisions remain under the control of third-party providers.

4. Client Responsibilities
Clients must:
• Provide accurate information.
• Submit valid documentation.
• Comply with applicable laws.
• Respond to requests promptly.
• Maintain project legitimacy.
Any delay caused by the client may affect delivery timelines.

5. Prohibited Projects
We reserve the right to reject or terminate services for:
• Scam Projects
• Fraudulent Activities
• Money Laundering Activities
• Sanctioned Entities
• Terrorism Financing
• Illegal Securities Offerings
• Adult Content Projects
• Gambling Projects (where restricted)
• Projects violating applicable regulations

6. Payments
Full payment is required before work begins.
Certain enterprise services may require milestone payments.
Payments are non-refundable except where specifically covered by the Refund Policy.
Crypto payments are considered completed after blockchain confirmation.

7. Intellectual Property
Clients retain ownership of their projects and submitted materials.
TokenWeb3Listing.com retains ownership of its website, branding, systems, reports, documentation, and proprietary processes.

8. Limitation of Liability
The maximum liability of TokenWeb3Listing.com shall not exceed the amount paid for the specific service purchased.
We shall not be liable for:
• Financial Losses
• Trading Losses
• Regulatory Actions
• Token Price Changes
• Exchange Decisions
• Publication Decisions
• Audit Results

9. Termination
We reserve the right to suspend or terminate any account for:
• Fraud
• Abuse
• Chargeback Fraud
• AML Violations
• Policy Violations

10. Governing Law
Any disputes shall be governed by the laws applicable to the jurisdiction in which the company is registered.
Arbitration and mediation may be required before court proceedings.',
  updated_at = NOW()
WHERE slug = 'terms';
