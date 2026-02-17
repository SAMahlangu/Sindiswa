# 📋 IMPLEMENTATION CHECKLIST

Complete this checklist as you implement the booking system.

---

## Phase 1: Initial Setup (30 minutes)

### A. Environment Setup
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Visual Studio Code or preferred editor
- [ ] PowerShell/Terminal access
- [ ] Git configured (optional)

### B. Project Downloaded
- [ ] Project folder exists at: `c:\Users\Student\Desktop\Sindiswa`
- [ ] All folders created correctly
- [ ] All files present

### C. Dependencies Installed
- [ ] Run: `npm install`
- [ ] Completed without errors
- [ ] node_modules folder created
- [ ] Run: `cd functions && npm install && cd ..`
- [ ] functions/node_modules created

---

## Phase 2: Firebase Project (45 minutes)

### A. Firebase Project Creation
- [ ] Go to https://console.firebase.google.com
- [ ] Create new project "nail-tech-studio"
- [ ] Disable Google Analytics
- [ ] Project created and visible

### B. Firestore Database
- [ ] Navigate to Firestore Database
- [ ] Click "Create Database"
- [ ] Select: Production mode
- [ ] Region: asia-south1
- [ ] Click "Create"
- [ ] Database created and empty

### C. Authentication
- [ ] Go to Authentication
- [ ] Click "Get Started"
- [ ] Enable "Email/Password"
- [ ] Save changes

### D. Cloud Functions
- [ ] Go to Functions
- [ ] Note region (usually us-central1)
- [ ] Understand quotas

### E. Hosting
- [ ] Go to Hosting
- [ ] Click "Get Started"
- [ ] Note the hosting URL

### F. Get Credentials
- [ ] Project Settings > General
- [ ] Copy all Firebase Web Config values:
  - [ ] API Key
  - [ ] Auth Domain
  - [ ] Project ID
  - [ ] Storage Bucket
  - [ ] Messaging Sender ID
  - [ ] App ID

---

## Phase 3: Environment Configuration (10 minutes)

### A. Create .env File
- [ ] Copy `.env.example` to `.env`
- [ ] File exists at: `Sindiswa/.env`

### B. Add Firebase Credentials
- [ ] VITE_FIREBASE_API_KEY = (from Project Settings)
- [ ] VITE_FIREBASE_AUTH_DOMAIN = (from Project Settings)
- [ ] VITE_FIREBASE_PROJECT_ID = (from Project Settings)
- [ ] VITE_FIREBASE_STORAGE_BUCKET = (from Project Settings)
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID = (from Project Settings)
- [ ] VITE_FIREBASE_APP_ID = (from Project Settings)

### C. Add PayFast Credentials (Placeholder for Now)
- [ ] VITE_PAYFAST_MERCHANT_ID = "10000100" (test)
- [ ] VITE_PAYFAST_MERCHANT_KEY = "test_key"
- [ ] VITE_PAYFAST_WEBHOOK_URL = (will get later)

---

## Phase 4: Firestore Collections Setup (20 minutes)

### A. Create Collections in Firebase Console

#### services Collection
- [ ] Go to Firestore > + Add Collection
- [ ] Collection ID: "services"
- [ ] Add Document > Auto ID
- [ ] Fields:

```
name: "Gel Manicure"
description: "Beautiful gel manicure with color"
price: 450
durationMinutes: 45
```

- [ ] Add second document:

```
name: "Acrylic Nails"
description: "Full acrylic nail set with design"
price: 500
durationMinutes: 60
```

- [ ] Add third document:

```
name: "Nail Art"
description: "Custom nail art design"
price: 350
durationMinutes: 30
```

#### settings Collection
- [ ] Create collection "settings"
- [ ] Add Document > Auto ID
- [ ] Fields:

```
businessName: "Nail Tech Studio"
workingHours: {start: 9, end: 17}
depositPercentage: 0.3
address: "Johannesburg, South Africa"
phone: "+27 (0)11 XXX XXXX"
email: "hello@nailtechstudio.co.za"
```

