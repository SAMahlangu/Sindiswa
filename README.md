# Nail Tech Booking System

A complete production-ready React + Supabase booking system for nail tech businesses in South Africa with PayFast payment integration.

## Features

### Client Side
- ✅ Browse nail services with pricing
- ✅ Select service, date, and time slots
- ✅ Guest booking (no account required)
- ✅ Dynamic time slot generation based on service duration
- ✅ Automatic double-booking prevention
- ✅ PayFast payment gateway integration
- ✅ 30% deposit payment
- ✅ Booking confirmation with reference

### Admin Dashboard
- ✅ Admin authentication (email/password)
- ✅ View all bookings with filtering
- ✅ Mark bookings as completed
- ✅ Cancel bookings
- ✅ Manage services (add/edit/delete)
- ✅ View total revenue
- ✅ Appointment analytics

### Backend
- ✅ Supabase PostgreSQL database
- ✅ Edge Functions for PayFast webhook
- ✅ Automatic unpaid booking cancellation
- ✅ Revenue reporting
- ✅ Row Level Security (RLS) policies

## Tech Stack

- **Frontend:** React 18 + Vite
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Backend:** Supabase Edge Functions (Deno)
- **Payment:** PayFast (South Africa)
- **Hosting:** Vercel
- **Styling:** Custom CSS with responsive design

## Project Structure

```
nail-tech-booking/
├── src/
│   ├── pages/              # React pages
│   │   ├── HomePage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── ConfirmationPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── AdminLogin.jsx
│   ├── components/         # Reusable components
│   │   ├── Navigation.jsx
│   │   ├── AdminNav.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── ServiceSelector.jsx
│   │   ├── DateSelector.jsx
│   │   ├── TimeSlotSelector.jsx
│   │   ├── ClientInfo.jsx
│   │   └── ProtectedRoute.jsx
│   ├── config/             # Configuration
│   │   └── supabase.js     # Supabase client
│   ├── context/            # React context
│   │   └── AuthContext.jsx
│   ├── services/           # API services
│   │   └── api.js
│   ├── styles/             # CSS files
│   ├── App.jsx
│   └── main.jsx
├── supabase/               # Supabase setup
│   ├── migrations/         # Database migrations
│   │   ├── 001_init_schema.sql
│   │   └── 002_rls_policies.sql
│   └── functions/          # Edge Functions
│       ├── payfast-webhook/
│       ├── cancel-unpaid-bookings/
│       └── get-revenue-report/
├── vite.config.js          # Vite config
├── package.json
├── .env.example            # Environment variables template
├── SUPABASE_DEPLOYMENT_GUIDE.md  # Deployment instructions
└── START_SUPABASE.md       # Quick start guide

```

## Installation

### Prerequisites
- Node.js v18+
- Supabase Account (https://supabase.com)
- PayFast Merchant Account

### Setup

1. **Clone/Setup Project**
```bash
cd path/to/project
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase and PayFast credentials
```

3. **Setup Supabase**
- Create Supabase project
- Run SQL migrations from `supabase/migrations/`
- Deploy Edge Functions

4. **Deploy**
See [SUPABASE_DEPLOYMENT_GUIDE.md](./SUPABASE_DEPLOYMENT_GUIDE.md)

## Quick Start

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

## Usage

### Client Booking Flow

1. Visit homepage
2. View available services
3. Click "Book Now"
4. Select service → date → time
5. Enter name and phone
6. Pay 30% deposit on PayFast
7. Get booking confirmation

### Admin Panel

1. Visit `/admin/login`
2. Login with admin credentials
3. Manage bookings and services
4. View revenue reports

## Firestore Collections

### services
- `name` - Service name
- `description` - Service description
- `price` - Service price (ZAR)
- `durationMinutes` - Duration in minutes

### appointments
- `clientName` - Client's full name
- `clientPhone` - Client's phone number
- `serviceId` - Reference to service
- `serviceName` - Service name (denormalized)
- `date` - Appointment date (YYYY-MM-DD)
- `time` - Appointment time (HH:mm)
- `depositAmount` - 30% of service price
- `status` - pending | paid | completed | cancelled
- `createdAt` - Booking creation timestamp

### settings
- `businessName` - Business name
- `workingHours` - Start/end time
- `depositPercentage` - Deposit percentage (0.3)
- `address` - Business address
- `phone` - Contact phone
- `email` - Contact email

## Security

### Firestore Rules
- Public can only create appointments
- Can read services and settings
- Cannot modify own bookings
- Admin can read/write all data

### PayFast Integration
- Merchant ID and Key stored in environment variables
- Webhook signature verification
- Secure MD5 hash validation

### Authentication
- Admin users only via email/password
- Client bookings don't require auth
- Session tokens via Bearer scheme

## Payment Integration

### PayFast Flow

1. Client completes booking form
2. Redirected to PayFast payment page
3. Client pays via card/EFT
4. PayFast sends webhook notification
5. Cloud Function verifies signature
6. Appointment updated to "paid"
7. Confirmation sent to client

## Admin Features

- **Dashboard:** Overview of bookings and revenue
- **Bookings:** Filter by date, mark complete, cancel
- **Services:** Add/edit/delete services with pricing
- **Revenue:** Total deposits received
- **Export:** Download booking data

## Customization

### Colors
Edit `src/styles/index.css` CSS variables:
- `--primary-color`: Main color (pink)
- `--secondary-color`: Accent color
- `--accent-color`: Highlight color

### Business Info
Update `src/pages/HomePage.jsx`:
- Business name
- Contact details
- Address

### Working Hours
Update `src/pages/BookingPage.jsx`:
- `WORKING_HOURS` constant

## Deployment

See [SUPABASE_DEPLOYMENT_GUIDE.md](./SUPABASE_DEPLOYMENT_GUIDE.md) for:
- Supabase project setup
- Database schema deployment
- Edge Functions deployment
- PayFast configuration
- Vercel hosting deployment
- Troubleshooting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Optimized React components
- Lazy loading where possible
- Minified production build
- Supabase auto-scaling
- CDN delivery via Vercel

## Monitoring

- Supabase Dashboard for real-time data
- Edge Functions logs via Supabase Console
- PayFast webhook monitoring
- Admin dashboard for bookings

## Future Enhancements

- [ ] Email/SMS notifications
- [ ] Google Calendar sync
- [ ] Appointment reminders
- [ ] Customer feedback/ratings
- [ ] Multi-location support
- [ ] Package deals
- [ ] Recurring appointments
- [ ] Employee management
- [ ] Staff scheduling
- [ ] Analytics dashboard

## Legal

- Terms of Service (add custom)
- Privacy Policy (add custom)
- POPIA compliance (South Africa)
- PayFast Terms accepted

## Support

For issues or questions:
1. Check DEPLOYMENT_GUIDE.md
2. Review Firebase Console
3. Check Cloud Functions logs
4. Contact Firebase Support

## License

Proprietary - All rights reserved

## Version

1.0.0 - Production Ready

---

**Built with ❤️ for South African nail salons**
