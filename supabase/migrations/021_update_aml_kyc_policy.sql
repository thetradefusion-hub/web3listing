-- Sync AML & KYC Policy with June 2026 full policy text
UPDATE legal_pages
SET
  title = 'AML & KYC Policy',
  content = 'AML & KYC POLICY
TokenWeb3Listing.com
Last Updated: June 2026

1. Purpose
TokenWeb3Listing.com is committed to preventing:
• Money Laundering
• Terrorist Financing
• Fraud
• Financial Crimes
• Sanctions Violations

2. KYC Requirements
We reserve the right to request:
Individual Verification
• Government ID
• Passport
• Driving License
• Proof of Address
• Selfie Verification
Business Verification
• Certificate of Incorporation
• Company Registration Documents
• Shareholder Information
• Director Information
• Business Address Verification

3. Enhanced Due Diligence
Additional verification may be required for:
• Large Transactions
• High-Risk Jurisdictions
• Politically Exposed Persons
• Complex Ownership Structures

4. Restricted Activities
We do not support projects related to:
• Terrorism Financing
• Sanctioned Entities
• Fraud Schemes
• Ponzi Schemes
• Scam Projects
• Illegal Securities Offerings
• Money Laundering Activities

5. Transaction Monitoring
We reserve the right to:
• Review Transactions
• Request Additional Information
• Suspend Accounts
• Reject Transactions
• Report Suspicious Activity

6. Compliance Cooperation
We may cooperate with:
• Financial Authorities
• Regulatory Agencies
• Law Enforcement
• Courts and Government Bodies
Where legally required.

7. Right to Refuse Service
TokenWeb3Listing.com reserves the right to refuse any client, project, transaction, or relationship without explanation if compliance concerns exist.',
  updated_at = NOW()
WHERE slug = 'aml-kyc';
