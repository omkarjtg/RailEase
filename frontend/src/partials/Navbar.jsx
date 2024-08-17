import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { getCurrentUser } from '../userService';
import './Navbar.css';

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                // Handle error if necessary
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        window.location.href = '/'; // Redirect to login or home page
    };

    const handleLoginSuccess = (userData) => {
        const token = userData.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleCloseModal = () => {
        const modalElement = document.getElementById('loginModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link to="/"><img src="/secondry-logo.png" alt="Logo" /></Link>
                    <Link className="navbar-brand ms-2" to="/">RailEase</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/book">Book Ticket</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/trains">Trains</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/scheduled">Scheduled Trains</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/aboutUs">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/feedback">Feedback</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            {user ? (
                                <>
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
                                            {user.isAdmin ? (
                                                <>
                                                    <li>
                                                        <Link className="dropdown-item" to="/addTrains">Add Trains</Link>
                                                    </li>
                                                    <li>
                                                        <Link className="dropdown-item" to="/location">Locations</Link>
                                                    </li>
                                                </>
                                            ) : (
                                                <li>
                                                    <Link className="dropdown-item" to="/myBookings">My Bookings</Link>
                                                </li>
                                            )}
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <button
                                            id='btn1'
                                            className="btn btn-warning"
                                            data-bs-toggle="modal"
                                            data-bs-target="#loginModal"
                                        >
                                            Login
                                        </button>
                                    </li>
                                    <li className="nav-item ms-2">
                                        <button
                                            id='btn2'
                                            className="btn btn-light"
                                            data-bs-toggle="modal"
                                            data-bs-target="#registerModal"
                                        >
                                            Register
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseModal} />
            <Register onClose={handleCloseModal} />
        </>
    );
}
