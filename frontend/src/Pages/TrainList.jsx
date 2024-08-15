import React, { useEffect, useState } from 'react';
import { getAllTrains } from '../trainService';

const TrainList = () => {
    const [trains, setTrains] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const data = await getAllTrains();
                setTrains(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchTrains();
    }, []);

    const formatTime = (time) => {
        return time.slice(0, 5); // Formats 'HH:mm:ss' to 'HH:mm'
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Train Schedule</h1>
            {trains.length > 0 ? (
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
                                <span>{formatDate(train.schedule)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <p className="mb-1" style={{
                                    fontSize:'22px'
                                }}>
                                <>{(train.source.toString().toUpperCase())}</>
                                </p>
                                <p className="mb-1" style={{
                                    fontSize:'22px'
                                }}>
                                    <>{(train.destination.toString().toUpperCase())}</> 
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
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center">
                    <p>No trains available</p>
                </div>
            )}
        </div>
    );
};

export default TrainList;
