# COMPLETE PROJECT STRUCTURE

## Full Directory Tree

```
Sindiswa/
│
├── 📄 Configuration Files
│   ├── .env.example                 # Environment variables template
│   ├── .firebaserc                  # Firebase project config
│   ├── .gitignore                   # Git ignore rules
│   ├── eslint.config.js            # ESLint configuration
│   ├── firebase.json               # Firebase hosting/functions config
│   ├── firestore.indexes.json      # Firestore index configuration
│   ├── firestore.rules             # Firestore security rules
│   ├── vite.config.js              # Vite build configuration
│   ├── package.json                # React dependencies & scripts
│   └── index.html                  # HTML entry point
│
├── 📄 Documentation
│   ├── README.md                   # Full documentation
│   ├── QUICK_START.md              # Getting started guide
│   ├── DEPLOYMENT_GUIDE.md         # Step-by-step deployment
│   ├── API_DOCUMENTATION.md        # API reference
│   └── PROJECT_SUMMARY.md          # This file
│
├── 📁 src/ (React Application - 14 CSS + 8 Components + 6 Pages)
│   │
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # React entry point
│   │
│   ├── 📁 pages/ (6 pages)
│   │   ├── HomePage.jsx            # 🏠 Home page with services list
│   │   ├── BookingPage.jsx         # 📅 4-step booking form
│   │   ├── PaymentPage.jsx         # 💳 Payment confirmation
│   │   ├── ConfirmationPage.jsx    # ✅ Booking confirmation
│   │   ├── AdminLogin.jsx          # 🔐 Admin login
│   │   └── AdminDashboard.jsx      # 📊 Admin panel
│   │
│   ├── 📁 components/ (8 reusable components)
│   │   ├── Navigation.jsx          # Main navbar
│   │   ├── AdminNav.jsx            # Admin navbar
│   │   ├── ServiceCard.jsx         # Service display card
│   │   ├── ServiceSelector.jsx     # Service selection form
│   │   ├── DateSelector.jsx        # Calendar date picker
│   │   ├── TimeSlotSelector.jsx    # Time slot picker
│   │   ├── ClientInfo.jsx          # Client name/phone form
│   │   └── ProtectedRoute.jsx      # Admin route protection
│   │
│   ├── 📁 firebase/
│   │   └── config.js               # Firebase initialization & setup
│   │
│   ├── 📁 context/
│   │   └── AuthContext.jsx         # Authentication state management
│   │
│   ├── 📁 services/
│   │   └── api.js                  # Firestore API service calls
│   │
│   └── 📁 styles/ (14 CSS files)
│       ├── index.css               # Global styles & variables
│       ├── Navigation.css          # Navbar styling
│       ├── AdminNav.css            # Admin navbar styling
│       ├── HomePage.css            # Home page styling
│       ├── BookingPage.css         # Booking page layout
│       ├── ServiceCard.css         # Service card component
│       ├── ServiceSelector.css     # Service selection
│       ├── DateSelector.css        # Calendar styling
│       ├── TimeSlotSelector.css    # Time slot styling
│       ├── ClientInfo.css          # Form styling
│       ├── PaymentPage.css         # Payment page styling
│       ├── ConfirmationPage.css    # Confirmation page styling
│       ├── AdminLogin.css          # Login page styling
│       └── AdminDashboard.css      # Admin dashboard styling
│
├── 📁 functions/ (Cloud Functions Backend)
│   ├── src/
│   │   └── index.js                # All Cloud Functions
│   │       ├── payfastWebhook()    # PayFast payment handler
│   │       ├── verifyPayment()     # Payment verification
│   │       ├── cancelUnpaidBookings() # Auto-cancel bookings
│   │       ├── getRevenueReport()  # Revenue calculations
│   │       ├── computeSignature()  # Signature verification
│   │       └── sendConfirmationEmail() # Email notifications
│   │
│   ├── package.json                # Firebase Functions dependencies
│   └── .gitignore                  # Git ignore rules
│
└── 📁 public/                      # Static assets (optional)
    └── (favicon, images, etc.)
```

