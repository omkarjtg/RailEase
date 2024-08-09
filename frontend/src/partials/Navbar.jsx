import React from 'react';
import Login from './LoginPage';
import Register from './RegisterPage';

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a href="/"><img src="https://www.irctc.co.in/nget/assets/images/secondry-logo.png" alt="" /></a>
                    <a className="navbar-brand ms-2" href="/">RailEase</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/trains">Trains</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button

                                    className="btn btn-info"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginModal"
                                >
                                    Login
                                </button>
                            </li>
                            <li className="nav-item ms-2">
                                <button

                                    className="btn btn-light"
                                    style={{ color: 'black', borderColor: '#eda633', backgroundColor: '#eda633' }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#registerModal"
                                >
                                    Register
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Login onClose={() => { }} /> {/* You can handle onClose functionality if needed */}
            <Register onClose={() => { }} /> {/* You can handle onClose functionality if needed */}
        </>
    );
}
