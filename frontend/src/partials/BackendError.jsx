import React from 'react';
import unpluggedImage from '../assets/unplugged.png';
import '../styles/BackendError.css';

const BackendError = ({ 
    message = 'Unable to connect to the backend server. Please try again later.',
    onRetry
}) => {
    return (
        <div className="backend-error">
            <img 
                src={unpluggedImage} 
                alt="Backend Unavailable" 
                className="backend-error-image" 
            />
            <h1>Server temporarily unavailable</h1>
            <p className="backend-error-message">
                {message}
                <br />
                <h2>The server might be down or restarting. Please try again in 2-4 minutes.</h2>
            </p>
            {onRetry && (
                <button 
                    className="backend-error-retry"
                    onClick={onRetry}
                >
                    Retry Connection
                </button>
            )}
        </div>
    );
};

export default BackendError;