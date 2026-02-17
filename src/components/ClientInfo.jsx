import '../styles/ClientInfo.css';

function ClientInfo({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  selectedService,
  selectedDate,
  selectedTime,
  depositAmount,
  onBack,
  onSubmit
}) {
  const isValid = clientName.trim().length > 0 && clientPhone.length >= 10;

  return (
    <div className="client-info">
      <div className="selector-header">
        <h2>Your Information</h2>
        <p>Enter your details to complete the booking</p>
        <button className="btn btn-link" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="client-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter your phone number (10 digits)"
            required
            minLength="10"
          />
          <small>Include country code or use format: 27123456789</small>
        </div>

        <div className="booking-preview">
          <h3>Booking Summary</h3>
          <div className="preview-item">
            <span>Service:</span>
            <strong>{selectedService?.name}</strong>
          </div>
          <div className="preview-item">
            <span>Date:</span>
            <strong>{selectedDate?.toLocaleDateString()}</strong>
          </div>
          <div className="preview-item">
            <span>Time:</span>
            <strong>{selectedTime?.display}</strong>
          </div>
          <div className="preview-item">
            <span>Service Price:</span>
            <strong>R {selectedService?.price.toFixed(2)}</strong>
          </div>
          <div className="preview-item highlight">
            <span>Deposit (30%):</span>
            <strong>R {depositAmount?.toFixed(2)}</strong>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={!isValid}
          >
            Proceed to Payment
          </button>
        </div>

        <p className="terms">
          By booking, you agree to our cancellation policy. 
          Cancellations must be made 24 hours in advance.
        </p>
      </div>
    </div>
  );
}

export default ClientInfo;
