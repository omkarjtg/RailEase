import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = ({ onClose }) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: values => {
            // Handle login logic here
            console.log(values);
            onClose();
        },
    });

    return (
        <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loginModalLabel">Login</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input

                                    id="username1"
                                    type="text"
                                    autoComplete='username'
                                    className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                                    {...formik.getFieldProps('username')}
                                />
                                {formik.touched.username && formik.errors.username ? (
                                    <div className="invalid-feedback">{formik.errors.username}</div>
                                ) : null}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    id="password1"
                                    type="password"
                                    autoComplete='current-password'
                                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="invalid-feedback">{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <label>
                                    <input id="rememberMe" type="checkbox" /> Remember me
                                </label>
                                <a href="#">Forgot Password?</a>
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                        <div className="mt-3">
                            <p className='p-2'> Don't have an account? <a href="#" className="text-primary" data-bs-toggle="modal" data-bs-target="#registerModal">Register</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
