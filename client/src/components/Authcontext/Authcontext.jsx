import { createContext, useContext, useState, useEffect } from 'react';

const BASEURL = import.meta.env.VITE_API_BASE_URL || '';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // CHANGE 1: Read from 'authToken'
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      // Only verify if there's a token
      if (token) {
        try {
          // The interceptor will add the token header automatically
          const userResponse = await fetch(`${BASEURL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await userResponse.json();
          setUser(data);
        } catch (error) {
          // Token is invalid, clear it
          console.error("Session verification failed", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      // Always set loading to false after verification attempt
      setLoading(false);
    };
    verifySession();
  }, []); // Only run once on mount

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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);