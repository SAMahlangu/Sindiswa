import '../styles/TimeSlotSelector.css';

function TimeSlotSelector({ slots, selectedTime, onSelect, onBack }) {
  return (
    <div className="time-selector">
      <div className="selector-header">
        <h2>Select a Time</h2>
        <p>Choose your preferred appointment time (Working hours: 09:00 - 17:00)</p>
        <button className="btn btn-link" onClick={onBack}>
          ← Back
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="empty-state">
          <p>No available time slots for this date.</p>
          <p>Please select a different date.</p>
        </div>
      ) : (
        <div className="time-slots-grid">
          {slots.map((slot, index) => (
            <button
              key={index}
              className={`time-slot ${selectedTime?.display === slot.display ? 'selected' : ''}`}
              onClick={() => onSelect(slot)}
            >
              {slot.display}
            </button>
          ))}
        </div>
      )}

      {selectedTime && (
        <div className="selected-time-display">
          <p>Selected Time: <strong>{selectedTime.display}</strong></p>
        </div>
      )}
    </div>
  );
}

export default TimeSlotSelector;
