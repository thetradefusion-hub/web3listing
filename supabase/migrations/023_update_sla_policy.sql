-- Sync Service Level Agreement with June 2026 full policy text
UPDATE legal_pages
SET
  title = 'Service Level Agreement (SLA)',
  content = 'SERVICE LEVEL AGREEMENT (SLA)
TokenWeb3Listing.com
Last Updated: June 2026

1. Objective
This SLA defines expected service standards and response times.

2. Support Channels
• Ticket System
• Telegram Support
• Email Support
• Account Manager Support

3. Response Times
Standard Support
• Response Time: Within 24 Hours
Priority Support
• Response Time: Within 12 Hours
Enterprise Support
• Response Time: Within 4 Hours

4. Service Delivery Timelines
Standard Services
• Expected Delivery: 24–72 Hours
Enterprise Services
• Timeline: Custom Based on Scope
Third-Party Services
• Timeline: Dependent upon External Providers

5. Service Status Updates
Clients will receive:
• Order Confirmation
• Progress Updates
• Completion Notification
• Delay Notification (if applicable)

6. Client Responsibilities
Clients must:
• Submit complete information.
• Respond to requests promptly.
• Provide required documents.
• Maintain communication.
Failure to do so may extend delivery timelines.

7. Force Majeure
TokenWeb3Listing.com shall not be responsible for delays caused by:
• Exchange Delays
• Wallet Provider Delays
• Media Publication Delays
• Government Actions
• Network Outages
• Natural Disasters
• Third-Party Failures

8. Service Credits
Service credits may be considered only when delays are directly caused by TokenWeb3Listing.com and not by external providers or client actions.',
  updated_at = NOW()
WHERE slug = 'sla';
