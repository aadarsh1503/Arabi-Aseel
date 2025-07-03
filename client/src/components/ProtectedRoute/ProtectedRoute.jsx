// src/components/ProtectedRoute/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';

import { Puff } from 'react-loader-spinner';
import { useAuth } from '../Authcontext/Authcontext';

const ProtectedRoute = ({ children }) => {
  // Get the authentication state and loading status from the context
  const { token, loading } = useAuth();

  // 1. Show a loading indicator while the AuthContext is verifying the token.
  // This is crucial for preventing a "flash" of the login page on app load
  // when the user is already authenticated.
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}>
        <Puff
          height="100"
          width="100"
          color="#8b5cf6" // A purple color matching your admin panel theme
          ariaLabel="puff-loading"
        />
      </div>
    );
  }

  // 2. After the loading check is complete, if there is no token,
  // the user is not authenticated. Redirect them to the login page.
  if (!token) {
    // The `replace` prop prevents the user from going back to the protected
    // route by using the browser's back button.
    return <Navigate to="/login" replace />;
  }

  // 3. If loading is false and a token exists, the user is authenticated.
  // Render the requested component (e.g., <AdminPanel />).
  return children;
};

export default ProtectedRoute;