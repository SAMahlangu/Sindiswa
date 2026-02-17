# Database Integration Guide - Step by Step

## Phase 1: Create Supabase Project ✅

### Step 1.1: Create Account & Project
1. Go to https://supabase.com
2. Click "Sign Up" and create account
3. Click "New Project"
4. Fill in:
   - **Name**: `sindiswa-nails` (or your preferred name)
   - **Region**: Select "South Africa" if available, otherwise "Dublin"
   - **Password**: Create a strong password and save it
5. Click "Create new project" and wait 2-3 minutes

### Step 1.2: Verify Project Created
- You should see your project in the dashboard
- Note your Project ID (visible in URL bar)
- Status should show "Active" (green)

---

## Phase 2: Setup Database Schema ✅

### Step 2.1: Access SQL Editor
1. In your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2.2: Run Initial Schema
1. Open file: `supabase/migrations/001_init_schema.sql`
2. Copy ALL the SQL code
3. Paste into Supabase SQL Editor
4. Click **Run** (blue button)
5. Wait for success message ✅

**What this creates:**
- `services` table - nail services with pricing
- `appointments` table - bookings
- `settings` table - business configuration
- `admin_users` table - admin accounts

### Step 2.3: Run Security Policies
1. Click **New Query** again
2. Open file: `supabase/migrations/002_rls_policies.sql`
3. Copy ALL the SQL code
4. Paste into new query
5. Click **Run**
6. Wait for success message ✅

**What this creates:**
- Row Level Security (RLS) policies
- Ensures data privacy and security

### Step 2.4: Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - ✅ services
   - ✅ appointments
   - ✅ settings
   - ✅ admin_users

---

## Phase 3: Get Your API Credentials ✅

### Step 3.1: Find Your Credentials
1. Go to **Settings** (left sidebar)
2. Click **API**
3. Under "Project API keys", copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Public Key** (long string starting with `eyJ...`)

### Step 3.2: Update .env.local
Edit file: `.env.local`

Replace placeholders with your credentials:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=mk_test_xxxx
VITE_PAYFAST_WEBHOOK_URL=http://localhost:5173
```

### Step 3.3: Save File
Save `.env.local` - your app will automatically reconnect!

---

## Phase 4: Add Sample Data ✅

### Step 4.1: Add Services (via SQL)
In Supabase **SQL Editor**, create new query:

```sql
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Gel Manicure', 'Professional gel manicure with polish', 199.99, 45),
('Gel Pedicure', 'Professional gel pedicure with polish', 249.99, 60),
('Acrylic Nails', 'Beautiful acrylic nails with design', 299.99, 90),
('Nail Art Design', 'Custom nail art on existing nails', 99.99, 30),
('Manicure & Pedicure Combo', 'Manicure and pedicure bundle', 399.99, 120),
('Shellac Removal', 'Professional shellac removal', 79.99, 20);
```

Click **Run** ✅

### Step 4.2: Add Business Settings
Create new query:

```sql
INSERT INTO settings (business_name, phone, email, timezone) VALUES
('Sindiswa Nail Tech', '+27123456789', 'bookings@sindiswa.co.za', 'Africa/Johannesburg');
```

Click **Run** ✅

### Step 4.3: Verify Data
1. Go to **Table Editor**
2. Click **services** table
3. You should see 6 nail services
4. Click **settings** table
5. You should see business info

---

## Phase 5: Test Database Connection ✅

### Step 5.1: Check App Connection
1. Ensure dev server is running: `npm run dev`
2. Open http://localhost:5173 (or 5174 if 5173 is in use)
3. You should see the booking system homepage

### Step 5.2: Check Browser Console for Errors
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for any error messages
4. If you see Supabase connection errors, check your credentials

### Step 5.3: Test Services Load
1. On the homepage, you should see the 6 nail services
2. Each service shows:
   - Service name
   - Price
   - Duration
   - Description
3. If services don't appear, check console for errors

---

## Phase 6: Test Booking Flow ✅

### Step 6.1: Create a Test Booking
1. Click "Book Now" on any service
2. Select a date (any future date)
3. Select a time slot
4. Enter test details:
   - Name: "Test Client"
   - Phone: "0123456789"
   - Email: "test@example.com"
5. Review booking summary
6. Click "Proceed to Payment"

### Step 6.2: Check Booking in Database
1. Go to Supabase **Table Editor**
2. Click **appointments** table
3. You should see your test booking with:
   - Status: "pending"
   - Your service details
   - Test client info

### Step 6.3: Test Admin Login
1. Go to http://localhost:5173/admin/login
2. Check what happens (may need to setup admin first)

---

## Phase 7: Setup Admin User ✅

### Step 7.1: Add Admin User via SQL
In Supabase **SQL Editor**, create new query:

```sql
INSERT INTO admin_users (email, password_hash, is_admin) VALUES
('admin@sindiswa.co.za', 'temp_hash_123', true);
```

**Note**: This is temporary. For production, use Supabase Auth.

### Step 7.2: Test Admin Login
1. Go to http://localhost:5173/admin/login
2. Try credentials

---

## Phase 8: Setup Supabase Auth (Optional but Recommended) ✅

### Step 8.1: Enable Email Auth
1. Go to **Authentication** (left sidebar)
2. Click **Providers**
3. Enable **Email** provider
4. Click **Save**

### Step 8.2: Create Admin Account
1. Go to **Users** tab
2. Click **Add user**
3. Email: `admin@sindiswa.co.za`
4. Password: create strong password
5. Click **Create user**

### Step 8.3: Test Login
1. Go to http://localhost:5173/admin/login
2. Use the admin email and password
3. You should be logged in!

---

## Troubleshooting

### Issue: "Database connection failed"
- ✅ Check `.env.local` has correct `VITE_SUPABASE_URL`
- ✅ Check `.env.local` has correct `VITE_SUPABASE_ANON_KEY`
- ✅ Check both values copied exactly (no extra spaces)
- ✅ Restart dev server: `npm run dev`

### Issue: "Services not loading"
- ✅ Check services table has data (go to Table Editor)
- ✅ Check browser console for SQL errors
- ✅ Ensure RLS policies were applied correctly

### Issue: "Can't create booking"
- ✅ Check appointments table exists
- ✅ Check no RLS errors in console
- ✅ Try same date + different time

### Issue: "Admin login not working"
- ✅ Check admin_users table has data
- ✅ If using Supabase Auth, check Users tab
- ✅ Check browser console for auth errors

---

## Next Steps After Integration

1. **Test Payment Integration** (PayFast setup - optional for now)
2. **Deploy to Vercel** (see SUPABASE_DEPLOYMENT_GUIDE.md)
3. **Configure Email Notifications** (optional enhancement)
4. **Setup Scheduled Functions** (cancel unpaid bookings)

---

## Important Notes

- 🔐 **Never commit `.env.local` to Git** - it contains secrets
- 💾 **Backup your database** before major changes
- 🛡️ **RLS policies** ensure only authorized access to data
- 📱 **Your app works offline** until it reconnects to Supabase

---

## Success Checklist

- ✅ Supabase project created
- ✅ Database schema created (001_init_schema.sql)
- ✅ Security policies applied (002_rls_policies.sql)
- ✅ API credentials in `.env.local`
- ✅ Sample services added
- ✅ Business settings added
- ✅ Services load on homepage
- ✅ Can create test booking
- ✅ Booking appears in database
- ✅ Admin login configured

---

**You're ready to use your booking system! 🎉**
