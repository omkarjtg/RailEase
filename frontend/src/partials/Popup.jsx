import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import '../styles/Popup.css';

const Popup = ({ show, onClose, onLoginSuccess, initialMode = 'login' }) => {
    const [currentMode, setCurrentMode] = useState(initialMode);

    useEffect(() => {
        setCurrentMode(initialMode);
    }, [initialMode]);

    if (!show) return null;

    const handleClose = () => {
        onClose();
    };

    const handleSwitchToSignup = () => {
        setCurrentMode('signup');
    };

    const handleSwitchToLogin = () => {
        setCurrentMode('login');
    };

    const handleSwitchToForgotPassword = () => {
        setCurrentMode('forgot');
    };

    const renderContent = () => {
        switch (currentMode) {
            case 'login':
                return (
                    <Login
                        onLoginSuccess={(userData) => {
                            onLoginSuccess(userData);
                            handleClose();
                        }}
                        onSwitchToSignup={handleSwitchToSignup}
                        onForgotPassword={handleSwitchToForgotPassword}
                    />
                );
            case 'signup':
                return (
                    <Signup
                        onSignupSuccess={(userData) => {
                            onLoginSuccess(userData);
                            handleClose();
                        }}
                        onSwitchToLogin={handleSwitchToLogin}
                    />
                );
            case 'forgot':
                return (
                    <ForgotPassword
                        onClose={handleClose}
                        onSwitchToLogin={handleSwitchToLogin}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <button
                    className="popup-close-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
                >

                    ×
                </button>
                <div className="auth-form-wrapper">
                    <div key={currentMode} className="auth-form-content">
                        {renderContent()}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Popup;