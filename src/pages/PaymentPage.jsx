import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../config/supabase';
import Navigation from '../components/Navigation';
import '../styles/PaymentPage.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(location.state?.appointment || null);

  useEffect(() => {
    // Retrieve appointment from session storage if not in location state
    if (!appointment && appointmentId) {
      const storedAppointment = sessionStorage.getItem('pendingAppointment');
      if (storedAppointment) {
        const stored = JSON.parse(storedAppointment);
        if (stored.id === parseInt(appointmentId)) {
          setAppointment(stored);
        }
      }
    }
    
    if (!appointment && !appointmentId) {
      navigate('/booking');
    }
  }, [appointmentId, appointment, navigate]);

  const handlePaymentClick = async () => {
    setLoading(true);

    try {
      if (!appointment) {
        throw new Error('No appointment found');
      }

      // Prepare PayFast data
      const paymentData = {
        merchant_id: import.meta.env.VITE_PAYFAST_MERCHANT_ID,
        merchant_key: import.meta.env.VITE_PAYFAST_MERCHANT_KEY,
        return_url: `${window.location.origin}/confirmation/${appointment.id}`,
        cancel_url: `${window.location.origin}/booking`,
        notify_url: import.meta.env.VITE_PAYFAST_WEBHOOK_URL,
        name_first: appointment.client_name.split(' ')[0],
        name_last: appointment.client_name.split(' ').slice(1).join(' ') || '',
        email_address: appointment.client_phone + '@nailtechbooking.co.za',
        cell_number: appointment.client_phone,
        m_payment_id: appointment.id,
        amount: (appointment.deposit_amount * 100).toFixed(0),
        item_name: `Appointment Deposit`,
        item_description: `Nail appointment deposit for ${appointment.id}`,
        custom_str1: appointment.client_name,
        email_confirmation: 1,
        confirmation_address: appointment.client_phone + '@nailtechbooking.co.za'
      };

      // Create form and submit to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.payfast.co.za/eng/process';

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
      setLoading(false);
    }
  };

  if (!appointment) {
    return <div className="loader"></div>;
  }

  return (
    <div className="app-container">
      <Navigation />
      
      <div className="payment-container">
        <div className="payment-card">
          <h1>Payment Confirmation</h1>
          
          <div className="payment-summary">
            <div className="summary-section">
              <h3>Appointment Details</h3>
              <div className="detail-row">
                <span>Date:</span>
                <strong>{new Date(appointment.date).toLocaleDateString()}</strong>
              </div>
              <div className="detail-row">
                <span>Time:</span>
                <strong>{appointment.time}</strong>
              </div>
            </div>

            <div className="summary-section">
              <h3>Client Information</h3>
              <div className="detail-row">
                <span>Name:</span>
                <strong>{appointment.client_name}</strong>
              </div>
              <div className="detail-row">
                <span>Phone:</span>
                <strong>{appointment.client_phone}</strong>
              </div>
            </div>

            <div className="summary-section">
              <h3>Payment Details</h3>
              <div className="detail-row">
                <span>Service Amount:</span>
                <strong>R {(appointment.deposit_amount / 0.3).toFixed(2)}</strong>
              </div>
              <div className="detail-row">
                <span>Deposit (30%):</span>
                <strong>R {appointment.deposit_amount.toFixed(2)}</strong>
              </div>
              <div className="highlight">
                <p>The remaining 70% will be due on the day of your appointment.</p>
              </div>
            </div>
          </div>

          <div className="payment-info">
            <h3>Payment Method</h3>
            <p>You will be redirected to PayFast (South Africa's leading payment gateway) to complete your payment securely.</p>
            <p className="accepted-methods">
              ✓ Credit Card | ✓ Debit Card | ✓ EFT | ✓ Bank Transfer
            </p>
          </div>

          <div className="payment-actions">
            <button
              className="btn btn-primary"
              onClick={handlePaymentClick}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to PayFast Payment'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/booking')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          <div className="security-info">
            <p>🔒 Your payment information is secure and encrypted by PayFast.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
