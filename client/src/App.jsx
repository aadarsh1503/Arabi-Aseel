// src/App.jsx

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

// Import Your Components
import Hero from './components/Hero/Hero';
import Navbar from './components/RootLayout/Navbar/Navbar';
import AboutUs from './components/AboutUs/AboutUs';
import ContactUs from './components/ContactUs/ContactUs';
import Footer from './components/RootLayout/Footer/Footer';
import OurFirst from './components/OurChef/OurFirst';
import Reservation from './components/Reservation/Reservation';
import MenuItem1 from './components/MenuItem1/MenuItem1';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';

// Import Auth and Route Protection
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Import Translation and Direction
import { DirectionProvider } from './components/DirectionContext';
import './i18n';
import { AuthProvider } from './components/Authcontext/Authcontext';
import Chef from './components/Chefs/Chef';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import MarketingCampaign from './components/spinGame/MarketingCampaign';
import AdminWheelConfig from './components/spinGame/AdminWheelConfig';
import AdminSpinLogs from './components/spinGame/AdminSpinLogs';

// MUI Theme (no changes needed here)
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
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <DirectionProvider>
            <Navbar />
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Hero />} />
                <Route path="/aboutUs" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/our-chef" element={<OurFirst />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/menu" element={<MenuItem1 />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sig5436272ertyvv" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/spin-the-game" element={<MarketingCampaign />} />
                {/* <Route path="/spin-admin" element={<AdminWheelConfig />} /> */}


          
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/spin-admin"
                  element={
                    <ProtectedRoute>
                      <AdminWheelConfig />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/logs"
                  element={
                    <ProtectedRoute>
                      <AdminSpinLogs />
                    </ProtectedRoute>
                  }
                />
                
                

                <Route
                  path="/chef"
                  element={
                    <ProtectedRoute>
                      <Chef />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            <Footer />
          </DirectionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;