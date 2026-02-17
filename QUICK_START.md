# QUICK START GUIDE

## What You Have

A complete, production-ready React + Firebase nail booking system with:
- ✅ Responsive React UI with Vite
- ✅ Guest booking (no registration needed)
- ✅ Admin dashboard with full controls
- ✅ PayFast payment integration
- ✅ Firebase Firestore database
- ✅ Cloud Functions backend
- ✅ Security rules and authentication
- ✅ Modern pink/nude design

---

## File Structure Overview

```
Sindiswa/
├── src/                          # React frontend
│   ├── pages/                    # 6 pages
│   ├── components/               # 8 reusable components
│   ├── firebase/                 # Firebase config
│   ├── context/                  # Auth context
│   ├── services/                 # API calls
│   ├── styles/                   # CSS files
│   ├── App.jsx                   # Main app
│   └── main.jsx                  # Entry point
├── functions/                    # Firebase Cloud Functions
│   ├── src/index.js             # Webhook + utilities
│   └── package.json
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── vite.config.js               # Vite config
├── eslint.config.js             # Linting
├── firebase.json                # Firebase config
├── .firebaserc                  # Firebase project
├── firestore.rules              # Database security
├── .env.example                 # Environment template
├── README.md                    # Documentation
└── DEPLOYMENT_GUIDE.md          # Deploy instructions
```

---

## Installation Steps (5 Minutes)

### 1. Install Dependencies

```bash
cd path/to/Sindiswa
npm install
cd functions
npm install
cd ..
```

### 2. Setup Environment Variable

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your Firebase credentials:
# - Get from Firebase Console > Project Settings
# - Add PayFast merchant details
```

### 3. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Feature Walkthrough

### Client Flow

1. **Home Page**
   - Displays all available services
   - Shows price, duration, description
   - "Book Now" button

2. **Booking Page**
   - Step 1: Select service
   - Step 2: Pick date (calendar)
   - Step 3: Choose time slot
   - Step 4: Enter name/phone
   - See booking summary

3. **Payment Page**
   - Review booking details
   - Show 30% deposit amount
   - Redirect to PayFast (payment gateway)

4. **Confirmation Page**
   - Show booking reference number
   - Display appointment details
   - Payment receipt

### Admin Flow

1. **Admin Login** (`/admin/login`)
   - Default: admin@nailtechstudio.co.za / AdminPassword123!

2. **Dashboard** (`/admin/dashboard`)
   - View stats: Total bookings, confirmed, revenue
   - Filter appointments by date
   - Mark bookings complete/cancel
   - Add/edit/delete services

---

## Database Setup

### Create in Firebase Console > Firestore

**services** collection - Sample data:
```javascript
{
  name: "Gel Manicure",
  description: "Beautiful gel manicure with color",
  price: 450,
  durationMinutes: 45
}
```

**settings** collection:
```javascript
{
  businessName: "Nail Tech Studio",
  workingHours: {start: 9, end: 17},
  depositPercentage: 0.3,
  address: "Johannesburg, South Africa",
  phone: "+27 (0)11 XXX XXXX",
  email: "hello@nailtechstudio.co.za"
}
```

**admins** collection (after creating user):
```javascript
{
  email: "admin@nailtechstudio.co.za",
  isAdmin: true,
  createdAt: timestamp
}
```

---

## Key Features Explained

### 1. Booking Logic
- Working hours: 9am - 5pm
- Time slots auto-generated based on service duration
- Prevents double-booking with status check
- 30% deposit calculation

### 2. Payment Flow
- Creates appointment with "pending" status
- Redirects to PayFast payment page
- Cloud Function webhook receives payment status
- Updates appointment to "paid" or "cancelled"

### 3. Admin Controls
- Filter appointments by date
- Mark as completed/cancelled
- Add services (name, price, duration)
- View total revenue from paid bookings
- Real-time dashboard updates

### 4. Security
- Firestore rules restrict access
- Only admins can modify bookings
- Client can't edit after creation
- PayFast signature verification
- Environment variables for secrets

---

## Customization

### Change Business Name
Edit `src/pages/HomePage.jsx` and `src/components/Navigation.jsx`

### Change Colors
Edit `src/styles/index.css` CSS variables:
```css
--primary-color: #f5d5e3;      /* Main pink */
--secondary-color: #d4a5a5;    /* Warm brown */
--accent-color: #e8b4c4;       /* Light pink */
```

### Change Working Hours
Edit `src/pages/BookingPage.jsx`:
```javascript
const WORKING_HOURS = { start: 9, end: 17 }; // 9am to 5pm
```

### Add Services
Use admin dashboard or Firestore console:
- Service name
- Description
- Price (ZAR)
- Duration (minutes)

---

## Deployment Steps

### 1. Build
```bash
npm run build
```

### 2. Deploy to Firebase
```bash
firebase deploy
```

This deploys:
- React app to Hosting
- Cloud Functions
- Firestore rules

### 3. Get Your URL
```
Hosting URL: https://your-project.web.app
Admin Panel: https://your-project.web.app/admin/login
```

---

## Testing Checklist

- [ ] Home page loads with services
- [ ] Can complete booking flow
- [ ] PayFast payment redirects (test mode)
- [ ] Admin login works
- [ ] Can manage services in admin
- [ ] Can view bookings in admin
- [ ] Firestore rules prevent unauthorized access
- [ ] Responsive on mobile

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `src/firebase/config.js` | Firebase connection |
| `src/context/AuthContext.jsx` | Admin authentication |
| `firestore.rules` | Database security |
| `functions/src/index.js` | PayFast webhook handler |
| `.env` | Secret credentials |
| `package.json` | Dependencies |
| `vite.config.js` | Build configuration |

---

## Common Commands

```bash
# Development
npm run dev                      # Start dev server

