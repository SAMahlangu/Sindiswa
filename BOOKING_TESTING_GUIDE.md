# Booking System Testing Checklist

## 🎯 Test 1: Complete Booking Flow

### 1.1: Homepage & Service Selection
- [ ] Open http://localhost:5173
- [ ] Homepage displays all services
- [ ] Each service shows:
  - [ ] Service name
  - [ ] Price
  - [ ] Duration
  - [ ] Description
- [ ] Click "Book Now" on any service
- [ ] Redirected to booking page with service pre-selected

### 1.2: Date Selection
- [ ] Calendar appears
- [ ] Can select a future date
- [ ] Past dates are disabled (greyed out)
- [ ] Selected date is highlighted
- [ ] Click "Next" to proceed

### 1.3: Time Slot Selection
- [ ] Time slots appear for selected date
- [ ] Slots are in 30-minute intervals (or service duration)
- [ ] Available slots are clickable
- [ ] Booked slots show as unavailable (greyed out)
- [ ] Select a time slot
- [ ] Click "Next" to proceed

### 1.4: Client Information
- [ ] Name field appears
- [ ] Phone field appears
- [ ] Can enter test data:
  - Name: "John Doe"
  - Phone: "0123456789"
- [ ] Click "Next" or "Confirm Booking"

### 1.5: Booking Summary
- [ ] Summary shows:
  - [ ] Service name
  - [ ] Date
  - [ ] Time
  - [ ] Deposit amount (30%)
- [ ] Can go back and edit
- [ ] Click "Proceed to Payment" (or "Confirm")

### 1.6: After Booking
- [ ] Redirected to confirmation/payment page
- [ ] Shows booking reference or success message
- [ ] No console errors

---

## 🎯 Test 2: Admin Dashboard - Bookings

### 2.1: Login
- [ ] Go to http://localhost:5173/admin/login
- [ ] Enter admin credentials
- [ ] Successfully logged in
- [ ] Redirected to /admin/dashboard

### 2.2: View Bookings
- [ ] Dashboard shows bookings tab
- [ ] Bookings from Test 1 appear in the list
- [ ] Booking shows:
  - [ ] Client name ✓
  - [ ] Phone ✓
  - [ ] Service ID ✓
  - [ ] Date ✓
  - [ ] Time ✓
  - [ ] Deposit amount ✓
  - [ ] Status (pending) ✓

### 2.3: Filter by Date
- [ ] Date filter works
- [ ] Only shows bookings for selected date
- [ ] Can clear filter

### 2.4: Update Booking Status
- [ ] For "pending" bookings, can "Cancel"
- [ ] For "paid" bookings, can "Complete" or "Cancel"
- [ ] Status updates in real-time
- [ ] No errors

---

## 🎯 Test 3: Services Management

### 3.1: View Services
- [ ] Services tab shows all services
- [ ] Each service displays:
  - [ ] Name
  - [ ] Price
  - [ ] Duration
  - [ ] Description
  - [ ] Edit button
  - [ ] Delete button

### 3.2: Add Service
- [ ] Click "Add Service" button
- [ ] Form appears with fields:
  - [ ] Service Name
  - [ ] Price (R)
  - [ ] Duration (minutes)
  - [ ] Description
- [ ] Fill in test data:
  - Name: "Test Manicure"
  - Price: 150.00
  - Duration: 30
  - Description: "Test service"
- [ ] Click "Add Service"
- [ ] Service appears in list
- [ ] No form errors

### 3.3: Edit Service
- [ ] Click edit on a service
- [ ] Form pre-fills with service data
- [ ] Can change any field
- [ ] Click "Update Service"
- [ ] Changes save
- [ ] List updates

### 3.4: Delete Service
- [ ] Click delete on a service
- [ ] Confirmation dialog appears
- [ ] Click "Yes, delete"
- [ ] Service removed from list
- [ ] No errors

---

## 🎯 Test 4: Double Booking Prevention

### 4.1: Book First Appointment
- [ ] Book Gel Manicure for 2026-02-20 at 09:00
- [ ] Confirmed and saved

### 4.2: Try to Book Same Slot
- [ ] Book another appointment
- [ ] Select same service (or different)
- [ ] Select same date: 2026-02-20
- [ ] Select same time: 09:00
- [ ] Time slot should NOT appear in available slots
- [ ] Or if it does, error when trying to confirm

### 4.3: Book Different Slot (Same Date)
- [ ] Select 2026-02-20 again
- [ ] Select different time (e.g., 09:30)
- [ ] Should be available ✓
- [ ] Can book successfully

---

## 🎯 Test 5: Dashboard Stats

### 5.1: Stats Cards
- [ ] Total Bookings: Shows correct count
- [ ] Confirmed Bookings: Shows paid count
- [ ] Total Revenue: Shows sum of deposits
- [ ] Active Services: Shows service count

### 5.2: Stats Update
- [ ] Create new booking in Test 1
- [ ] Refresh dashboard
- [ ] Stats increase correctly

---

## 🎯 Test 6: Data Validation

### 6.1: Booking Validation
- [ ] Empty name shows error
- [ ] Empty phone shows error
- [ ] Invalid phone (< 10 digits) shows error
- [ ] Can't proceed without all fields filled

### 6.2: Service Validation
- [ ] Empty service name shows error
- [ ] Empty price shows error
- [ ] Negative price not allowed
- [ ] Invalid duration not allowed

---

## 🎯 Test 7: Database Verification

### 7.1: Check Appointments Table
1. Go to Supabase dashboard
2. Table Editor → appointments
3. Verify your test booking exists with:
   - [ ] client_name
   - [ ] client_phone
   - [ ] service_id
   - [ ] date
   - [ ] time
   - [ ] deposit_amount
   - [ ] status: "pending"

### 7.2: Check Services Table
1. Table Editor → services
2. Verify services exist with:
   - [ ] name
   - [ ] price
   - [ ] duration_minutes
   - [ ] description

---

## 🎯 Test 8: Console Errors

- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Run through all tests
- [ ] Should see NO red errors
- [ ] Warnings are OK (yellow)

---

## ✅ Completion Checklist

After running all tests, confirm:
- [ ] All 8 test sections passed
- [ ] No console errors
- [ ] Data saved correctly to Supabase
- [ ] Admin can manage bookings
- [ ] Time slots prevent double booking
- [ ] Services can be managed

---

## 🐛 Common Issues & Fixes

### Issue: "Appointment not created"
- Check browser console for errors
- Check Supabase connection in `.env.local`
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct

### Issue: "Time slots not appearing"
- Check service has duration_minutes value
- Check date is in future
- Check `getAppointmentsByDate` is working

### Issue: "Admin dashboard is empty"
- Check you're logged in
- Check appointments table has data in Supabase
- Check field names match (client_name vs clientName)

### Issue: "Services don't show"
- Check services table has data
- Check `getAllServices` is being called
- Check field names in display

---

## 📞 Questions?

If any test fails, note:
1. Which test number
2. What was expected
3. What actually happened
4. Any console errors

Then we can debug together! 🔧
