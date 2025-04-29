import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BsEyeSlashFill, BsEyeFill } from 'react-icons/bs';
import {jwtDecode} from 'jwt-decode';
import { login } from '../services/AuthService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Auth.css';

const Login = ({ onLoginSuccess, onSwitchToSignup, onForgotPassword }) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            identifier: '',
            password: '',
        },
        validationSchema: Yup.object({
            identifier: Yup.string().required('Username or email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await login(values);
                const { accessToken } = response;

                // Decode the JWT token to get user info
                const decodedToken = jwtDecode(accessToken);

                // Construct userInfo from decoded token
                const userInfo = {
                    username: decodedToken.sub, // Use 'sub' for username
                    role: decodedToken.role,
                    userId: decodedToken.userId,
                    email: decodedToken.email || values.identifier, // Fallback to identifier if email not in token
                };

                // Store token and user info in localStorage
                localStorage.setItem('token', accessToken);
                localStorage.setItem('user', JSON.stringify(userInfo));

                // Pass userInfo to onLoginSuccess
                onLoginSuccess({ ...userInfo, accessToken });

                // Show success toast
                toast.success('Login successful!');
            } catch (err) {
                console.error('Login failed:', err);
                toast.error(err.message || 'Login failed. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            formik.handleSubmit();
        }
    };

    return (
        <div className="auth-form">
            <h2>Login to RailEase</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-field">
                    <label htmlFor="identifier">Username or Email</label>
                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        className={formik.touched.identifier && formik.errors.identifier ? 'input-error' : ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.identifier}
                        onKeyDown={handleKeyDown}
                    />
                    {formik.touched.identifier && formik.errors.identifier && (
                        <div className="error-text">{formik.errors.identifier}</div>
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
                            onKeyDown={handleKeyDown}
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

                <div className="switch-link">
                    <button type="button" className="switch-link" onClick={onForgotPassword}>
                        Forgot Password?
                    </button>
                </div>
                <br />
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="form-footer">
                Don't have an account?{' '}
                <button type="button" className="switch-link" onClick={onSwitchToSignup}>
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default Login;