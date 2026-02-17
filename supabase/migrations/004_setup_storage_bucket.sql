-- Storage setup for service images
-- This migration sets up the storage bucket for service image uploads

-- Note: This needs to be run manually in Supabase dashboard:
-- 1. Go to Storage in your Supabase project
-- 2. Create a new bucket named "service-images"
-- 3. Set it to Public so images can be accessed
-- 4. Upload settings:
--    - File size limit: 10MB
--    - Allowed MIME types: image/*

-- After creating the bucket, the RLS policy below will be applied:

-- For authenticated users (admins) to upload images:
CREATE POLICY "Admins can upload service images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'service-images' AND
  auth.role() = 'authenticated'
);

-- For public to view service images:
CREATE POLICY "Public can view service images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

-- For admins to delete images:
CREATE POLICY "Admins can delete service images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'service-images' AND
  auth.role() = 'authenticated'
);
