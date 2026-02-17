import '../styles/AdminNav.css';

function AdminNav({ onLogout }) {
  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <div className="admin-nav-brand">
          <span className="logo">💅</span>
          <h1>Admin Panel</h1>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNav;
