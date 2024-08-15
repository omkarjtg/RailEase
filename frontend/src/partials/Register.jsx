import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; 
import './Register.css'

const Register = ({ onClose }) => {
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
        onSubmit: async values => {
            try {
                let userData = {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    isAdmin: false
                };

                const res = await axios.post("http://localhost:8081/users/add", userData); // Post request to backend
                console.log('User registered successfully:', res.data);

                // If you want to log in the user immediately after registration, you might retrieve the token here
                // const token = res.data.token;
                // localStorage.setItem('token', token);

                onClose(); // Close the modal or handle successful registration
            } catch (error) {
                console.error('Registration failed:', error);
                formik.setErrors({
                    username: 'An error occurred during registration',
                    email: 'An error occurred during registration',
                    password: 'An error occurred during registration'
                });
            }
        },
    });

    return (
        <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="registerModalLabel">Register</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                                    {...formik.getFieldProps('username')}
                                />
                                {formik.touched.username && formik.errors.username ? (
                                    <div className="invalid-feedback">{formik.errors.username}</div>
                                ) : null}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="invalid-feedback">{formik.errors.email}</div>
                                ) : null}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="invalid-feedback">{formik.errors.password}</div>
                                ) : null}
                            </div>

                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>
                        <div className="mt-3">
                            <p className="p-2">Already have an account? <a href="#" className="text-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
