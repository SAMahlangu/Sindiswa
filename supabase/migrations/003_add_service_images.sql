-- Add image_url column to services table
ALTER TABLE services ADD COLUMN image_url TEXT;

-- Update RLS policy to allow image_url updates
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Services are publicly readable" ON services;
DROP POLICY IF EXISTS "Admin can create services" ON services;
DROP POLICY IF EXISTS "Admin can update services" ON services;
DROP POLICY IF EXISTS "Admin can delete services" ON services;

-- Create simplified policies
CREATE POLICY "Services are publicly readable" ON services
  FOR SELECT USING (true);

CREATE POLICY "Admin can modify services" ON services
  FOR ALL USING (true);
