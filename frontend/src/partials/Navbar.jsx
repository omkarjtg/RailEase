import { useContext, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Popup from './Popup';
import { Dropdown } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';
import '../styles/Navbar.css';
import { toast } from 'react-toastify';

export default function Navbar() {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
        toast.info("Logged out successfully!")
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
                            {/*  <li className="nav-item">
                                <Link className="nav-link active" to="/book">
                                    Book Ticket
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link className="nav-link active" to="/trains">
                                    Train Schedule
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
                                <Dropdown as="li" className="nav-item">
                                    <Dropdown.Toggle as="span" className="nav-link text-white">
                                        Welcome, {user.username}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/profile">
                                            Profile
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        {user.role === 'ADMIN' ? (
                                            <>
                                                <Dropdown.Item as={Link} to="/addTrains">
                                                    Add Trains
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/location">
                                                    Locations
                                                </Dropdown.Item>
                                            </>
                                        ) : (
                                            <Dropdown.Item as={Link} to={`/myBookings/`}>
                                                My Bookings
                                            </Dropdown.Item>
                                        )}
                                        <Dropdown.Divider />
                                        <Dropdown.Item className="logout" onClick={handleLogout}>
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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