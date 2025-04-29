import { useContext, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Popup from './Popup';
import { AuthContext } from '../AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
    }, [logout, navigate]);

    const openLogin = useCallback(() => {
        setAuthMode('login');
        setShowAuthPopup(true);
    }, []);

    const openRegister = useCallback(() => {
        setAuthMode('signup');
        setShowAuthPopup(true);
    }, []);

    const handleAuthSuccess = useCallback(
        (userData) => {
            setShowAuthPopup(false);
            console.log(userData);
            const decoded = jwtDecode(userData.accessToken);

            login({
                username: decoded.sub,
                role: decoded.role,
                isAdmin: decoded.role === 'ADMIN',
                accessToken: userData.accessToken,
                userId: decoded.userId,
                email: decoded.email,
            });
        },
        [login]
    );
    const onClose = useCallback(() => {
        setShowAuthPopup(false);
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link to="/">
                        <img src="/secondry-logo.png" alt="Logo" />
                    </Link>
                    <Link className="navbar-brand ms-2" to="/">
                        RailEase
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/book">
                                    Book Ticket
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/trains">
                                    Trains
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/scheduled">
                                    Scheduled Trains
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/aboutUs">
                                    About Us
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/feedback">
                                    Feedback
                                </Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            {user ? (
                                <li className="nav-item dropdown">
                                    <span
                                        className="nav-link dropdown-toggle text-white"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Welcome, {user.username}
                                    </span>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        {user.role === 'ADMIN' ? (
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to="/addTrains">
                                                        Add Trains
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/location">
                                                        Locations
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <li>
                                                <Link className="dropdown-item" to={`/myBookings/`}>
                                                    My Bookings
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button className="dropdown-item logout" onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <button
                                        id="btn1"
                                        className="btn btn-login"
                                        onClick={openLogin}
                                        >
                                        Login
                                    </button>
                                </li>
                            <li className="nav-item ms-2">
                                <button
                                    id="btn2"
                                    className="btn btn-light"
                                    onClick={openRegister}
                                >
                                    Register
                                </button>
                            </li>
                        </>
                            )}
                    </ul>
                </div>
            </div>
        </nav >

            <Popup
                show={showAuthPopup}
                onClose={onClose}
                onLoginSuccess={handleAuthSuccess}
                initialMode={authMode}
            />
        </>
    );
}