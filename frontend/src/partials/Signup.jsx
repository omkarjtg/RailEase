import React, { useState } from 'react';
import { useFormik } from 'formik';
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import * as Yup from 'yup';
import { login, register } from '../services/AuthService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Auth.css';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .required('Full name is required')
                .min(3, 'Full name must be at least 3 characters'),
            username: Yup.string()
                .required('Username is required')
                .min(3, 'Username must be at least 3 characters'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // First, register the user
                await register({
                    fullName: values.fullName,
                    username: values.username,
                    email: values.email,
                    password: values.password,
                });

                // Then automatically log them in
                const loginResponse = await login({
                    identifier: values.username,
                    password: values.password
                });

                // Pass the user data to the parent component
                onSignupSuccess(loginResponse.user);

                // Show success toast
                toast.success('Signup successful! Welcome to RailEase.');
            } catch (err) {
                console.error('Signup failed:', err);
                toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="auth-form">
            <h2>Create Your RailEase Account</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-field">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className={formik.touched.fullName && formik.errors.fullName ? 'input-error' : ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullName}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                        <div className="error-text">{formik.errors.fullName}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className={formik.touched.username && formik.errors.username ? 'input-error' : ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div className="error-text">{formik.errors.username}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="error-text">{formik.errors.email}</div>
                    )}
                </div>

                <div className="form-field password-field">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <div className="error-text">{formik.errors.password}</div>
                    )}
                </div>

                <div className="form-field password-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-wrapper">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'input-error' : ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                        </button>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className="error-text">{formik.errors.confirmPassword}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <div className="form-footer">
                Already have an account?{' '}
                <button className="switch-link" onClick={onSwitchToLogin}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default Signup;