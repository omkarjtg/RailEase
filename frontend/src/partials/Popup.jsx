import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './popup.css'

const Popup = ({ show, onClose }) => {
    const [showLogin, setShowLogin] = useState(true);

    if (!show) return null;

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="wrapper" onClick={handleClose}>
            <div className="form-box" onClick={(e) => e.stopPropagation()}>
                {showLogin ? (
                    <Login
                        onClose={handleClose}
                        onSwitchToRegister={() => setShowLogin(false)}
                    />
                ) : (
                    <Register
                        onClose={handleClose}
                        onSwitchToLogin={() => setShowLogin(true)}
                    />
                )}
            </div>
        </div>
    );
};

export default Popup;
