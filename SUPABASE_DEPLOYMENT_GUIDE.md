# Supabase Deployment Guide - Sindiswa Nail Tech Booking System

## Overview
This guide walks you through deploying the Sindiswa Nail Tech booking system using Supabase (PostgreSQL + Auth + Edge Functions) and hosting on Vercel.

**Tech Stack:**
- Frontend: React 18.2.0 + Vite (hosted on Vercel)
- Backend: Supabase (PostgreSQL + Auth + Edge Functions)
- Payment: PayFast (South African gateway)

---

## Prerequisites

1. **Supabase Account** - Create at https://supabase.com
2. **Vercel Account** - Create at https://vercel.com
3. **PayFast Account** - Merchant account at https://www.payfast.co.za
4. **Git** - Version control
5. **Node.js** - Version 18+ with npm

---

## Step 1: Setup Supabase Project

### 1.1 Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `sindiswa-nails`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: `Africa (South Africa)` if available, otherwise `Europe (Dublin)`
4. Click "Create new project" and wait 2-3 minutes for setup

### 1.2 Get Project Credentials
Once project is created:
1. Go to **Settings > API**
2. Note the following:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)
   - **Service Role Secret Key** (save securely, never share)
3. Go to **Settings > Database**
   - Note the **Database Password** (you created this)

### 1.3 Create Database Schema
1. In Supabase console, go to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `supabase/migrations/001_init_schema.sql`
4. Paste into SQL editor and click **Run**
5. Wait for confirmation - all 6 tables created

### 1.4 Setup Row Level Security (RLS)
1. In **SQL Editor**, create a new query
2. Copy the entire contents of `supabase/migrations/002_rls_policies.sql`
3. Paste and click **Run**
4. RLS policies are now enabled

### 1.5 Setup Email Notifications (Optional but Recommended)
To enable booking confirmations and reminders:
1. Go to **Settings > Email Templates**
2. Create custom templates or integrate with SendGrid/Resend:
   - **Resend** (recommended for South Africa): https://resend.com
   - Get your API key and update the Edge Function

---

## Step 2: Deploy Edge Functions

### 2.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 2.2 Login to Supabase CLI
```bash
supabase login
```

### 2.3 Deploy PayFast Webhook Function
```bash
supabase functions deploy payfast-webhook --project-id your_project_id
```

### 2.4 Deploy Cancel Unpaid Bookings Function
```bash
supabase functions deploy cancel-unpaid-bookings --project-id your_project_id
```

### 2.5 Deploy Revenue Report Function
```bash
supabase functions deploy get-revenue-report --project-id your_project_id
```

### 2.6 Setup Scheduled Tasks
PayFast webhook is triggered by PayFast notifications (real-time).

For cancelling unpaid bookings hourly, set up a cron job:
1. Go to **Database > Webhooks** (if available in your Supabase tier)
2. OR use a third-party cron service like EasyCron:
   - URL: `https://your-project.supabase.co/functions/v1/cancel-unpaid-bookings`
   - Method: POST
   - Schedule: Every hour

---

## Step 3: Setup PayFast Integration

### 3.1 Get PayFast Credentials
1. Log into PayFast merchant account
2. Go to **Settings > API Credentials**
3. Note:
   - **Merchant ID**
   - **Merchant Key**

### 3.2 Configure PayFast Webhook
1. In PayFast dashboard: **Settings > Webhooks**
2. Add webhook URL:
   ```
   https://your-project.supabase.co/functions/v1/payfast-webhook
   ```
3. Select events: Payment Status Change
4. Add environment variables to Edge Function (see Step 2.3)

### 3.3 Add PayFast Credentials to Supabase
1. Go to **Settings > Environment Variables**
2. Add:
   - `PAYFAST_MERCHANT_ID`: Your merch ID from PayFast
   - `PAYFAST_MERCHANT_KEY`: Your merchant key from PayFast

---

## Step 4: Setup Authentication

### 4.1 Enable Auth Providers (Optional)
1. Go to **Authentication > Providers**
2. Enable providers for admin login:
   - **Email**: Keep enabled (default)
   - **Google** (optional): Users can login with Google
   - **WhatsApp** (optional): For South Africa

### 4.2 Configure Auth Settings
1. **Authentication > URL Configuration**
2. Add allowed redirect URLs:
   ```
   http://localhost:5173
   https://your-site.vercel.app
   ```

### 4.3 Create Admin Users
1. Go to **SQL Editor** and run:
```sql
INSERT INTO admin_users (email, is_admin) VALUES
('your_email@example.com', true);
```

