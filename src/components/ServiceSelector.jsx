import '../styles/ServiceSelector.css';

function ServiceSelector({ services, loading, onSelect, selectedService }) {
  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="service-selector">
      <h2>Select a Service</h2>
      <p>Choose the nail service you want to book</p>

      {services.length === 0 ? (
        <p className="empty-state">No services available</p>
      ) : (
        <div className="services-options">
          {services.map(service => (
            <div
              key={service.id}
              className={`service-option ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => onSelect(service)}
            >
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={selectedService?.id === service.id}
                onChange={() => onSelect(service)}
              />
              <div className="option-content">
                <h4>{service.name}</h4>
                <p>{service.description}</p>
                <div className="option-meta">
                  <span>⏱️ {service.durationMinutes} minutes</span>
                  <span className="price">R {service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceSelector;
