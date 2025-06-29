import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Avatar, 
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);
  const toastId = React.useRef(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.post('http://localhost:5000/api/auth/signup', {
          name: values.name,
          email: values.email,
          password: values.password
        });
        
        // Show success toast with countdown
        toastId.current = toast.success(`Account created successfully! Redirecting in ${countdown} seconds...`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: 'success-toast'
        });
        
        setIsSuccess(true);
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            const newCount = prev - 1;
            if (newCount <= 0) {
              clearInterval(timer);
              return 0;
            }
            return newCount;
          });
        }, 1000);
        
        // Redirect to login after 5 seconds
        setTimeout(() => {
          clearInterval(timer);
          navigate('/login');
        }, 5000);
        
      } catch (error) {
        console.error(error);
        formik.setErrors({ email: 'Email already exists' });
        toast.error('Failed to create account. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    }
  });

  // Update the countdown message
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      toast.update(toastId.current, {
        render: `Account created successfully! Redirecting in ${countdown} seconds...`,
      });
    }
  }, [countdown, isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='mb-32'
    >
      {/* Toast Container should be placed at the root level */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
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
            Sign Up for Arabi Aseel Kitchen
          </Typography>
          <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link href="/login" variant="body2">
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Signup;