---

## File Statistics

| Category | Count | Lines | Purpose |
|----------|-------|-------|---------|
| Pages | 6 | 1,200+ | User interfaces |
| Components | 8 | 800+ | Reusable UI |
| CSS Styles | 14 | 1,400+ | Styling |
| Firebase Config | 1 | 50+ | Setup |
| Auth Context | 1 | 30+ | State |
| API Services | 1 | 100+ | Database |
| Cloud Functions | 1 | 200+ | Backend |
| Security Rules | 1 | 50+ | Firestore |
| Documentation | 5 | 2,000+ | Guides |
| Config Files | 10 | 200+ | Build/Config |
| **TOTAL** | **48+** | **5,930+** | **Complete App** |

---

## React Component Tree

```
<App>
├── <Router>
    ├── <BrowserRouter>
        ├── <Routes>
            ├── <Route path="/">
            │   └── <HomePage>
            │       ├── <Navigation>
            │       └── <ServiceCard> (multiple)
            │
            ├── <Route path="/booking">
            │   └── <BookingPage>
            │       ├── <Navigation>
            │       ├── <ServiceSelector>
            │       ├── <DateSelector>
            │       ├── <TimeSlotSelector>
            │       ├── <ClientInfo>
            │       └── Service Sidebar
            │
            ├── <Route path="/payment/:id">
            │   └── <PaymentPage>
            │       └── <Navigation>
            │
            ├── <Route path="/confirmation/:id">
            │   └── <ConfirmationPage>
            │       └── <Navigation>
            │
            ├── <Route path="/admin/login">
            │   └── <AdminLogin>
            │       └── <Navigation>
            │
            ├── <Route path="/admin/dashboard">
            │   └── <ProtectedRoute>
            │       └── <AdminDashboard>
            │           ├── <AdminNav>
            │           ├── Dashboard Stats
            │           ├── Admin Tabs
            │           ├── Bookings Table
            │           └── Services Grid
            │
            └── <Route path="*">
                └── <HomePage> (fallback)
```

---

## Data Flow Architecture

```
Mobile User / Browser (HTTP/HTTPS)
    ↓
    React App (Vite)
        ├── HomePage (services list)
        ├── BookingPage (4 steps)
        ├── PaymentPage (summary)
        └── ConfirmationPage (confirmation)
    ↓
    Firebase Hosting (CDN)
    ↓
    Firebase Services
        ├── Firestore Database
        │   ├── /services
        │   ├── /appointments
        │   ├── /settings
        │   ├── /admins
        │   └── /emailLogs
        ├── Firebase Auth (login)
        └── Cloud Functions
            ├── payfastWebhook
            ├── cancelUnpaidBookings (scheduled)
            └── getRevenueReport
    ↓
    PayFast Payment Gateway (External)
        ├── Test URL: payfast.co.za
        └── Webhook: → Cloud Function
```

---

## Firestore Collections Structure

```
firestore/
│
├── services/ (Services Collection)
│   ├── doc1
│   │   ├── name: "Gel Manicure"
│   │   ├── description: "Beautiful gel nails"
│   │   ├── price: 450
│   │   └── durationMinutes: 45
│   │
│   ├── doc2
│   │   ├── name: "Acrylic Nails"
│   │   ├── price: 500
│   │   └── ...
│   └── ...
│
├── appointments/ (Bookings Collection)
│   ├── apt_001
│   │   ├── clientName: "John Doe"
│   │   ├── clientPhone: "27123456789"
│   │   ├── serviceId: "service_1"
│   │   ├── serviceName: "Gel Manicure"
│   │   ├── date: "2024-02-28"
│   │   ├── time: "14:00"
│   │   ├── depositAmount: 135.00
│   │   ├── status: "paid"
│   │   ├── createdAt: timestamp
│   │   ├── paidAt: timestamp
│   │   └── payfastReference: "pf_12345"
│   │
│   └── apt_002 (more bookings...)
│
├── settings/ (Configuration)
│   └── default
│       ├── businessName: "Nail Tech Studio"
│       ├── workingHours: {start: 9, end: 17}
│       ├── depositPercentage: 0.3
│       ├── address: "Johannesburg, SA"
│       ├── phone: "+27 (0)11 XXX"
│       └── email: "hello@..."
│
├── admins/ (Admin Users)
│   └── admin@nailtechstudio.co.za
│       ├── email: "admin@nailtechstudio.co.za"
│       ├── isAdmin: true
│       └── createdAt: timestamp
│
└── emailLogs/ (Email Records)
    ├── log_001
    │   ├── appointmentId: "apt_001"
    │   ├── type: "confirmation"
    │   ├── sentAt: timestamp
    │   └── status: "sent"
    └── ...
```

