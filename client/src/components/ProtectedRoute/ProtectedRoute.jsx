import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  console.log('ProtectedRoute - token exists:', !!token); // Debug line

  if (!token) {
    console.log('No token - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log('Token expires at:', new Date(decoded.exp * 1000)); // Debug line

    if (decoded.exp < currentTime) {
      console.log('Token expired - redirecting');
      localStorage.removeItem('adminToken');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('Token invalid:', error);
    localStorage.removeItem('adminToken');
    return <Navigate to="/login" replace />;
  }

  console.log('Access granted to protected route');
  return children;
};

export default ProtectedRoute;