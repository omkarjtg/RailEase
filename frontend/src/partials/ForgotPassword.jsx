import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import API from '../services/axios';
import { BsArrowLeft } from 'react-icons/bs';
import '../styles/Auth.css';

const ForgotPassword = ({ onClose, onSwitchToLogin }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email address is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        console.log('Sending reset request for email:', values.email);
        const response = await API.post('/auth/forgot-password', {
          email: values.email,
        });
        console.log('API response:', response.data);
        setSuccessMessage(`If an account exists for ${values.email}, we've sent a password reset link`);
        setEmailSent(true);
        setTimeout(() => {
          setSuccessMessage('');
        }, 8000);
      } catch (err) {
        console.error('API error:', {
          message: err.message,
          response: err.response,
          data: err.response?.data,
          status: err.response?.status,
        });

        let errorMessage = 'Failed to send reset email. Please try again.';
        if (err.response) {
          if (err.response.status === 404 || err.response.status === 503) {
            errorMessage = 'The server is currently unavailable. Please try again later.';
          } else if (err.response.status === 400) {
            errorMessage = 'Invalid email address. Please check and try again.';
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.request) {
          errorMessage = 'Unable to connect to the server. Please check your network or try again later.';
        }
        setError(errorMessage);
        setTimeout(() => {
          setError('');
        }, 8000);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="auth-form">
      <div className="auth-header">
        <button
          className="back-button"
          onClick={onSwitchToLogin}
          disabled={loading}
          aria-label="Back to Login"
        >
          <BsArrowLeft size={20} />
        </button>
        <h2>Reset Password</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {!emailSent ? (
        <>
          <p className="instruction-text">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`form-input ${formik.touched.email && formik.errors.email ? 'input-error' : ''
                  }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled={loading}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error-text">{formik.errors.email}</div>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !formik.isValid || !formik.dirty}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="success-state">
          <div className="success-icon" aria-label="Success" role="img">
            ✓
          </div>
          <p className="success-message">
            If your email exists in our system, you'll receive a password reset link shortly.
          </p>
          <button
            className="submit-btn secondary"
            onClick={onClose}
            aria-label="Return to Login"
          >
            Return to Login
          </button>
        </div>
      )}

      <div className="form-footer">
        Remember your password?{' '}
        <button
          type="button"
          className="switch-link"
          onClick={onSwitchToLogin}
          disabled={loading}
        >
          Sign in instead
        </button>
      </div>
    </div>
  );
};

ForgotPassword.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
};

export default ForgotPassword;