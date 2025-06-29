import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Hero from './components/Hero/Hero';
import Navbar from './components/RootLayout/Navbar/Navbar';
import AboutUs from './components/AboutUs/AboutUs';
import ContactUs from './components/ContactUs/ContactUs';
import Footer from './components/RootLayout/Footer/Footer';
import OurFirst from './components/OurChef/OurFirst';
import Reservation from './components/Reservation/Reservation';
import MenuItem1 from './components/MenuItem1/MenuItem1';
import { DirectionProvider } from './components/DirectionContext';
import './i18n';
import axios from 'axios';

import AdminPanel from './components/AdminPanel/AdminPanel';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});



const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

function App() {
  useEffect(() => {
    
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (token && tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      window.location.href = '/login';
    }

    // Axios interceptors
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        
        if (token && tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
  
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DirectionProvider>
          <>
            <Navbar /> {/* Show always */}
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/our-chef" element={<OurFirst />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/menu" element={<MenuItem1 />} />
              <Route path="/login" element={<Login />} />
            

              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer /> {/* Show always */}
          </>
        </DirectionProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;