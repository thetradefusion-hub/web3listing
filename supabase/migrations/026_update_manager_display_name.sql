-- Rename default account manager display name
UPDATE account_managers
SET name = 'Listing Manager'
WHERE name ILIKE 'Abhay'
   OR name ILIKE '%Abhay%';
