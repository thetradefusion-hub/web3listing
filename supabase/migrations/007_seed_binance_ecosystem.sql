-- Rich demo data for Binance Ecosystem Support service detail page preview
-- Run: npm run db:seed-binance

UPDATE services
SET
  name = 'Binance Ecosystem Support',
  description = 'We help you get your token listed and visible across the Binance ecosystem — from BSC network integration to PancakeSwap visibility, explorer updates, and ecosystem partner outreach.',
  demo_link = 'https://www.binance.com/en',
  proof_of_work = 'Our team has successfully supported 120+ BSC ecosystem listings including PancakeSwap pairs, BSCScan updates, and CoinMarketCap/CoinGecko integrations for meme and utility tokens.',
  proof_of_work_url = 'https://example.com/proof/binance-ecosystem',
  pricing_model = 'fixed',
  price = 499.00,
  service_fee = 0.00,
  commission_type = 'percentage',
  commission_value = 20,
  estimated_tat = '5 - 7 Days',
  payment_terms = '100% Advance',
  requires_third_party_ack = true,
  third_party_fee_note = 'Third-party platform fees may apply separately',
  badge = 'popular',
  logo_url = 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  overview = 'Binance Ecosystem Support is a comprehensive service designed to help Web3 projects establish a strong presence across the Binance Smart Chain (BSC) ecosystem. Our expert team handles the complete application process — from documentation and submission to follow-up with ecosystem partners — until your token achieves maximum visibility.',
  whats_included = '[
    "Listing on BSC Ecosystem",
    "Increase Token Visibility",
    "Boost Credibility & Trust",
    "Reach Millions of BSC Users",
    "24/7 Expert Support"
  ]'::jsonb,
  supported_platforms = '[
    "PancakeSwap",
    "CoinSniper",
    "Poocoin",
    "BSCScan",
    "BSCSniffer",
    "DappRadar"
  ]'::jsonb,
  process_steps = '[
    {"title": "Requirement Check", "description": "We review your token docs, contract, and ecosystem readiness."},
    {"title": "Document Review", "description": "Our team prepares and validates all submission materials."},
    {"title": "Submission Process", "description": "Applications submitted to relevant BSC ecosystem platforms."},
    {"title": "Follow-up & Communication", "description": "Active follow-up with partners until approval or feedback."},
    {"title": "Listing Confirmation", "description": "Final confirmation and handover with proof of completion."}
  ]'::jsonb,
  listing_type = 'Manual Submission',
  networks = 'BSC',
  refund_policy = 'Non-Refundable',
  required_documents = ARRAY[
    'Token contract address (BEP-20)',
    'Project website URL',
    'Logo (512x512 PNG, transparent background)',
    'Whitepaper or litepaper',
    'Social media links (Telegram, Twitter/X)',
    'Founder KYC (if required by platform)'
  ],
  faqs = '[
    {
      "question": "How long does Binance ecosystem listing take?",
      "answer": "Most projects are completed within 5-7 business days. Complex cases or third-party review delays may extend the timeline."
    },
    {
      "question": "Is Binance exchange listing included?",
      "answer": "This service covers BSC ecosystem visibility (PancakeSwap, explorers, trackers). Centralized exchange listing is a separate service."
    },
    {
      "question": "What if my application is rejected?",
      "answer": "We provide detailed feedback and one free resubmission round. Refunds are not available after work has started per our refund policy."
    },
    {
      "question": "Do you guarantee approval?",
      "answer": "No. Final approval depends on third-party platform policies. We maximize your chances with professional preparation and follow-up."
    }
  ]'::jsonb,
  terms_conditions = 'By ordering Binance Ecosystem Support, you acknowledge that third-party platforms (PancakeSwap, BSCScan, trackers, etc.) make independent approval decisions. TokenWeb3Listing provides preparation, submission, and follow-up services on a best-effort basis. Payment is 100% advance and non-refundable once work begins. You are responsible for accurate project information and legal compliance in your jurisdiction.'
