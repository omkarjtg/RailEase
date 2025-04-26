import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Import AuthContext
import { getAllTrains, deleteTrain } from '../services/TrainService';
import TrainSearchForm from '../partials/TrainSearch';

const TrainList = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get user from AuthContext

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
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchTrains();
    }, []);

    const formatTime = (time) => {
        return time ? time.slice(0, 5) : 'N/A';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    const handleUpdate = (trainId) => {
        navigate(`/update-train/${trainId}`);
    };

    const handleDelete = async (trainId) => {
        try {
            await deleteTrain(trainId);
            setTrains(trains.filter((train) => train.id !== trainId));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete train');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Train Schedule</h1>
            <TrainSearchForm />
            {loading ? (
                <div className="text-center">
                    <p>Loading...</p>
                </div>
            ) : error ? (
                <div className="text-center text-danger">
                    <p>Error: {error}</p>
                </div>
            ) : trains.length > 0 ? (
                <ul className="list-group">
                    {trains.map((train) => (
                        <li
                            className="list-group-item mb-3"
                            key={train.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '15px',
                                borderRadius: '8px',
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
                                <p className="mb-1" style={{ fontSize: '22px' }}>
                                    {train.source ? train.source.toUpperCase() : 'N/A'}
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
                                <strong>Price:</strong> ₹{train.price ? train.price : 'N/A'}
                            </p>
                            {user && user.role === 'ADMIN' && (
                                <div className="mt-3 d-flex justify-content-between">
                                    <button
                                        className="btn btn-warning me-2"
                                        onClick={() => handleUpdate(train.id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(train.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
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