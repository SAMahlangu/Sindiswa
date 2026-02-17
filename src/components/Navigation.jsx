import { useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="logo">💅</span>
          <h1>Nail Tech Studio</h1>
        </div>
        <div className="nav-menu">
          <button className="btn btn-link" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="btn btn-link" onClick={() => navigate('/booking')}>
            Book Now
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/login')}>
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
