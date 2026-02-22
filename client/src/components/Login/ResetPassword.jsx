import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { LockResetOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const BASEURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, t('resetPasswordValidationPasswordMin'))
      .required(t('resetPasswordValidationPasswordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('resetPasswordValidationConfirmPasswordMatch'))
      .required(t('resetPasswordValidationConfirmPasswordRequired')),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(`${BASEURL}/api/auth/reset-password/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password: values.password })
        });
        const data = await response.json();
        toast.success(data.message || t('resetPasswordToastSuccess'), {
          position: isRTL ? "top-left" : "top-right", theme: "colored",
        });
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        toast.error(error.response?.data?.message || t('resetPasswordToastError'), {
          position: isRTL ? "top-left" : "top-right", theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
       className='lg:mb-32 mb-8'
    >
      <Container  component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockResetOutlined />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            {t('resetPasswordTitle')}
          </Typography>
          <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <form dir='ltr' onSubmit={formik.handleSubmit} noValidate>
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label={t('resetPasswordFormPassword')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                inputProps={{ dir: isRTL ? 'rtl' : 'ltr' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                label={t('resetPasswordFormConfirmPassword')}
                type="password"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                inputProps={{ dir: isRTL ? 'rtl' : 'ltr' }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : t('resetPasswordFormResetButton')}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </motion.div>
  );
};

export default ResetPassword;