# Build & Deploy
npm run build                    # Build for production
npm run deploy                   # Deploy to Firebase

# Firebase
firebase login                   # Authenticate
firebase init                    # Initialize project
firebase deploy --only functions # Deploy backend only
firebase functions:log           # View function logs

# Dependencies
npm install                      # Install all deps
npm update                       # Update packages
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Firebase (from Firebase Console > Settings)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# PayFast (from merchant account)
VITE_PAYFAST_MERCHANT_ID=...
VITE_PAYFAST_MERCHANT_KEY=...
VITE_PAYFAST_WEBHOOK_URL=...
```

---

## Firestore Collections

| Collection | Purpose | Fields |
|-----------|---------|--------|
| services | Available services | name, description, price, durationMinutes |
| appointments | Bookings | clientName, clientPhone, serviceId, date, time, status, depositAmount |
| settings | Business config | businessName, workingHours, depositPercentage, address, phone |
| admins | Admin users | email, isAdmin, createdAt |
| emailLogs | Email tracking | appointmentId, type, sentAt, status |

---

## Booking Status

- `pending` - Created, awaiting payment
- `paid` - Payment received, confirmed
- `completed` - Service delivered
- `cancelled` - Cancelled by admin or unpaid 24hrs

---

## Payment Integration

### PayFast Test Environment

| Field | Value |
|-------|-------|
| URL | https://www.payfast.co.za (production) |
| Test Card | 4532015112830366 |
| Test CVC | 123 |
| Expiry | Any future date |

### Webhook Flow

1. Client pays on PayFast
2. PayFast sends POST to Cloud Function
3. Function verifies MD5 signature
4. Updates appointment status
5. Sends confirmation to client (optional)

---

## Frontend Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Services listing |
| `/booking` | BookingPage | 4-step booking form |
| `/payment/:id` | PaymentPage | Payment summary |
| `/confirmation/:id` | ConfirmationPage | Booking confirmed |
| `/admin/login` | AdminLogin | Admin authentication |
| `/admin/dashboard` | AdminDashboard | Admin controls |

---

## Component Hierarchy

```
App
├── HomePage
│   ├── Navigation
│   └── ServiceCard (multiple)
├── BookingPage
│   ├── Navigation
│   ├── ServiceSelector
│   ├── DateSelector
│   ├── TimeSlotSelector
│   └── ClientInfo
├── PaymentPage
│   └── Navigation
├── ConfirmationPage
│   └── Navigation
├── AdminLogin
│   └── Navigation
└── AdminDashboard
    ├── AdminNav
    ├── Bookings Table
    └── Services Grid
```

---

## Styling

- **Framework:** Custom CSS (no external libraries)
- **Color Scheme:** Soft pink/nude theme
- **Responsive:** Mobile-first design
- **Icons:** Emoji and text icons
- **Fonts:** System fonts (Segoe UI)

---

## Performance Tips

- Lazy load appointments only when filtered
- Cache services data in memory
- Minimize Firestore reads with proper indexing
- Optimize build: `npm run build`

---

## Troubleshooting

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase Auth Issues
- Verify .env has correct credentials
- Check Firebase project exists
- Enable Authentication in Firebase Console

### Payment Not Working
- Check PayFast merchant ID/key
- Verify webhook URL in PayFast dashboard
- Check Cloud Functions deployed

### Database Errors
- Verify collections created in Firestore
- Check security rules deployed
- Review console errors

---

## Next Steps

1. **Setup Firebase Project** (10 minutes)
   - Create project at firebase.google.com
   - Enable Firestore, Auth, Functions, Hosting

2. **Add Your Data** (5 minutes)
   - Add nail services
   - Create admin user
   - Configure business settings

3. **Connect PayFast** (10 minutes)
   - Get merchant account
   - Add webhook URL to settings
   - Configure test environment

4. **Deploy** (5 minutes)
   - Build: `npm run build`
   - Deploy: `firebase deploy`
   - Test booking flow

---

## Documentation

- **Full Guide:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **README:** See [README.md](README.md)
- **Firebase Docs:** https://firebase.google.com/docs
- **PayFast Docs:** https://www.payfast.co.za/developers
- **React Docs:** https://react.dev

---

## Support Resources

- Firebase Console: https://console.firebase.google.com
- PayFast Dashboard: https://www.payfast.co.za/merchant
- GitHub Issues: Check project repo
- Stack Overflow: Tag with `firebase` `react`

---

## Production Checklist

- [ ] Firebase project created and configured
- [ ] All Firebase services enabled
- [ ] Collections created with sample data
- [ ] Admin user created
- [ ] Environment variables set
- [ ] PayFast merchant account verified
- [ ] Webhook URL configured
- [ ] Firestore rules deployed
- [ ] Cloud Functions deployed
- [ ] React app built
- [ ] Hosting deployed
- [ ] Domain configured (optional)
- [ ] HTTPS enabled
- [ ] Analytics setup
- [ ] Error tracking setup

---

## Version Info

- **React:** 18.2.0
- **Vite:** 5.0.0
- **Firebase:** 10.5.0
- **Node:** 18+
- **Status:** Production Ready

---

**Ready to deploy? Start with Step 1 installation above!** 🚀

For detailed deployment steps, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
