-- Point account manager Telegram to @Web3ListingOfficial
UPDATE account_managers
SET
  telegram_id = '@Web3ListingOfficial',
  telegram_link = 'https://t.me/Web3ListingOfficial'
WHERE telegram_id ILIKE '%blackbox%'
   OR telegram_link ILIKE '%blackbox%'
   OR telegram_id ILIKE '%blackbox1920%'
   OR telegram_link ILIKE '%blackbox1920%';
