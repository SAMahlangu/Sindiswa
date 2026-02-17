-- Create services table
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id BIGSERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_email VARCHAR(255),
  service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time VARCHAR(5) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'completed')),
  payfast_reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(date, time)
);

-- Create settings table
CREATE TABLE settings (
  id BIGSERIAL PRIMARY KEY,
  business_name VARCHAR(255) DEFAULT 'Nail Tech Studio',
  working_hours_start INTEGER DEFAULT 9,
  working_hours_end INTEGER DEFAULT 17,
  deposit_percentage DECIMAL(5, 2) DEFAULT 30.00,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'Africa/Johannesburg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table
CREATE TABLE email_logs (
  id BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(appointment_id, email_type)
);

-- Create payment_logs table
CREATE TABLE payment_logs (
  id BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  payfast_reference VARCHAR(255),
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'ZAR',
  status VARCHAR(50),
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_appointments_payfast_ref ON appointments(payfast_reference);
CREATE INDEX idx_email_logs_appointment_id ON email_logs(appointment_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_payment_logs_appointment_id ON payment_logs(appointment_id);
CREATE INDEX idx_payment_logs_payfast_ref ON payment_logs(payfast_reference);

-- Insert default services
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Gel Manicure', 'Professional gel manicure with polish', 199.99, 45),
('Gel Pedicure', 'Professional gel pedicure with polish', 249.99, 60),
('Acrylic Nails', 'Beautiful acrylic nails with design', 299.99, 90),
('Nail Art Design', 'Custom nail art on existing nails', 99.99, 30),
('Manicure & Pedicure Combo', 'Manicure and pedicure bundle', 399.99, 120),
('Shellac Removal', 'Professional shellac removal', 79.99, 20);

-- Insert default settings
INSERT INTO settings (business_name, phone, email, timezone) VALUES
('Sindiswa Nail Tech', '+27123456789', 'bookings@sindiswa.co.za', 'Africa/Johannesburg');
