import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AuthContext } from '../AuthContext';
import * as Yup from 'yup';
import axios from 'axios';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = ({ onClose, onLoginClick }) => {
    const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const userData = {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    isAdmin: false,
                };
        
                const res = await axios.post("http://localhost:8081/users/add", userData);
                const token = res.data; // Assuming the backend returns the JWT token
        
                localStorage.setItem('token', token); // Store JWT in localStorage
                login({ username: values.username, token }); // Update context/state with JWT token
                onClose();
                navigate('/');
            } catch (error) {
                console.error("Registration failed:", error);
            }
        },
    });

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h5 className="modal-title">Register</h5>
                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="usernameInput">Username</label>
                            <input
                                id="usernameInput"
                                type="text"
                                className={`form-control ${formik.touched.username && formik.errors.username ? 'input-error' : ''}`}
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username && (
                                <div className="error-message">{formik.errors.username}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailInput">Email</label>
                            <input
                                id="emailInput"
                                type="email"
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="error-message">{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordInput">Password</label>
                            <input
                                id="passwordInput"
                                type={showPassword ? 'text' : 'password'}
                                className={`form-control ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
                                {...formik.getFieldProps('password')}
                            /> 
                            <button
                                type="button"
                                className="eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                            {formik.touched.password && formik.errors.password && (
                                <div className="error-message">{formik.errors.password}</div>
                            )}
                        </div>
                        <button type="submit" className="submit-button">Register</button>
                    </form>
                    <div className="additional-links">
                        <p>Already have an account? <span className="link" onClick={onLoginClick}>Login</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
