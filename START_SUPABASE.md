# 🚀 Quick Start - Supabase Edition

Your booking system has been successfully migrated to **Supabase**! Here's what you need to do next.

## ⚡ 5-Minute Quick Start (Local Testing)

### 1. Install Dependencies
```bash
npm install
```
This installs Supabase client and all dependencies.

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Add Dummy Credentials
Edit `.env.local` and add placeholder values (any string works for local testing):
```
VITE_SUPABASE_URL=https://dummy.supabase.co
VITE_SUPABASE_ANON_KEY=dummy_key_12345
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=test_key
VITE_PAYFAST_WEBHOOK_URL=https://localhost:5173
```

### 4. Run Locally
```bash
npm run dev
```
Open http://localhost:5173 in your browser - you should see the booking system!

---

## 📋 Full Deployment (Step by Step)

### **STEP 1: Create Supabase Project** (10 minutes)
1. Go to https://supabase.com and create account
2. Click "New Project"
3. Fill in:
   - Name: `sindiswa-nails`
   - Region: South Africa (or Dublin)
   - Password: create strong password
4. Click Create and wait 2-3 minutes

### **STEP 2: Setup Database** (5 minutes)
1. In Supabase dashboard, go to **SQL Editor**
2. Create new query
3. Copy entire contents of `supabase/migrations/001_init_schema.sql`
4. Paste and click **Run**
5. Wait for success message

### **STEP 3: Setup Security Policies** (5 minutes)
1. In SQL Editor, create new query
2. Copy entire contents of `supabase/migrations/002_rls_policies.sql`
3. Paste and click **Run**
4. Wait for success - RLS is now enabled

### **STEP 4: Get Your Credentials** (2 minutes)
1. Go to **Settings > API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`
3. Go to **Settings > Database** to confirm password

### **STEP 5: Configure Environment** (2 minutes)
Edit `.env.local` with your real credentials:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_PAYFAST_MERCHANT_ID=your_id
VITE_PAYFAST_MERCHANT_KEY=your_key
VITE_PAYFAST_WEBHOOK_URL=https://your-domain.vercel.app/payfast-webhook
```

### **STEP 6: Deploy Edge Functions** (5 minutes)
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy functions
supabase functions deploy payfast-webhook --project-id YOUR_PROJECT_ID
supabase functions deploy cancel-unpaid-bookings --project-id YOUR_PROJECT_ID
supabase functions deploy get-revenue-report --project-id YOUR_PROJECT_ID
```

### **STEP 7: Configure PayFast** (5 minutes)
1. Log into PayFast merchant dashboard
2. Go to Settings > Webhooks
3. Add webhook URL:
   ```
   https://YOUR_PROJECT.supabase.co/functions/v1/payfast-webhook
   ```
4. In Supabase **Settings > Environment Variables**, add:
   - `PAYFAST_MERCHANT_ID`: Your ID from PayFast
   - `PAYFAST_MERCHANT_KEY`: Your key from PayFast

### **STEP 8: Deploy to Vercel** (10 minutes)
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Supabase migration complete"
   git push origin main
   ```
2. Go to https://vercel.com and sign in
3. Click "Add New > Project"
4. Select your GitHub repository
5. In Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PAYFAST_MERCHANT_ID`
   - `VITE_PAYFAST_MERCHANT_KEY`
   - `VITE_PAYFAST_WEBHOOK_URL`
6. Click **Deploy**
7. Wait 2-5 minutes for build to complete

### **STEP 9: Test** (5 minutes)
1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Try booking a service
3. Go through to PayFast payment page
4. Use PayFast test card: `4111 1111 1111 1111`
5. Check admin dashboard - booking should appear!

---

## 📂 What Changed

| File | Change | Status |
|------|--------|--------|
| `src/firebase/config.js` | Firebase → Supabase client | ✅ Done |
| `src/context/AuthContext.jsx` | Firebase Auth → Supabase Auth | ✅ Done |
| `src/services/api.js` | Firestore → Supabase queries | ✅ Done |
| `package.json` | Firebase → @supabase/supabase-js | ✅ Done |
| `.env.example` | Firebase vars → Supabase vars | ✅ Done |
| **supabase/** | NEW folder with migrations & functions | ✅ New |

✅ Everything else (React pages, components, styling) is UNCHANGED!

---

## 🗂️ Key Files Reference

| File | Purpose |
|------|---------|
| `SUPABASE_DEPLOYMENT_GUIDE.md` | 📖 Detailed deployment instructions |
| `MIGRATION_COMPLETE.md` | 📊 What was changed & why |
| `MIGRATION_GUIDE.md` | 🗺️ Architecture overview |
| `supabase/migrations/001_init_schema.sql` | 🗄️ Database structure |
| `supabase/migrations/002_rls_policies.sql` | 🔐 Security rules |
| `supabase/functions/` | ⚡ Serverless functions |

---

## 🆘 Common Issues

### "npm install" fails
**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Supabase connection fails
**Solution**: 
- Check `.env.local` has correct URL and key
- Verify Supabase project is active
- Try `npm run dev` again

### PayFast webhook not working
**Solution**:
- Confirm webhook URL in PayFast settings
- Check Supabase environment variables include PayFast credentials
- Review Edge Function logs in Supabase dashboard

### "VITE_SUPABASE_URL is undefined"
**Solution**: 
- Ensure `.env.local` exists and has correct variables
- Restart dev server: `npm run dev`
- Check `.env.local` is in project root, not subdirectory

---

## 🎯 What This System Does

✅ **Clients can:**
- Browse available nail services
- Select date & time
- Enter contact info
- Pay via PayFast (South Africa)
- Receive confirmation

✅ **Admins can:**
- View all bookings
- Manage services
- Track revenue
- See booking statistics

---

## 📞 Support

- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **PayFast**: https://payfast.io/integration/
- **Vercel**: https://vercel.com/docs

---

## ✨ Next Steps - Pick One

### Option A: Test Locally First (Recommended)
```bash
npm install
cp .env.example .env.local
# Add dummy values to .env.local
npm run dev
# Test at http://localhost:5173
```

### Option B: Go Straight to Production
1. Create Supabase project (Step 1-2)
2. Get credentials (Step 4)
3. Update `.env.local`
4. Deploy to Vercel (Step 8)
5. Test live (Step 9)

### Option C: Get Help
See **SUPABASE_DEPLOYMENT_GUIDE.md** for detailed step-by-step instructions with screenshots explained.

---

**🎉 Your booking system is ready! Choose your path above and get started!**
