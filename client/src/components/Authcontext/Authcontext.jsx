import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // CHANGE 1: Read from 'authToken'
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      // No need to pass headers manually, the interceptor does it!
      if (token) {
        try {
          // The interceptor will add the token header automatically
          const userResponse = await api.get('/auth/me'); 
          setUser(userResponse.data);
        } catch (error) {
          // The interceptor will handle 401s and redirect.
          // We can just log out the state here.
          console.error("Session verification failed", error);
          logout();
        }
      }
      setLoading(false);
    };
    verifySession();
  }, [token]); // Run this effect when the token changes

  const login = (newToken, userData) => {
    // CHANGE 2: Save to 'authToken'
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    // CHANGE 3: Remove from 'authToken'
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only when loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);