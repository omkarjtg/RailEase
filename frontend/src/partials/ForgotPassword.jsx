import React from "react";
import './ForgetPassword.css';
const ForgetPassword=()=>
{
 return(
    <>
      <div className="forget-password-container">
      <form className="forget-password-form">
        <input type="text" id="username1" placeholder="Enter new Password" className="input-field" />
        <input type="password" id="password1" placeholder="Confirm new password" className="input-field" />
        <input type="checkbox" id="rememberMe1" className="checkbox-field" /> Remember Me
        <button type="submit" className="submit-button">Reset Password</button>
      </form>
    </div>
    </>
 );
}
export default ForgetPassword;