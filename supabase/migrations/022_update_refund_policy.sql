-- Sync Refund Policy with June 2026 full policy text
UPDATE legal_pages
SET
  title = 'Refund Policy',
  content = 'REFUND POLICY
TokenWeb3Listing.com
Last Updated: June 2026

1. Eligible Refund Cases
Refunds may be approved when:
• Payment is duplicated.
• Service cannot be delivered.
• Service has not started within the agreed timeline.
• Order is cancelled by TokenWeb3Listing.com.

2. Non-Refundable Cases
Refunds will NOT be provided when:
• Third-party platforms reject applications.
• Exchange listing applications are declined.
• CoinMarketCap or CoinGecko applications are rejected.
• Wallet integrations are rejected.
• Media publications are declined.
• Audit providers reject projects.
• Clients provide incorrect information.
• Work has already started.
• Work has been completed.

3. Partial Refunds
If partial work has been completed, a partial refund may be issued after deducting operational and service costs.

4. Refund Processing
Approved refunds will be processed within:
• 7–14 Business Days
The original payment method may be used whenever possible.

5. Crypto Payments
Due to blockchain volatility and transaction costs, crypto refunds may be processed in equivalent value rather than original token amounts.',
  updated_at = NOW()
WHERE slug = 'refund';