#### admins Collection (Create Later)
- [ ] Create collection "admins"
- [ ] Will add document after creating auth user

#### appointments Collection (Empty)
- [ ] Create collection "appointments"
- [ ] Leave empty for now (auto-populated)

#### emailLogs Collection (Empty)
- [ ] Create collection "emailLogs"
- [ ] Leave empty

---

## Phase 5: Authentication Setup (15 minutes)

### A. Create Admin User
- [ ] Go to Firebase Console > Authentication
- [ ] Click "Add User"
- [ ] Email: admin@nailtechstudio.co.za
- [ ] Password: AdminPassword123!
- [ ] Click "Add User"
- [ ] Note the UID (you'll need it)

### B. Create Admin Document
- [ ] Go to Firestore > admins collection
- [ ] Add Document > Set Document ID as the email
- [ ] Fields:

```
email: "admin@nailtechstudio.co.za"
isAdmin: true
createdAt: (Current Timestamp)
```

- [ ] Document created

---

## Phase 6: Local Development (15 minutes)

### A. Start Development Server
- [ ] Open terminal in project folder
- [ ] Run: `npm run dev`
- [ ] Wait for server to start

### B. Open in Browser
- [ ] Browser opens to http://localhost:3000
- [ ] Or manually visit http://localhost:3000
- [ ] Homepage loads

### C. Test Home Page
- [ ] See "Nail Tech Studio" heading
- [ ] See services list (3 services)
- [ ] See navbar with "Book Now" button
- [ ] See "Admin" button

### D. Test Booking Flow
- [ ] Click "Book Now"
- [ ] Select a service
- [ ] Select a date
- [ ] Select a time slot
- [ ] Enter name (e.g., "John Doe")
- [ ] Enter phone (e.g., "27123456789")
- [ ] Try to proceed to payment

### E. Test Admin Login
- [ ] Click "Admin" in navbar
- [ ] Should redirect to /admin/login
- [ ] Try login with:
  - [ ] Email: admin@nailtechstudio.co.za
  - [ ] Password: AdminPassword123!
- [ ] Should redirect to dashboard

---

## Phase 7: Cloud Functions Deployment (20 minutes)

### A. Setup Firebase CLI
- [ ] Run: `npm install -g firebase-tools`
- [ ] Run: `firebase login`
- [ ] Browser opens for authentication
- [ ] Complete login
- [ ] Run: `firebase init`

When prompted:
- [ ] Select Firestore, Functions, Hosting
- [ ] Select your project
- [ ] Accept defaults
- [ ] When asked to overwrite: Select "No"

### B. Deploy Firestore Rules
- [ ] Run: `firebase deploy --only firestore:rules`
- [ ] Wait for completion
- [ ] Should see "✔ deployed successfully"

### C. Set Function Secrets (Optional for Now)
```bash
firebase functions:config:set payfast.merchant_id="10000100"
firebase functions:config:set payfast.merchant_key="test_key"
```

### D. Deploy Functions
- [ ] Run: `firebase deploy --only functions`
- [ ] Wait for deployment
- [ ] Note the function URLs
- [ ] Look for: "payFastWebhook" URL

---

## Phase 8: Build and Deploy to Hosting (15 minutes)

### A. Build React App
- [ ] Stop dev server (Ctrl+C)
- [ ] Run: `npm run build`
- [ ] Wait for build completion
- [ ] Check for errors
- [ ] dist/ folder should be created

### B. Deploy to Firebase Hosting
- [ ] Run: `firebase deploy --only hosting`
- [ ] Wait for deployment
- [ ] Note the Hosting URL

### C. Verify Live App
- [ ] Visit Hosting URL in browser
- [ ] Check homepage loads
- [ ] Try booking flow
- [ ] Try admin login

---

## Phase 9: PayFast Integration (25 minutes)

### A. Get PayFast Credentials
- [ ] Go to https://www.payfast.co.za
- [ ] Create merchant account (if not existing)
- [ ] Login to merchant dashboard
- [ ] Go to Settings > API Integration
- [ ] Copy Merchant ID (test: 10000100)
- [ ] Copy Merchant Key
- [ ] Note Passphrase

### B. Configure Webhook
- [ ] In PayFast dashboard: Settings > API Integration
- [ ] Add Webhook URL:
  - [ ] From your deployed functions URL
  - [ ] Format: `https://us-central1-{project-id}.cloudfunctions.net/payfastWebhook`
- [ ] Enable notifications for payment status
- [ ] Save

### C. Update Environment
- [ ] Update .env with actual PayFast credentials
- [ ] Update Firebase Functions secrets:

```bash
firebase functions:config:set payfast.merchant_id="YOUR_ID"
firebase functions:config:set payfast.merchant_key="YOUR_KEY"
```

- [ ] Redeploy functions: `firebase deploy --only functions`

### D. Test Payment Flow
- [ ] Visit your live app
- [ ] Complete booking form
- [ ] Proceed to payment
- [ ] Should redirect to PayFast
- [ ] Use test card: 4532015112830366
- [ ] CVC: 123
- [ ] Any future expiry date

---

## Phase 10: Customization (30 minutes)

### A. Change Business Name
- [ ] Edit: `src/pages/HomePage.jsx`
- [ ] Find: Line with business name
- [ ] Change: "Nail Tech Studio" to your name
- [ ] Also update: `src/components/Navigation.jsx`
- [ ] Also update: Firestore settings collection

### B. Change Colors
- [ ] Edit: `src/styles/index.css`
- [ ] Update CSS variables:
  - [ ] --primary-color: #f5d5e3 (main pink)
  - [ ] --secondary-color: #d4a5a5 (brown)
  - [ ] --accent-color: #e8b4c4 (light pink)

### C. Change Contact Info
- [ ] Edit: `src/pages/HomePage.jsx`
- [ ] Update phone number
- [ ] Update email
- [ ] Update address
- [ ] Also update Firestore settings

### D. Change Working Hours
- [ ] Edit: `src/pages/BookingPage.jsx`
- [ ] Find: `const WORKING_HOURS`
- [ ] Modify start time (currently 9)
- [ ] Modify end time (currently 17)

### E. Add Your Services
- [ ] Use admin dashboard
- [ ] Or Firestore console
- [ ] Add service: name, description, price, duration

### F. Rebuild and Deploy
- [ ] Run: `npm run build`
- [ ] Run: `firebase deploy`
- [ ] Verify changes live

---

## Phase 11: Testing (30 minutes)

### A. Test All Pages
- [ ] Homepage loads
- [ ] Booking flow works
- [ ] Payment page shows correctly
- [ ] Admin login succeeds
- [ ] Admin dashboard displays
- [ ] Services list shows

### B. Test Booking Workflow
- [ ] Select service: ✓
- [ ] Pick date: ✓
- [ ] Select time: ✓
- [ ] Enter name: ✓
- [ ] Enter phone: ✓
- [ ] Submit booking: ✓

### C. Test Admin Features
- [ ] Login works
- [ ] View bookings: ✓
- [ ] Filter by date: ✓
- [ ] Add service: ✓
- [ ] Edit service: ✓
- [ ] Delete service: ✓
- [ ] View revenue: ✓

### D. Test Mobile Responsiveness
- [ ] Open on mobile device
- [ ] Pages render correctly
- [ ] Buttons clickable
- [ ] Forms fillable
- [ ] Navigation works

### E. Test Database Security
- [ ] Try accessing admin panel without login (should fail)
- [ ] Try modifying booking data directly (should fail)
- [ ] Verify Firestore rules working

---

## Phase 12: Production Verification (15 minutes)

### A. Test Full Booking + Payment
- [ ] Visit app URL
- [ ] Complete booking
- [ ] Verify appointment in Firestore
- [ ] Test PayFast payment (test mode)
- [ ] Check status updates
- [ ] Review confirmation page

### B. Verify Logs
- [ ] Check Cloud Functions logs: `firebase functions:log`
- [ ] Check for errors
- [ ] Verify webhook received

### C. Check Database
- [ ] Visit Firebase Firestore Console
- [ ] Verify appointment created
- [ ] Check email logs (if implemented)

### D. Performance Check
- [ ] Load app
- [ ] Check mobile speed
- [ ] Verify images load
- [ ] Check responsiveness

---

## Phase 13: Monitoring Setup (15 minutes)

### A. Enable Firebase Monitoring
- [ ] Go to Firebase Console
- [ ] Enable Google Analytics (optional)
- [ ] Setup error tracking

### B. Setup Function Monitoring
- [ ] View: `firebase functions:log`
- [ ] Set up alerts (optional)

### C. Regular Maintenance Tasks
- [ ] Weekly: Check bookings
- [ ] Weekly: Export Firestore data
- [ ] Monthly: Review revenue
- [ ] Monthly: Check error logs

---

## Final Checklist

### Before Going Live
- [ ] All phases completed
- [ ] All tests passed
- [ ] Business info updated
- [ ] Colors customized
- [ ] Services added
- [ ] Admin user created
- [ ] PayFast configured
- [ ] Database backed up
- [ ] Security rules verified
- [ ] Performance acceptable

### Documentation
- [ ] README.md read
- [ ] QUICK_START.md reviewed
- [ ] DEPLOYMENT_GUIDE.md followed
- [ ] API_DOCUMENTATION.md saved

### Handoff
- [ ] URL documented
- [ ] Admin credentials stored securely
- [ ] Backup procedures documented
- [ ] Support contacts configured

---

## 🎉 Success Criteria

✅ All checkboxes completed
✅ App loads and responds
✅ Booking flow works end-to-end
✅ Admin panel functional
✅ All data persists in Firestore
✅ Mobile responsive
✅ PayFast integration working
✅ No console errors
✅ Performance acceptable
✅ Security rules enforced

---

## 📺 Verification Tests

### Test 1: Homepage Load
```
Location: https://your-app.web.app/
Expected: Homepage displays with services
Result: ______ (PASS/FAIL)
```

### Test 2: Complete Booking
```
Steps: Service → Date → Time → Name/Phone → Payment
Expected: Redirects to PayFast
Result: ______ (PASS/FAIL)
```

### Test 3: Admin Login
```
Location: /admin/login
Email: admin@nailtechstudio.co.za
Password: AdminPassword123!
Expected: Redirects to dashboard
Result: ______ (PASS/FAIL)
```

### Test 4: View Bookings
```
Location: /admin/dashboard
Expected: Shows empty bookings table
Result: ______ (PASS/FAIL)
```

### Test 5: Mobile Responsiveness
```
Device: Mobile phone
Expected: Site loads and is usable
Result: ______ (PASS/FAIL)
```

---

## 💾 Important Credentials

**KEEP THESE SAFE - Don't share or commit to git**

```
Firebase Project ID: ___________________
Admin Email: admin@nailtechstudio.co.za
Admin Password: AdminPassword123!
PayFast Merchant ID: ___________________
PayFast Webhook URL: ___________________
Hosting URL: ___________________
```

---

## 📞 Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Start dev | `npm run dev` | Project root |
| Build | `npm run build` | Project root |
| Deploy | `firebase deploy` | Project root |
| View logs | `firebase functions:log` | Project root |
| Stop dev | `Ctrl+C` | Terminal |
| Edit services | Dashboard or Firestore | `/admin/dashboard` |
| View bookings | Dashboard | `/admin/dashboard` |
| Change colors | `src/styles/index.css` | CSS variables |
| Change hours | `src/pages/BookingPage.jsx` | Line ~16 |

---

**Print this checklist and mark items as you complete them!**

---

**Date Started:** _______________
**Date Completed:** _______________
**Notes:** _________________________

---

Good luck! You've got everything you need to launch a professional booking system! 🚀
