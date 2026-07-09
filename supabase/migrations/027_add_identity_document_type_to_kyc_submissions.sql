ALTER TABLE kyc_submissions
ADD COLUMN IF NOT EXISTS identity_document_type TEXT;

UPDATE kyc_submissions
SET identity_document_type = COALESCE(identity_document_type, 'Passport')
WHERE identity_document_type IS NULL;
