# PayFast Payment Gateway Integration Guide

## Step 1: Create PayFast Merchant Account ✅

### 1.1: Signup
1. Go to https://www.payfast.co.za/
2. Click "Sign up" → "Merchant"
3. Fill in your business details:
   - Business Name: `Sindiswa Nail Tech`
   - Email: Your business email
   - Phone: Your business phone
4. Create account and verify email

### 1.2: Get Credentials
1. Log into PayFast merchant dashboard
2. Go to **Settings** (top menu)
3. Click **API Details**
4. You'll see:
   - **Merchant ID**: 10-digit number
   - **Merchant Key**: Long alphanumeric string
5. Save these for next step

### 1.3: Test Mode vs Live Mode
- **Test Mode**: Use for development/testing (no real charges)
- **Live Mode**: Production (real payments)
- Toggle in PayFast dashboard: **Settings → Test Mode**

---

## Step 2: Update Environment Variables ✅

Edit `.env.local` with your PayFast credentials:

```
VITE_PAYFAST_MERCHANT_ID=YOUR_MERCHANT_ID
VITE_PAYFAST_MERCHANT_KEY=YOUR_MERCHANT_KEY
VITE_PAYFAST_WEBHOOK_URL=http://localhost:5173/api/payfast-webhook
```

### For Testing:
- Use the Test Merchant ID and Key (provided in test docs)
- Or create separate test account

### For Production:
- Use your real Merchant ID and Key
- Update webhook URL to your deployed domain

---

## Step 3: Understanding the Payment Flow ✅

```
Client Books Appointment
    ↓
Creates Appointment in Database (status: 'pending')
    ↓
Goes to Payment Page
    ↓
Clicks "Proceed to PayFast Payment"
    ↓
Redirected to PayFast.co.za (Secure Payment Gateway)
    ↓
Enters Payment Details (Credit Card, EFT, etc.)
    ↓
PayFast Processes Payment
    ↓
PayFast Sends Webhook to Your Server
    ↓
Webhook Updates Appointment Status to 'paid'
    ↓
User Redirected to Confirmation Page
    ↓
✅ Appointment Confirmed!
```

---

## Step 4: PayFast Payment Form (Frontend) ✅

The PaymentPage.jsx should:

1. **Display appointment details**
   - Service name
   - Date & time
   - Deposit amount (30%)

2. **Create hidden form** with PayFast data
   - Merchant ID & Key
   - Amount
   - Client info
   - Callback URLs

3. **Redirect to PayFast** when user clicks "Pay"

### Key Fields:
```javascript
{
  merchant_id: "MERCHANT_ID",           // From PayFast
  merchant_key: "MERCHANT_KEY",          // From PayFast
  return_url: "https://app.com/confirmation/123",  // After success
  cancel_url: "https://app.com/booking",           // If cancelled
  notify_url: "https://app.com/api/payfast-webhook",  // Webhook
  amount: 599.70,                       // In cents * 100
  item_name: "Gel Manicure - Deposit",
  m_payment_id: "APPOINTMENT_ID",       // Reference
  name_first: "John",
  name_last: "Doe",
  email_address: "john@example.com"
}
```

---

## Step 5: PayFast Webhook Handler (Backend) ✅

### What is a Webhook?
- A callback from PayFast to your server
- Tells you payment succeeded or failed
- Happens **after** user completes payment

### What the Webhook Should Do:
1. **Receive** payment status from PayFast
2. **Verify** the payment signature (security)
3. **Update** appointment status in database
4. **Send** confirmation email to client
5. **Return** 200 OK to PayFast

### Webhook Data from PayFast:
```
m_payment_id: "APPOINTMENT_ID"
payment_status: "COMPLETE" or "FAILED"
amount_gross: 599.70
amount_fee: 15.99
amount_net: 583.71
custom_str1: "CLIENT_NAME"
```

---

## Step 6: Test Payment Flow ✅

### 6.1: Local Testing (Test Mode)
1. Start dev server: `npm run dev`
2. Create a test appointment:
   - Select service
   - Pick date & time
   - Enter name & phone
   - Click "Proceed to PayFast Payment"

3. PayFast Test Card Details:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - CVC: Any 3 digits

