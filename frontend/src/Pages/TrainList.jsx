import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTrains, updateTrain, deleteTrain } from '../trainService';
import TrainSearchForm from '../partials/TrainSearch';

const TrainList = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

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
        return time ? time.slice(0, 5) : 'N/A'; // Return 'N/A' if time is not available
    };

    const formatDate = (date) => {
        if (!date) return 'N/A'; // Return 'N/A' if date is not available
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleUpdate = async (trainNumber) => {
        navigate(`/update-train/${trainNumber}`);
    };


    const handleDelete = async (trainId) => {
        try {
            await deleteTrain(trainId);
            setTrains(trains.filter(train => train.id !== trainId));
        } catch (error) {
            console.error('Failed to delete train:', error);
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
                    <p>Error: {error.message}</p>
                </div>
            ) : trains.length > 0 ? (
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
                            {user && user.isAdmin && (
                                <div className="mt-3 d-flex justify-content-between">
                                    <button
                                        className="btn btn-warning me-2"
                                        onClick={() => handleUpdate(train.number)}
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
