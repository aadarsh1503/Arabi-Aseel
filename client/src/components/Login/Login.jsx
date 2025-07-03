import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Avatar, 
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import "./login.css";

const Login = () => {
  const { t, i18n } = useTranslation(); // Use the hook
  const isRTL = i18n.language === 'ar';
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({
    email: '',
    password: ''
  });

  // Define the validation schema inside the component so it has access to `t`
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('login.validation.email.invalid'))
      .required(t('login.validation.email.required')),
    password: Yup.string()
      .required(t('login.validation.password.required'))
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema, // Use the dynamic schema
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      setBackendErrors({ email: '', password: '' });
      
      try {
        const response = await axios.post('https://arabi-aseel-1.onrender.com/api/auth/login', {
          email: values.email,
          password: values.password
        });
        
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        
        toast.success(t('login.toast.success'), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 2000);
        
      } catch (error) {
        if (error.response?.data?.errors) {
          setBackendErrors({
            email: error.response.data.errors.email || '',
            password: error.response.data.errors.password || ''
          });
        } else {
          toast.error(error.response?.data?.message || t('login.toast.error'), {
            position: isRTL ? "top-left" : "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });
  
  // Re-run validation when language changes
  useEffect(() => {
    formik.validateForm();
  }, [i18n.language]);

  const getError = (field) => {
    return backendErrors[field] || (formik.touched[field] && formik.errors[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <div key={i18n.language}> {/* Add key to force re-render on language change */}
      <ToastContainer 
        position={isRTL ? "top-left" : "top-right"}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={isRTL} // RTL support for toast
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-32' // Removed font-noto-serif, now handled by MUI theme
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              {t('login.title')} {/* Translated Title */}
            </Typography>
            <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <form dir='ltr' onSubmit={handleSubmit} noValidate>
  <TextField
    margin="normal"
    fullWidth
    id="email"
    label={t('login.form.email')}
    name="email"
    autoComplete="email"
    autoFocus
    value={formik.values.email}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={Boolean(getError('email'))}
    helperText={getError('email')}
    // YEH LINE ADD KAREIN: Input ke andar text direction set karne ke liye
    inputProps={{
      dir: isRTL ? 'rtl' : 'ltr',
    }}
  />
  <TextField
    margin="normal"
    fullWidth
    name="password"
    label={t('login.form.password')}
    type={showPassword ? 'text' : 'password'}
    id="password"
    autoComplete="current-password"
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={Boolean(getError('password'))}
    helperText={getError('password')}
    // YEH LINE BHI ADD KAREIN:
    inputProps={{
      dir: isRTL ? 'rtl' : 'ltr',
    }}
    InputProps={{ // Yeh pehle se tha, isko waise hi rehne dein
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
  <Button
    type="submit"
    fullWidth
    variant="contained"
    sx={{ 
      mt: 3, 
      mb: 2, 
      py: 1.5,
      position: 'relative',
      minHeight: '44px',
    }}
    disabled={loading || formik.isSubmitting}
  >
    {loading ? (
      <CircularProgress 
        size={24}
        sx={{ color: 'inherit' }}
      />
    ) : (
      t('login.form.signInButton')
    )}
  </Button>
</form>

            </Paper>
          </Box>
        </Container>
      </motion.div>
    </div>
  );
};

export default Login;