---

## Page Routes & URLs

```
/                           → HomePage (services list)
/booking                    → BookingPage (4-step booking)
/payment/:appointmentId     → PaymentPage (payment summary)
/confirmation/:appointmentId → ConfirmationPage (booking confirmed)
/admin/login                → AdminLogin (authentication)
/admin/dashboard            → AdminDashboard (admin panel)
*                           → HomePage (fallback)
```

---

## API Endpoints (Cloud Functions)

```
POST /payfastWebhook
├── Purpose: Receive PayFast payment notification
├── Auth: Signature verification (MD5)
└── Response: {success: true}

POST /verifyPayment
├── Purpose: Check payment status
├── Auth: Requires authentication
└── Response: {verified: true, status, amount}

Schedule: cancelUnpaidBookings (hourly)
├── Purpose: Auto-cancel unpaid bookings (24hrs)
└── Action: Update appointment status to "cancelled"

POST /getRevenueReport
├── Purpose: Calculate revenue (admin only)
├── Auth: Admin authentication
└── Response: {totalRevenue, totalBookings, dates}
```

---

## Environment Variables

```
.env file (REQUIRED)
│
├── Firebase Credentials
│   ├── VITE_FIREBASE_API_KEY
│   ├── VITE_FIREBASE_AUTH_DOMAIN
│   ├── VITE_FIREBASE_PROJECT_ID
│   ├── VITE_FIREBASE_STORAGE_BUCKET
│   ├── VITE_FIREBASE_MESSAGING_SENDER_ID
│   └── VITE_FIREBASE_APP_ID
│
└── PayFast Credentials
    ├── VITE_PAYFAST_MERCHANT_ID
    ├── VITE_PAYFAST_MERCHANT_KEY
    └── VITE_PAYFAST_WEBHOOK_URL
```

---

## Security Architecture

```
User Layer (Client-Side)
    ↓
    Firestore Security Rules
    ├── Public: Read services, settings
    ├── Public: Create appointments only
    ├── Admin: Full read/write all
    └── Private: Protected collections
    ↓
    Authentication Layer
    ├── Email/Password (admins)
    ├── Session tokens (admin)
    └── Route protection
    ↓
    Payment Layer (PayFast)
    ├── Webhook signature verification (MD5)
    ├── Merchant ID authentication
    └── HTTPS encryption
    ↓
    Environment Variables
    ├── Never committed to git
    ├── Stored in .env (local)
    └── Firebase Secrets (production)
```

---

## Deployment Architecture

```
Development (Local)
    ├── npm run dev (Vite dev server)
    └── Firebase emulators (optional)
    ↓
Build Process
    ├── npm run build (Vite compilation)
    ├── Create dist/ folder
    ├── Minified bundle
    └── Sourcemaps (optional)
    ↓
Production (Firebase)
    ├── React App → Firebase Hosting
    │   ├── CDN distribution
    │   ├── HTTPS enabled
    │   └── Auto-deployed
    ├── Cloud Functions → us-central1
    │   ├── PayFast webhook
    │   └── Scheduled jobs
    └── Firestore → asia-south1
        ├── auto-scaling
        ├── Backups enabled
        └── Security rules active
```

---

## Technology Stack Diagram

