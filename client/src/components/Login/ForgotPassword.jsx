import React, { useState, useEffect } from 'react'; // <-- Import useEffect
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
  Alert
} from '@mui/material';
import { EmailOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../api/axiosConfig';
import { CheckCircleIcon, TicketCheck } from 'lucide-react';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // This schema is re-created on every render with the correct t() function
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('forgotPasswordValidationEmailInvalid'))
      .required(t('forgotPasswordValidationEmailRequired')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setMessage('');
      try {
        const response = await api.post('/auth/forgot-password', { email: values.email });
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.message || t('forgotPasswordToastError'));
      } finally {
        setLoading(false);
      }
    },
  });

  // --- THE FIX IS HERE ---
  // This effect runs whenever the language changes.
  // It tells Formik to re-run validation, which makes it use the
  // new validationSchema with the updated translations.
  useEffect(() => {
    formik.validateForm();
  }, [i18n.language]);
  // -------------------------

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='lg:mb-32 mb-8'
    >
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <EmailOutlined />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            {t('forgotPasswordTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            {t('forgotPasswordInstructions')}
          </Typography>
          <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <form dir='ltr' onSubmit={formik.handleSubmit} noValidate>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label={t('forgotPasswordFormEmail')}
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                inputProps={{ dir: isRTL ? 'rtl' : 'ltr' }}
              />

{message && (
  <Alert
    severity="success"
    icon={<CheckCircleIcon sx={{ color: 'white' }} />}  // white tick icon
    sx={{
      mt: 2,
      backgroundColor: '#4caf50', // green background for the icon area
      color: 'white',             // white text
      '& .MuiAlert-icon': {
        backgroundColor: '#4caf50',
      },
    }}
  >
    {message}
  </Alert>
)}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : t('forgotPasswordFormSendButton')}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </motion.div>
  );
};

export default ForgotPassword;