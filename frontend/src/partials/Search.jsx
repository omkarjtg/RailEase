import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { submitBooking } from '../trainService.js';

export default function Results() {
    const location = useLocation();
    const { From, To, Date } = location.state || {};

    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (From && To && Date) {
            const fetchTrains = async () => {
                try {
                    const results = await submitBooking(From, To, Date);
                    setTrains(results);
                } catch (error) {
                    setError('Error fetching trains.');
                } finally {
                    setLoading(false);
                }
            };

            fetchTrains();
        } else {
            setLoading(false);
            setError('Invalid search criteria.');
        }
    }, [From, To, Date]);

    const formatTime = (time) => {
        return time.slice(0, 5); // Formats 'HH:mm:ss' to 'HH:mm'
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Search Results</h1>
            {loading ? (
                <div className="text-center">
                    <p>Loading Trains...</p>
                </div>
            ) : error ? (
                <div className="text-center">
                    <p>Error fetching trains: {error}</p>
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
                                    borderRadius: '8px'
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
                                        {(train.source.toString().toUpperCase())}
                                    </p>
                                    <p className="mb-1" style={{ fontSize: '22px' }}>
                                        {(train.destination.toString().toUpperCase())}
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
                                <div className='text-center'>
                                <button className='btn btn-primarys'>Book</button>
                                </div>
                            </li>
                          
                        ))}
                    </ul>
                ) : (
                    <div className="text-center">
                        <p>No trains found</p>
                    </div>
                )
            )}
        </div>
    );
}
