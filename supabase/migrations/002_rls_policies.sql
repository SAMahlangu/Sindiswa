-- Enable RLS on tables (but not admin tables to avoid recursion)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Services: Public can read, anyone can write (for now)
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert services" ON services
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update services" ON services
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete services" ON services
  FOR DELETE USING (true);

-- Settings: Public can read, anyone can write
CREATE POLICY "Settings are viewable by everyone" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update settings" ON settings
  FOR UPDATE USING (true) WITH CHECK (true);

-- Appointments: Anyone can create, anyone can read/update/delete
CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view appointments" ON appointments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update appointments" ON appointments
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete appointments" ON appointments
  FOR DELETE USING (true);
