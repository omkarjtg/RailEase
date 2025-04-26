import React, { useState } from 'react';
import { getTrainByNumber } from '../trainService';

const TrainSearchForm = () => {
    const [trainNumber, setTrainNumber] = useState('');
    const [train, setTrain] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setTrainNumber(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setTrain(null);

        try {
            const data = await getTrainByNumber(trainNumber);
            setTrain(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Train not found or there was an error fetching the details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Search Train by Number</h1>
            <form onSubmit={handleSubmit} className="mb-5">
                <div className="form-group">
                    <label htmlFor="trainNumber">Train Number</label>
                    <input
                        type="text"
                        id="trainNumber"
                        name="trainNumber"
                        value={trainNumber}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter Train Number"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Search
                </button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            {train && (
                <div className="mt-4">
                    <h2>{train.name} ({train.number})</h2>
                    <p><strong>Source:</strong> {train.source}</p>
                    <p><strong>Destination:</strong> {train.destination}</p>
                    <p><strong>Departure Time:</strong> {train.departureTime}</p>
                    <p><strong>Arrival Time:</strong> {train.arrivalTime}</p>
                    <p><strong>Price:</strong> ₹{train.price}</p>
                </div>
            )}
        </div>
    );
};

export default TrainSearchForm;