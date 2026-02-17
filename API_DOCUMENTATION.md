# API Documentation

## Cloud Functions

### 1. PayFast Webhook Handler

**Endpoint:** `POST /payfastWebhook`

**Description:** Receives payment confirmation from PayFast

**Request Body:**
```json
{
  "signature": "md5_hash_of_transaction",
  "data": {
    "pf_payment_id": "12345",
    "amount_gross": "150.00",
    "amount_fee": "5.00",
    "amount_net": "145.00",
    "payment_status": "COMPLETE",
    "custom_int1": "appointment_id",
    "custom_str1": "client_name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed"
}
```

**Status Codes:**
- 200: Success
- 401: Invalid signature
- 405: Method not allowed
- 500: Server error

---

### 2. Verify Payment

**Function:** `verifyPayment`

**Description:** Verify payment status of appointment

**Call From:**
```javascript
const functions = firebase.functions();
const verifyPayment = functions.httpsCallable('verifyPayment');
const result = await verifyPayment({ appointmentId: 'apt_123' });
```

**Response:**
```json
{
  "verified": true,
  "status": "paid",
  "amount": 150.00
}
```

---

### 3. Cancel Unpaid Bookings

**Function:** `cancelUnpaidBookings`

**Type:** Scheduled (hourly)

**Description:** Automatically cancels bookings unpaid for 24+ hours

**Trigger:** Every hour (Google Cloud Scheduler)

**Logs:** Check `firebase functions:log`

---

### 4. Get Revenue Report

**Function:** `getRevenueReport`

**Description:** Calculate revenue for date range (admin only)

**Call From:**
```javascript
const getRevenueReport = functions.httpsCallable('getRevenueReport');
const result = await getRevenueReport({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

**Response:**
```json
{
  "totalRevenue": 5000.00,
  "totalBookings": 15,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

---

## Firestore API

### Collections

#### services
```javascript
GET /services              // Get all services
POST /services             // Create service (admin only)
PUT /services/{id}         // Update service (admin only)
DELETE /services/{id}      // Delete service (admin only)
```

**Data Structure:**
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  durationMinutes: number
}
```

#### appointments
```javascript
GET /appointments          // Get all (admin only)
POST /appointments         // Create appointment (public)
PUT /appointments/{id}     // Update (admin only)
DELETE /appointments/{id}  // Delete (admin only)
```

**Data Structure:**
```javascript
{
  id: string,
  clientName: string,
  clientPhone: string,
  serviceId: string,
  serviceName: string,
  date: string,            // YYYY-MM-DD
  time: string,            // HH:mm
  depositAmount: number,
  status: string,          // pending | paid | completed | cancelled
  createdAt: timestamp,
  paidAt?: timestamp,
  payfastReference?: string
}
```

#### settings
```javascript
GET /settings             // Get settings (public)
PUT /settings/{id}        // Update (admin only)
```

#### admins
```javascript
GET /admins               // Get admins (admin only)
POST /admins              // Create admin (admin only)
```

---

## Authentication

### Firebase Auth

**Methods:**
- Email/Password (admin only)
- Anonymous (clients - not enforced in this app)

**Admin Login:**
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

const userCredential = await signInWithEmailAndPassword(
  auth,
  'admin@nailtechstudio.co.za',
  'password'
);
```

**Logout:**
```javascript
import { signOut } from 'firebase/auth';
await signOut(auth);
```

---

## React Hooks & Services

### useAuthContext
```javascript
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const { user, loading } = useContext(AuthContext);
```

### appointmentService
```javascript
// Create appointment
const appointmentId = await appointmentService.createAppointment({
  clientName: 'John',
  clientPhone: '27123456789',
  serviceId: 'service_1',
  serviceName: 'Gel Manicure',
  date: '2024-02-28',
  time: '14:00',
  depositAmount: 150.00
});

// Check availability
const available = await appointmentService.checkAvailability(
  '2024-02-28',
  'service_1',
  '14:00'
);

// Update status
await appointmentService.updateAppointmentStatus(appointmentId, 'paid');

// Get appointments by date
const appointments = await appointmentService.getAppointmentsByDate('2024-02-28');
```

