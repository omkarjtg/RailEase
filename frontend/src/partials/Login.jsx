import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import base64 from 'base-64';

const Login = ({ onLoginSuccess, onClose }) => {
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
        onClose(); // Close the modal on success
      } catch (err) {
        console.error("Login failed: ", err);
        alert("Can't login");
      }
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
                <label htmlFor="usernameInput" className="form-label">Username</label>
                <input
                  id="usernameInput"
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
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    id="passwordInput"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    {...formik.getFieldProps('password')}
                  />
                  </div>
                 <div>
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      aria-label="Show password"
                    />
                  Show Password
                  </div>
                
                {formik.touched.password && formik.errors.password ? (
                  <div className="invalid-feedback">{formik.errors.password}</div>
                ) : null}
              </div>
              <div className="d-flex justify-content-between mb-3">
                <a href="/forgot-password" className="link-primary">Forgot Password?</a>
               <span>Don't have an account?   <a href="/register" data-bs-toggle="modal" data-bs-target="#registerModal" className="link-primary">Register</a></span>
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