4. After "payment":
   - You should be redirected to confirmation page
   - Appointment status should be 'paid' in database

### 6.2: Check Webhook
1. Go to PayFast Dashboard
2. **Settings → Webhooks**
3. Check recent webhooks were received
4. Verify status was "COMPLETE"

### 6.3: Verify Database
1. Go to Supabase dashboard
2. **Table Editor → appointments**
3. Find your test appointment
4. Status should be "paid"
5. `payfast_reference` should have PayFast transaction ID

---

## Step 7: Deploy to Production ✅

### 7.1: Switch to Live Mode
1. Go to PayFast Dashboard
2. **Settings → Test Mode**
3. Toggle OFF to enable Live Mode

### 7.2: Update Production Credentials
In production `.env`:
```
VITE_PAYFAST_MERCHANT_ID=YOUR_LIVE_MERCHANT_ID
VITE_PAYFAST_MERCHANT_KEY=YOUR_LIVE_MERCHANT_KEY
VITE_PAYFAST_WEBHOOK_URL=https://your-domain.com/api/payfast-webhook
```

### 7.3: Deploy to Vercel
```bash
git add .env
git commit -m "Add PayFast production credentials"
git push
```

Vercel automatically deploys and your production app will use live PayFast.

---

## Step 8: Email Notifications (Optional) ✅

After webhook confirms payment, send email to client:
```
Subject: Booking Confirmed - Sindiswa Nail Tech

Dear [Client Name],

Your appointment has been confirmed!

Service: [Service Name]
Date: [Date]
Time: [Time]
Reference: [Payment Reference]

Please arrive 5 minutes early.
```

---

## Troubleshooting

### Issue: PayFast Form Not Submitting
- ✅ Check merchant ID and key are correct
- ✅ Check amount is in cents (multiply by 100)
- ✅ Check return_url and cancel_url are valid URLs

### Issue: Webhook Not Received
- ✅ Check webhook URL is publicly accessible
- ✅ Check webhook URL in PayFast settings matches code
- ✅ Check firewall/CORS allows PayFast IPs
- ✅ Check logs for errors

### Issue: Payment Shows as Pending (Not Updated)
- ✅ Webhook might not have received yet (wait 30 seconds)
- ✅ Check database for webhook data
- ✅ Check webhook logs in PayFast dashboard
- ✅ Manually verify payment in PayFast dashboard

### Issue: Test Payment Works, Live Doesn't
- ✅ Check Live Mode is enabled in PayFast
- ✅ Check credentials are LIVE (not test)
- ✅ Check webhook URL is production domain (not localhost)
- ✅ Check bank details are verified in PayFast

---

## Security Best Practices

### Never Commit Credentials ✅
```bash
# .gitignore
.env.local
.env
```

### Verify PayFast Signature ✅
Always verify webhook signature before processing:
```javascript
const signature = generateSignature(paymentData, merchantKey);
if (signature !== receivedSignature) {
  throw new Error('Invalid signature - potential security issue');
}
```

### Use HTTPS Only ✅
PayFast requires HTTPS for webhook URL (not HTTP)

### Store Payment Reference ✅
Save PayFast transaction ID in database for reconciliation

---

## Test Cards (PayFast Test Mode)

| Type | Number | Notes |
|------|--------|-------|
| VISA | 4111111111111111 | Always succeeds |
| Mastercard | 5200828282828210 | Always succeeds |
| Amex | 378282246310005 | Always succeeds |

---

## PayFast Resources

- Dashboard: https://www.payfast.co.za/merchant/dashboard
- Documentation: https://payfast.io/integration/overview/
- API Docs: https://payfast.io/en/documentation/api/
- Support: support@payfast.co.za

---

## Summary Checklist

- ✅ Create PayFast merchant account
- ✅ Get Merchant ID and Merchant Key
- ✅ Update `.env.local` with credentials
- ✅ Review PaymentPage.jsx implementation
- ✅ Test with test mode payment
- ✅ Verify webhook is received
- ✅ Check appointment status updates
- ✅ Test confirmation page
- ✅ Deploy to production
- ✅ Switch PayFast to Live Mode
- ✅ Update production credentials
- ✅ Test live payment

---

**Next: Let me fix the PaymentPage.jsx to use Supabase instead of Firebase!**
