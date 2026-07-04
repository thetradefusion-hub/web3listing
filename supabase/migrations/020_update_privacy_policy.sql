-- Sync Privacy Policy with June 2026 full policy text
UPDATE legal_pages
SET
  title = 'Privacy Policy',
  content = 'PRIVACY POLICY
TokenWeb3Listing.com
Last Updated: June 2026

1. Introduction
TokenWeb3Listing.com respects your privacy and is committed to protecting your personal and business information.
This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform.

2. Information We Collect
Personal Information
• Full Name
• Email Address
• Phone Number
• Telegram Username
• Company Name
• Billing Information
Business Information
• Project Name
• Website
• Whitepaper
• Social Media Links
Blockchain Information
• Exchange Information
Technical Information
• IP Address
• Browser Information
• Device Information
• Login Activity
• Cookies & Analytics Data

3. How We Use Information
We may use information for:
• Account Management
• Service Delivery
• Customer Support
• Payment Processing
• Compliance Verification
• Security Monitoring
• Marketing Communications
• Platform Improvement

4. Information Sharing
We do not sell personal data.
Information may be shared with:
• Service Providers
• Audit Firms
• Exchanges
• Wallet Providers
• Payment Processors
• Legal Authorities when required
Only information necessary for service delivery will be shared.

5. Data Security
We implement:
• SSL Encryption
• Access Controls
• Role-Based Permissions
• Secure Storage
• Activity Monitoring
However, no system can guarantee 100% security.

6. Data Retention
We may retain information for:
• Service Records
• Accounting Requirements
• Legal Compliance
• Fraud Prevention
Data may be retained even after account closure where legally required.

7. User Rights
Users may request:
• Access to Information
• Correction of Information
• Account Closure
• Data Deletion (where legally permitted)

8. Policy Updates
TokenWeb3Listing.com may update this policy without prior notice.
Continued use of the platform constitutes acceptance of updated policies.',
  updated_at = NOW()
WHERE slug = 'privacy';
