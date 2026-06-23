-- Storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('kyc-documents', 'kyc-documents', false, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('project-assets', 'project-assets', false, 5242880, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('deliverables', 'deliverables', false, 52428800, ARRAY['image/jpeg','image/png','application/pdf','application/zip']),
  ('payment-proofs', 'payment-proofs', false, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('withdrawal-proofs', 'withdrawal-proofs', false, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf'])
ON CONFLICT (id) DO NOTHING;
