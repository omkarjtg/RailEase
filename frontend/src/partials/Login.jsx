import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../userService'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onLoginSuccess, onClose, onRegisterClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(''); // State to hold login error

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
      try {
        setLoginError(''); // Reset error state on each attempt

        const loginData = {
          username: values.username,
          password: values.password,
        };
    
        const res = await api.post('/login', loginData);
    
        const { username, isAdmin, token } = res.data;
    
        const userData = {
          username,  
          isAdmin,   
          token      
        };
    
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('jwtToken', token); 
    
        onLoginSuccess(userData);
    
        // Close login modal
        onClose();
      } catch (err) {
        if (err.response) {
          console.error("Login failed with status code:", err.response.status);
          console.error("Response data:", err.response.data);
          setLoginError("Login failed. Please check your username and password."); // Set the error message
        } else if (err.request) {
          console.error("No response received from server.");
          setLoginError("Unable to reach the server. Please try again later.");
        } else {
          console.error("Error", err.message);
          setLoginError("An unexpected error occurred. Please try again.");
        }
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
            {/* Display server error */}
            {loginError && <div className="error-message server-error">{loginError}</div>}

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