---

## Step 5: Configure React Application

### 5.1 Setup Environment Variables
1. Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Edit `.env.local` and fill in:
\`\`\`
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_from_step_1.2
VITE_PAYFAST_MERCHANT_ID=your_merchant_id_from_step_3.1
VITE_PAYFAST_MERCHANT_KEY=your_merchant_key_from_step_3.1
VITE_PAYFAST_WEBHOOK_URL=https://your-project.supabase.co/functions/v1/payfast-webhook
\`\`\`

### 5.2 Test Locally
\`\`\`bash
npm install
npm run dev
\`\`\`
Visit `http://localhost:5173` - you should see the booking system

---

## Step 6: Deploy to Vercel

### 6.1 Push Code to GitHub
\`\`\`bash
git add .
git commit -m "Supabase migration complete"
git push origin main
\`\`\`

### 6.2 Connect Vercel to GitHub
1. Go to https://vercel.com and sign in
2. Click **Add New > Project**
3. Select your GitHub repository
4. Click **Import**

### 6.3 Configure Environment Variables
1. In Vercel project settings: **Settings > Environment Variables**
2. Add the same variables from `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PAYFAST_MERCHANT_ID`
   - `VITE_PAYFAST_MERCHANT_KEY`
   - `VITE_PAYFAST_WEBHOOK_URL`

### 6.4 Deploy
1. Click **Deploy** button
2. Wait for build and deployment to complete
3. Access your site at `https://your-project.vercel.app`

---

## Step 7: Post-Deployment Configuration

### 7.1 Update PayFast Webhook URL
In PayFast settings, update the webhook URL to your production domain:
```
https://your-project.vercel.app/payfast-webhook
```

### 7.2 Test The Booking Flow
1. **Book Appointment**: Go to site, select service, date, time
2. **Make Payment**: Click "Pay Now" - should redirect to PayFast
3. **PayFast Test Mode**: Use PayFast's test account credentials
   - Test card: `4111 1111 1111 1111`
4. **Complete Payment**: You should see confirmation page
5. **Check Admin Dashboard**: Login at `/admin` with your email

### 7.3 Monitor Revenue
1. Go to **Admin Dashboard > Revenue**
2. Should show today's and historical bookings

---

## Troubleshooting

### Issue: "Authentication fails"
**Solution**: Verify Supabase URL and Anon Key are correct in `.env.local`

### Issue: "Appointments not saving"
**Solution**: 
1. Check RLS policies are enabled: `SELECT tablename FROM pg_tables WHERE schemaname='public'`
2. Verify table names match API calls (snake_case in DB, camelCase in API)

### Issue: "PayFast webhook not firing"
**Solution**: 
1. Check webhook URL in PayFast settings matches Edge Function URL
2. Verify PayFast merchant credentials in Supabase env vars
3. Check Edge Function logs: `supabase functions list --project-id your_project_id`

### Issue: "Vercel deployment fails"
**Solution**: 
1. Check build logs: `npm run build` locally
2. Verify all environment variables are set
3. Check Node version: `node --version` (should be 18+)

---

## Maintenance

### Regular Tasks
- **Weekly**: Check revenue reports
- **Monthly**: Review unpaid bookings (cancelled after 1 hour)
- **Monthly**: Backup Supabase database (Settings > Backups)
- **As needed**: Update admin users in SQL Editor

### Monitoring
- **Supabase**: Monitor database size and API rate limits (Settings > Usage)
- **Vercel**: Check deployment status and error logs
- **PayFast**: Reconcile transactions daily

### Updates
To update the booking system:
1. Pull latest code
2. Test locally: `npm run dev`
3. Push to GitHub
4. Vercel auto-deploys

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **PayFast API**: https://www.payfast.co.za/l/library/download/documentation
- **Vercel Docs**: https://vercel.com/docs

---

## Environment Variables Reference

| Variable | Source | Example |
|----------|--------|---------|
| `VITE_SUPABASE_URL` | Supabase Settings > API | `https://abcde.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Settings > API | `eyJ0eXAiOiJKV1QiLCJhb...` |
| `VITE_PAYFAST_MERCHANT_ID` | PayFast Account Settings | `10000100` |
| `VITE_PAYFAST_MERCHANT_KEY` | PayFast Account Settings | `46f...` |
| `VITE_PAYFAST_WEBHOOK_URL` | Your Vercel deployment | `https://your-domain.vercel.app/payfast-webhook` |

---

**Last Updated**: 2024
**Version**: 1.0 - Supabase Edition
