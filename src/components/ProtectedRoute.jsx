import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loader"></div>;
  }

  return user ? children : <Navigate to="/admin/login" />;
}

export default ProtectedRoute;