### serviceService
```javascript
// Get all services
const services = await serviceService.getAllServices();
```

---

## Security Rules

### Public Access
- Read: services, settings
- Write: appointments (create only)

### Admin Access
- Read/Write: all collections
- Special: admins, emailLogs (read/write only)

### Client Restrictions
- Cannot read other client bookings
- Cannot modify own appointments after creation
- Cannot access admin data

---

## PayFast Integration

### Payment Flow

1. **Client Submits Booking**
   ```javascript
   // BookingPage.jsx - Step 4
   const appointment = {
     clientName,
     clientPhone,
     serviceId,
     date,
     time,
     depositAmount: service.price * 0.3
   };
   ```

2. **Save to Firestore**
   ```javascript
   const docRef = await addDoc(collection(db, 'appointments'), appointment);
   ```

3. **Redirect to PayFast**
   ```javascript
   // PaymentPage.jsx
   form.action = 'https://www.payfast.co.za/eng/process';
   form.method = 'POST';
   ```

4. **Webhook Notification**
   ```javascript
   // functions/src/index.js - payfastWebhook
   POST /payfastWebhook
   ```

5. **Update Appointment**
   ```javascript
   // On successful payment
   update(doc(db, 'appointments', appointmentId), {
     status: 'paid',
     paidAt: new Date()
   });
   ```

### PayFast Parameters

| Parameter | Value | Example |
|-----------|-------|---------|
| merchant_id | Your ID | 10000100 |
| merchant_key | Your Key | pk_123456 |
| return_url | Success URL | https://app.web.app/confirmation/apt_123 |
| cancel_url | Cancel URL | https://app.web.app/booking |
| notify_url | Webhook URL | Cloud Function URL |
| amount | Deposit * 100 | 15000 (R150) |
| custom_int1 | Appointment ID | apt_123 |

---

## Error Handling

### Firebase Errors
```javascript
catch (error) {
  console.error(error.code, error.message);
  // auth/invalid-email
  // firestore/permission-denied
  // functions/internal
}
```

### Network Errors
```javascript
console.error('Network error:', error);
// Check internet connection
// Retry payment
// Contact support
```

---

## Rate Limiting

### Firebase Quotas
- 50,000 read/write per day (free tier)
- 20,000 deletes per day
- 100 concurrent functions

### Best Practices
- Cache service list
- Batch Firestore writes
- Limit function executions
- Monitor usage in console

---

## Logging

### Cloud Functions Logs
```bash
firebase functions:log              # View all logs
firebase functions:log --lines 50   # Last 50 entries
```

### Console Logging
```javascript
console.log('Info message');
console.error('Error message');
console.warn('Warning message');
```

---

## Testing

### Local Testing
```bash
npm run dev                    # Start dev server
firebase emulators:start      # Start emulators
firebase functions:shell      # Test functions
```

### PayFast Test Mode
- Use test merchant ID: 10000100
- Test card: 4532015112830366
- Any future expiry date

---

## Monitoring

### Firebase Console
- Firestore usage
- Authentication metrics
- Function executions
- Hosting analytics

### Metrics to Track
- Bookings per day
- Payment conversion rate
- Function execution time
- Error rates

---

## Pagination & Querying

### Firestore Queries
```javascript
// Get appointments by date
const q = query(
  collection(db, 'appointments'),
  where('date', '==', '2024-02-28'),
  orderBy('time', 'asc')
);

// Limit results
const q = query(..., limit(10));

// Pagination
const next = query(..., startAfter(lastDoc), limit(10));
```

---

## Caching Strategy

### Client-Side Caching
```javascript
// Cache services
const [services, setServices] = useState([]);
useEffect(() => {
  if (services.length === 0) {
    fetchServices();
  }
}, []);
```

### Server-Side Caching
- Firestore keeps frequently accessed data
- Cloud Functions cache responses
- CDN caches static assets

---

## API Rate Limits

| Resource | Limit | Reset |
|----------|-------|-------|
| Firestore | 50,000/day | Daily |
| Functions | 1 million/month | Monthly |
| Auth | 1,000/hour | Hourly |

---

**For more details, see [README.md](README.md) and [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**
