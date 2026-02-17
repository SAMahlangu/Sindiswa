import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import Navigation from '../components/Navigation';
import '../styles/ConfirmationPage.css';

function ConfirmationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointment();
    // Check payment status from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'paid') {
      setPaymentStatus('paid');
      updateAppointmentStatus('paid');
    }
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (fetchError) throw fetchError;
      
      if (data) {
        setAppointment(data);
      } else {
        setError('Appointment not found');
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Error loading appointment details');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (status) => {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          status: status,
          paid_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navigation />
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="app-container">
        <Navigation />
        <div className="confirmation-container">
          <div className="confirmation-card error">
            <h1>⚠️ Error</h1>
            <p>{error || 'Unable to load appointment details'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isConfirmed = appointment.status === 'paid' || paymentStatus === 'paid';

  return (
    <div className="app-container">
      <Navigation />
      
      <div className="confirmation-container">
        <div className={`confirmation-card ${isConfirmed ? 'success' : 'pending'}`}>
          <div className="confirmation-icon">
            {isConfirmed ? '✓' : '⏳'}
          </div>

          <h1>
            {isConfirmed ? 'Booking Confirmed!' : 'Booking Pending Payment'}
          </h1>

          <p className="confirmation-message">
            {isConfirmed
              ? 'Your appointment has been successfully booked and paid.'
              : 'Your appointment has been created. Please complete the payment.'}
          </p>

          <div className="confirmation-details">
            <div className="detail-section">
              <h3>Appointment Details</h3>
              <div className="detail-item">
                <span className="label">Booking Reference:</span>
                <span className="value">{appointmentId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Service:</span>
                <span className="value">{appointment.service_id}</span>
              </div>
              <div className="detail-item">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(appointment.date).toLocaleDateString('en-ZA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Time:</span>
                <span className="value">{appointment.time}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Client Information</h3>
              <div className="detail-item">
                <span className="label">Name:</span>
                <span className="value">{appointment.client_name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{appointment.client_phone}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Payment Information</h3>
              <div className="detail-item">
                <span className="label">Deposit Paid:</span>
                <span className="value">R {(appointment.deposit_amount || 0).toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Balance Due:</span>
                <span className="value">
                  R {((appointment.deposit_amount || 0) / 0.3 * 0.7).toFixed(2)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className={`badge ${appointment.status}`}>
                  {appointment.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="confirmation-info">
            <h3>Next Steps</h3>
            <ul>
              <li>Check your email for confirmation details</li>
              <li>Arrive 5-10 minutes before your appointment</li>
              <li>Payment of remaining balance required on the day</li>
              <li>Cancellations must be made 24 hours in advance</li>
            </ul>
          </div>

          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Return to Home
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/booking')}>
              Make Another Booking
            </button>
          </div>
        </div>

        <div className="confirmation-contact">
          <h3>Have Questions?</h3>
          <p>Contact us at:</p>
          <p>📞 +27 (0)11 XXX XXXX</p>
          <p>📧 hello@nailtechstudio.co.za</p>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
