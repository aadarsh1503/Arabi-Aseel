// authContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Initialize auth state on app load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (token) {
          // Verify token with backend
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.valid) {
            // Optionally fetch user data if not stored in token
            const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userResponse.data);
          } else {
            logout();
          }
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Add this to your context value if you want to check loading state
  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);