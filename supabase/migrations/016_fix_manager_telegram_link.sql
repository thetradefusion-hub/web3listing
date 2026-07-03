UPDATE account_managers
SET
  telegram_id = '@blackbox@1920',
  telegram_link = 'https://t.me/blackbox%401920'
WHERE telegram_id ILIKE '%blackbox%'
   OR telegram_id ILIKE '%Abhay_TWL%'
   OR telegram_link ILIKE '%blackbox%'
   OR telegram_link ILIKE '%Abhay_TWL%';
