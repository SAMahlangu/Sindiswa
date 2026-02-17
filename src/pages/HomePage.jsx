import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { serviceService, settingsService } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import Navigation from '../components/Navigation';
import '../styles/HomePage.css';

// Demo nail art images from Pexels (free to use)
const DEMO_IMAGES = [
  'https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg',
  'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg',
  'https://images.pexels.com/photos/939836/pexels-photo-939836.jpg',
  'https://images.pexels.com/photos/4677845/pexels-photo-4677845.jpeg',
  'https://images.pexels.com/photos/939835/pexels-photo-939835.jpg',
  'https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg'
];

function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('Nail Tech Studio');

  useEffect(() => {
    fetchServices();
    fetchSettings();
  }, []);

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

  const fetchSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (settings && settings.business_name) {
        setBusinessName(settings.business_name);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleBooking = (service) => {
    navigate('/booking', { state: { selectedService: service } });
  };

  return (
    <div className="app-container">
      <Navigation />
      
      <div className="hero-section" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/1164339/pexels-photo-1164339.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{businessName}</h1>
          <p>Beautiful nails deserve beautiful hands</p>
          <button className="btn btn-primary" onClick={() => navigate('/booking')}>
            Book Now
          </button>
        </div>
      </div>

      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          
          {loading ? (
            <div className="loader"></div>
          ) : services.length === 0 ? (
            <p className="empty-state">No services available at the moment.</p>
          ) : (
            <div className="services-grid">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={() => handleBooking(service)}
                  image={DEMO_IMAGES[index % DEMO_IMAGES.length]}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <h2>Get in Touch</h2>
          <div className="contact-info">
            <p>📞 +27 (0)11 XXX XXXX</p>
            <p>📧 hello@nailtechstudio.co.za</p>
            <p>📍 Johannesburg, South Africa</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Nail Tech Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