WHERE slug = 'binance-ecosystem-support';

-- Demo completed orders for "Recent Successful Listings" section (agent test account)
DO $$
DECLARE
  v_service_id UUID;
  v_agent_id UUID;
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_service_id FROM services WHERE slug = 'binance-ecosystem-support';
  SELECT id INTO v_agent_id FROM profiles WHERE email = 'thetradefusion@gmail.com' LIMIT 1;

  IF v_service_id IS NULL OR v_agent_id IS NULL THEN
    RAISE NOTICE 'Skipping demo orders: service or agent not found';
    RETURN;
  END IF;

  -- Skip if demo orders already seeded
  IF EXISTS (
    SELECT 1 FROM orders o
    WHERE o.service_id = v_service_id
      AND o.requirements = '__seed_binance_demo__'
  ) THEN
    RAISE NOTICE 'Demo orders already exist';
    RETURN;
  END IF;

  -- Project: BabyDoge
  INSERT INTO projects (
    agent_id, project_name, token_name, token_symbol, blockchain_network,
    website_url, contract_address, status
  ) VALUES (
    v_agent_id, 'BabyDoge Coin', 'BabyDoge Coin', 'BABYDOGE', 'BSC',
    'https://babydoge.com', '0x0000000000000000000000000000000000000001', 'approved'
  ) RETURNING id INTO v_cat_id;

  INSERT INTO orders (agent_id, project_id, service_id, status, requirements, third_party_ack, updated_at)
  VALUES (v_agent_id, v_cat_id, v_service_id, 'completed', '__seed_binance_demo__', true, '2025-05-15T10:00:00Z');

  -- Project: Floki
  INSERT INTO projects (
    agent_id, project_name, token_name, token_symbol, blockchain_network,
    website_url, contract_address, status
  ) VALUES (
    v_agent_id, 'Floki Inu', 'Floki Inu', 'FLOKI', 'BSC',
    'https://floki.com', '0x0000000000000000000000000000000000000002', 'approved'
  ) RETURNING id INTO v_cat_id;

  INSERT INTO orders (agent_id, project_id, service_id, status, requirements, third_party_ack, updated_at)
  VALUES (v_agent_id, v_cat_id, v_service_id, 'completed', '__seed_binance_demo__', true, '2025-05-15T10:00:00Z');

  -- Project: SafeMoon
  INSERT INTO projects (
    agent_id, project_name, token_name, token_symbol, blockchain_network,
    website_url, contract_address, status
  ) VALUES (
    v_agent_id, 'SafeMoon', 'SafeMoon', 'SAFEMOON', 'BSC',
    'https://safemoon.com', '0x0000000000000000000000000000000000000003', 'approved'
  ) RETURNING id INTO v_cat_id;

  INSERT INTO orders (agent_id, project_id, service_id, status, requirements, third_party_ack, updated_at)
  VALUES (v_agent_id, v_cat_id, v_service_id, 'completed', '__seed_binance_demo__', true, '2025-05-14T10:00:00Z');

  -- Project: Pepe
  INSERT INTO projects (
    agent_id, project_name, token_name, token_symbol, blockchain_network,
    website_url, contract_address, status
  ) VALUES (
    v_agent_id, 'Pepe Token', 'Pepe', 'PEPE', 'BSC',
    'https://pepe.vip', '0x0000000000000000000000000000000000000004', 'approved'
  ) RETURNING id INTO v_cat_id;

  INSERT INTO orders (agent_id, project_id, service_id, status, requirements, third_party_ack, updated_at)
  VALUES (v_agent_id, v_cat_id, v_service_id, 'completed', '__seed_binance_demo__', true, '2025-05-13T10:00:00Z');

  RAISE NOTICE 'Seeded 4 demo completed orders for Recent Successful Listings';
END $$;
