import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/axios';
import '../styles/ResetPassword.css';



const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters'),
            // .matches(
            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            //     'Password must contain at least one uppercase, one lowercase, one number and one special character'
            // ),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Please confirm your password')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            console.log("Reset token:", token);

            try {
                await API.post('/auth/reset-password', {
                    token,
                    newPassword: values.newPassword
                });
                setSuccessMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Reset Your Password</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {!successMessage && (
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                className={`form-control ${formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.newPassword}
                            />
                            {formik.touched.newPassword && formik.errors.newPassword && (
                                <div className="invalid-feedback">{formik.errors.newPassword}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;