```
Browser/Mobile App
    ↓
React 18
    ├── React Router 6 (routing)
    ├── React Hooks (state)
    └── CSS3 (styling)
    ↓
Vite (Build Tool)
    ├── Hot reload (dev)
    ├── Code splitting
    └── Optimized build
    ↓
Firebase SDK
    ├── Firestore (database)
    ├── Auth (authentication)
    └── Functions (backend)
    ↓
Backend
    ├── Cloud Functions
    ├── Node.js 18
    └── PayFast API
    ↓
Cloud Services
    ├── Firestore Database
    ├── Firebase Hosting
    ├── Cloud Functions
    └── Firebase Auth
```

---

## File Dependencies

```
App.jsx
    ├── react-router-dom
    ├── Pages (HomePage, BookingPage, etc.)
    ├── AuthProvider
    ├── ProtectedRoute
    └── App.css

HomePage.jsx
    ├── firestore (getDocs)
    ├── Navigation
    ├── ServiceCard
    └── HomePage.css

BookingPage.jsx
    ├── firestore (collection, query, getDocs)
    ├── Services (api.js)
    ├── Components (ServiceSelector, etc.)
    └── BookingPage.css

AdminDashboard.jsx
    ├── firebase/auth (signOut)
    ├── firestore (all CRUD)
    ├── AdminNav
    └── AdminDashboard.css

AuthContext.jsx
    ├── firebase/auth (onAuthStateChanged)
    └── React Context API

functions/index.js
    ├── firebase-admin
    ├── firebase-functions
    ├── crypto (MD5 hashing)
    └── https (request handling)
```

---

## CSS Architecture

```
styles/
├── index.css (Global)
│   ├── CSS Variables (colors, spacing)
│   ├── Base styles (*, body)
│   ├── Typography
│   ├── Buttons (.btn-primary, .btn-secondary)
│   ├── Forms (.form-group)
│   └── Utilities (.loader, .badge)
│
├── Component Styles (individual)
│   ├── Navigation.css (navbar)
│   ├── HomePage.css (home page)
│   ├── BookingPage.css (booking layout)
│   ├── ServiceCard.css (card component)
│   └── ... (one per component)
│
└── Responsive Design
    └── @media (max-width: 768px)
        ├── Mobile optimized
        ├── Single column
        └── Touch friendly
```

---

## Development Workflow

```
1. Edit source files (src/, functions/)
    ↓
2. npm run dev (watch mode)
    ↓
3. Hot reload in browser
    ↓
4. Test changes
    ↓
5. Commit to git
    ↓
6. npm run build
    ↓
7. Test production build
    ↓
8. firebase deploy
    ↓
9. Verify on Firebase Hosting
```

---

## Deployment Checklist

```
Local Development
    ☐ npm install
    ☐ npm run dev works
    ☐ Pages load correctly

Firebase Setup
    ☐ Project created
    ☐ Firestore enabled
    ☐ Auth enabled
    ☐ Functions enabled
    ☐ Hosting enabled

Configuration
    ☐ .env file configured
    ☐ Credentials added
    ☐ Firestore rules deployed
    ☐ Admin user created

PayFast Integration
    ☐ Merchant account created
    ☐ Webhook URL configured
    ☐ Credentials added to Functions

Testing
    ☐ Booking flow works
    ☐ Test payment successful
    ☐ Admin dashboard accessible
    ☐ Database rules enforced

Deployment
    ☐ npm run build runs successfully
    ☐ Build output correct
    ☐ firebase deploy succeeds
    ☐ URL accessible

Final Checks
    ☐ All pages load
    ☐ Booking works end-to-end
    ☐ Admin panel functional
    ☐ Mobile responsive
```

---

This document provides a complete visual overview of:
- ✅ All project files and their purpose
- ✅ Component hierarchy
- ✅ Data flow and architecture
- ✅ Database structure
- ✅ API endpoints
- ✅ Technology stack
- ✅ Development and deployment processes

---

**For detailed information, see the other documentation files:**
- README.md - Full overview
- QUICK_START.md - Getting started
- DEPLOYMENT_GUIDE.md - Deploy steps
- API_DOCUMENTATION.md - API reference
