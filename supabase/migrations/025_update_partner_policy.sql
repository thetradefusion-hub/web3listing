-- Sync Partner & Affiliate Policy with June 2026 full policy text
UPDATE legal_pages
SET
  title = 'Partner & Affiliate Policy',
  content = 'PARTNER & AFFILIATE POLICY
TokenWeb3Listing.com
Last Updated: June 2026

1. Commission Structure
Agents may earn commissions ranging from 10% to 30% depending on service category and agreement level.

2. Commission Eligibility
Commissions are earned only when:
• Client payment is successfully received.
• Order is verified.
• Refund period has expired.

3. Commission Withdrawal
Minimum Withdrawal
• $10 USD
Supported Methods
• USDT
• Bank Transfer

4. Fraud Prevention
Agents may not
• Create fake orders.
• Use misleading marketing.
• Impersonate official partners.
• Make false guarantees.
Violation may result in
• Account Suspension
• Commission Cancellation
• Permanent Ban

5. Independent Status
Agents operate as independent contractors and are not employees, representatives, or legal partners of TokenWeb3Listing.com.
Agents are responsible for their own taxes, regulatory obligations, and local compliance requirements.

6. Marketing Rules
Agents must not claim:
• Guaranteed Listings
• Guaranteed Publications
• Guaranteed Trending
• Official Partnerships
unless explicitly authorized in writing.',
  updated_at = NOW()
WHERE slug = 'partner-policy';
