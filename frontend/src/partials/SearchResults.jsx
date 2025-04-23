import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { From, To, Date } = location.state || {};
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken')); // Assuming token is stored in localStorage

    useEffect(() => {
        if (From && To && Date && jwtToken) {
            const fetchTrains = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/trains/', {
                        params: {
                            from: From,
                            to: To,
                            date: Date,
                        },
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    });

                    setTrains(response.data); // Assuming backend sends an array of trains
                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        setError('Unauthorized. Please log in again.');
                    } else {
                        setError('Error fetching trains. Please try again later.');
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchTrains();
        } else {
            setLoading(false);
            setError('Invalid search criteria or missing JWT token.');
        }
    }, [From, To, Date, jwtToken]);

    const formatTime = (time) => {
        return time.slice(0, 5); // Formats 'HH:mm:ss' to 'HH:mm'
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleBook = (train) => {
        navigate('/booked', {
            state: {
                bookingId: '12345', // Example booking ID
                name: 'John Doe', // Example name
                from: train.source,
                to: train.destination,
                date: Date,
                price: train.price,
            },
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Search Results</h1>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading trains...</p>
                </div>
            ) : error ? (
                <div className="text-center text-danger">
                    <p>{error}</p>
                </div>
            ) : (
                trains.length > 0 ? (
                    <ul className="list-group">
                        {trains.map(train => (
                            <li
                                className="list-group-item mb-3"
                                key={train.id}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-1">
                                        {train.name}
                                        <span className="text-muted"> ({train.number})</span>
                                    </h5>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p className="mb-1" style={{ fontSize: '22px' }}>
                                        {train.source.toUpperCase()}
                                    </p>
                                    <p className="mb-1" style={{ fontSize: '22px' }}>
                                        {train.destination.toUpperCase()}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="mb-1">
                                        <strong>Departure Time:</strong> {formatTime(train.departureTime)}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Arrival Time:</strong> {formatTime(train.arrivalTime)}
                                    </p>
                                </div>
                                <p className="mb-1">
                                    <strong>Price:</strong> ₹{train.price}
                                </p>
                                <div className="text-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleBook(train)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center">
                        <p>No trains found matching your criteria.</p>
                    </div>
                )
            )}
        </div>
    );
}
