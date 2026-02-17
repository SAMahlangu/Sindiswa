import { useState } from 'react';
import '../styles/DateSelector.css';

function DateSelector({ selectedDate, onSelect, onBack }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isPastDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handleDayClick = (day) => {
    if (!isPastDate(day)) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onSelect(date);
    }
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = generateCalendar();

  return (
    <div className="date-selector">
      <div className="selector-header">
        <h2>Select a Date</h2>
        <p>Choose your preferred appointment date</p>
        <button className="btn btn-link" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          <button
            className="nav-btn"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            ←
          </button>
          <h3>{monthName}</h3>
          <button
            className="nav-btn"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            →
          </button>
        </div>

        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="days-grid">
          {calendarDays.map((day, index) => (
            <div key={index} className="day-cell">
              {day && !isPastDate(day) && (
                <button
                  className={`day-btn ${isSelected(day) ? 'selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </button>
              )}
              {day && isPastDate(day) && (
                <div className="day-disabled">{day}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="selected-date-display">
          <p>Selected: <strong>{selectedDate.toLocaleDateString()}</strong></p>
        </div>
      )}
    </div>
  );
}

export default DateSelector;
