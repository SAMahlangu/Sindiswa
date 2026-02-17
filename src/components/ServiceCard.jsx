import '../styles/ServiceCard.css';
import { useState } from 'react';

function ServiceCard({ service, onBook, image }) {
  const [imageError, setImageError] = useState(false);

  // Use service's image_url if available, otherwise use the demo image passed as prop
  const displayImage = service.image_url || image;

  return (
    <div className="service-card">
      {displayImage && !imageError && (
        <div className="card-image">
          <img 
            src={displayImage} 
            alt={service.name}
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="card-content">
        <h3>{service.name}</h3>
        <p className="description">{service.description}</p>
        
        <div className="card-info">
          <div className="info-item">
            <span className="label">Duration</span>
            <span className="value">{service.duration_minutes} min</span>
          </div>
          <div className="info-item">
            <span className="label">Price</span>
            <span className="value price">R {service.price.toFixed(2)}</span>
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={onBook}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
