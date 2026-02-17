import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { serviceService, appointmentService } from '../services/api';
import Navigation from '../components/Navigation';
import ServiceSelector from '../components/ServiceSelector';
import DateSelector from '../components/DateSelector';
import TimeSlotSelector from '../components/TimeSlotSelector';
import ClientInfo from '../components/ClientInfo';
import '../styles/BookingPage.css';

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const WORKING_HOURS = { start: 9, end: 17 };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
      generateTimeSlots();
    }
  }, [selectedService, selectedDate]);

  useEffect(() => {
    if (selectedService) {
      setTotalPrice(selectedService.price);
    }
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      const fetchedServices = await serviceService.getAllServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = async () => {
    if (!selectedService || !selectedDate) return;

    const slotDuration = selectedService.duration_minutes || 30;
    const slots = [];

    // Generate time slots
    for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        if (hour * 60 + minute < WORKING_HOURS.end * 60) {
          slots.push({
            hour: String(hour).padStart(2, '0'),
            minute: String(minute).padStart(2, '0'),
            display: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
          });
        }
      }
    }

    // Check for existing bookings
    const dateString = selectedDate.toISOString().split('T')[0];

    try {
      const appointments = await appointmentService.getAppointmentsByDate(dateString);
      
      const bookedTimes = appointments
        .filter(apt => 
          apt.service_id === selectedService.id && 
          ['pending', 'paid'].includes(apt.status)
        )
        .map(apt => apt.time);

      const availableSlots = slots.filter(slot => !bookedTimes.includes(slot.display));
      setAvailableSlots(availableSlots);
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableSlots(slots);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedTime(null);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      alert('Please complete all fields');
      return;
    }

    // Validation
    if (clientPhone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      // Create appointment object with correct field names for Supabase
      const appointment = {
        client_name: clientName,
        client_phone: clientPhone,
        service_id: selectedService.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime.display,
        deposit_amount: Math.round(selectedService.price * 0.3 * 100) / 100,
        status: 'pending'
      };

      console.log('Creating appointment:', appointment);

      // Create appointment in database
      const appointmentId = await appointmentService.createAppointment(appointment);
      
      console.log('Appointment created with ID:', appointmentId);

      // Show success message
      alert(`✅ Booking Created!\n\nReference: ${appointmentId}\n\nRedirecting to payment...`);

      // Store in session for payment page
      sessionStorage.setItem('pendingAppointment', JSON.stringify({ ...appointment, id: appointmentId }));

      // Navigate to payment
      navigate(`/payment/${appointmentId}`, { state: { appointment: { ...appointment, id: appointmentId } } });
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('❌ Error creating appointment:\n\n' + (error.message || 'Please try again.'));
    }
  };

  return (
    <div className="app-container">
      <Navigation />
      
      <div className="booking-container">
        <div className="booking-wrapper">
          <div className="booking-header">
            <h1>Book Your Appointment</h1>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
            <p className="step-indicator">Step {step} of 4</p>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <ServiceSelector
                services={services}
                loading={loading}
                onSelect={handleServiceSelect}
                selectedService={selectedService}
              />
            )}

            {/* Step 2: Date Selection */}
            {step === 2 && selectedService && (
              <DateSelector
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                onBack={() => setStep(1)}
              />
            )}

            {/* Step 3: Time Selection */}
            {step === 3 && selectedService && selectedDate && (
              <TimeSlotSelector
                slots={availableSlots}
                selectedTime={selectedTime}
                onSelect={handleTimeSelect}
                onBack={() => setStep(2)}
              />
            )}

            {/* Step 4: Client Info */}
            {step === 4 && (
              <ClientInfo
                clientName={clientName}
                setClientName={setClientName}
                clientPhone={clientPhone}
                setClientPhone={setClientPhone}
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                depositAmount={selectedService?.price * 0.3}
                onBack={() => setStep(3)}
                onSubmit={handleSubmit}
              />
            )}

            {/* Summary */}
            {step === 4 && (
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-item">
                  <span>Service:</span>
                  <strong>{selectedService?.name}</strong>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <strong>{selectedDate?.toLocaleDateString()}</strong>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <strong>{selectedTime?.display}</strong>
                </div>
                <div className="summary-item">
                  <span>Service Fee:</span>
                  <strong>R {selectedService?.price.toFixed(2)}</strong>
                </div>
                <div className="summary-item highlight">
                  <span>Deposit (30%):</span>
                  <strong>R {(selectedService?.price * 0.3).toFixed(2)}</strong>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Sidebar Summary */}
        {selectedService && (
          <div className="booking-sidebar">
            <div className="service-preview">
              <h3>{selectedService.name}</h3>
              <p className="description">{selectedService.description}</p>
              <div className="details">
                <p>
                  <strong>Duration:</strong> {selectedService.durationMinutes} minutes
                </p>
                <p>
                  <strong>Price:</strong> R {selectedService.price.toFixed(2)}
                </p>
                <p>
                  <strong>Deposit:</strong> R {(selectedService.price * 0.3).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
