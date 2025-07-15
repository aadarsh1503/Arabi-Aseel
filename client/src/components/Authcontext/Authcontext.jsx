// src/Authcontext/Authcontext.js

import { createContext, useContext, useState, useEffect } from 'react';
// We don't need useNavigate in this file
// import { useNavigate } from 'react-router-dom';

// CHANGE 1: Import your centralized authApi instance
import { authApi } from '../../api/axiosConfig'; // Adjust the path if necessary

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Your original, working useEffect logic is preserved.
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (token) {
          // CHANGE 2: Use authApi for the /verify call
          const response = await authApi.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.valid) {
            // CHANGE 3: Use authApi for the /me call
            const userResponse = await authApi.get('/auth/me', {
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
  }, []); // Your empty dependency array is correct and is preserved.

  // Your login function is unchanged.
  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  // Your logout function is unchanged.
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

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