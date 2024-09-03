import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import base64 from 'base-64';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const Login = ({ onLoginSuccess, onClose, onRegisterClick }) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      const token = `${values.username}:${values.password}`;
      const base64Token = base64.encode(token);

      try {
        const res = await axios.get('http://localhost:8081/users', {
          headers: {
            "Authorization": `Basic ${base64Token}`
          }
        });
        console.log(res.data);
        onLoginSuccess(res.data);
        onClose();
      } catch (err) {
        console.error("Login failed: ", err);
      }
    },
  });

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h5 className="modal-title">Login</h5>
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
                autoComplete="username"
                className={`form-control ${formik.touched.username && formik.errors.username ? 'input-error' : ''}`}
                {...formik.getFieldProps('username')}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="error-message">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="form-group position-relative">
              <label htmlFor="passwordInput">Password</label>
              <input
                id="passwordInput"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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
              {formik.touched.password && formik.errors.password ? (
                <div className="error-message">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="additional-links">
              <a href="/forgot-password" className="link">Forgot Password?</a>
              <p>Don't have an account? <span className="link" onClick={onRegisterClick}>Register</span></p>
            </div>
            <button type="submit" className="submit-button">Login</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
