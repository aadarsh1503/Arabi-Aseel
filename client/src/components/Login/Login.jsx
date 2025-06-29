import React, { useState } from 'react';
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
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({
    email: '',
    password: ''
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      setBackendErrors({ email: '', password: '' });
      
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: values.email,
          password: values.password
        });
        
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        
        toast.success('Login successful! Redirecting...', {
          position: "top-right",
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
          toast.error(error.response?.data?.message || 'Login failed. Please try again.', {
            position: "top-right",
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

  const getError = (field) => {
    return backendErrors[field] || (formik.touched[field] && formik.errors[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
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
        className='mb-32 font-noto-serif'
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
              Login to Arabi Aseel Kitchen
            </Typography>
            <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getError('email'))}
                  helperText={getError('email')}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getError('password'))}
                  helperText={getError('password')}
                  InputProps={{
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
                      sx={{
                        color: 'inherit',
                      }}
                    />
                  ) : (
                    'Sign In'
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