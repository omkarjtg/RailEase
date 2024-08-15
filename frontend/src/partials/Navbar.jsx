import React, { useState, useEffect } from 'react';
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
                // console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        window.location.href = '/login'; // Redirect to login or home page
    };

    const handleLoginSuccess = (loggedInUser) => {
        setUser(loggedInUser);
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
                    <a href="/"><img src="/secondry-logo.png" alt="" /></a>
                    <a className="navbar-brand ms-2" href="/">RailEase</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/book">Book Ticket</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/trains">Trains</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/aboutUs">About Us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/feedback">Feedback</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link text-white">Welcome, {user.username}</span>
                                    </li>
                                    <li className="nav-item ms-2">
                                        <button
                                            id='btn3'
                                            className="btn btn-danger"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
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
