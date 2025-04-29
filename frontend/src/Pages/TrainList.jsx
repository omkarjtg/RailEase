import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { FaArrowRight } from "react-icons/fa";
import { getAllTrains, deleteTrain } from '../services/TrainService';
import TrainSearchForm from '../partials/TrainSearch';
import BookingForm from './BookingForm';
import '../styles/TrainList.css';

const TrainList = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [trains, setTrains] = useState([]);
    const [filteredTrains, setFilteredTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrain, setSelectedTrain] = useState(null); // State to track the selected train for booking

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const data = await getAllTrains();
                setTrains(data);
                setFilteredTrains(data);
            } catch (err) {
                setError(err.message || 'Failed to load trains');
            } finally {
                setLoading(false);
            }
        };
        fetchTrains();
    }, []);

    const handleClearSearch = () => {
        setFilteredTrains(trains);
    };

    const handleSearchResults = (results) => {
        setFilteredTrains(results);
    };

    const handleDelete = async (trainId) => {
        try {
            await deleteTrain(trainId);
            setTrains(trains.filter(train => train.id !== trainId));
            setFilteredTrains(filteredTrains.filter(train => train.id !== trainId));
        } catch (err) {
            setError(err.message || 'Failed to delete train');
        }
    };

    const handleBookNow = (train) => {
        setSelectedTrain(train);
    };

    const handleCancelBooking = () => {
        setSelectedTrain(null);
    };

    return (
        <div className="train-list">
            <h1>Train Schedule</h1>
            <TrainSearchForm
                onSearchResults={handleSearchResults}
                onClearSearch={handleClearSearch}
            />

            {loading ? (
                <div className="loading">
                    <Spinner /> Loading trains...
                </div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : filteredTrains.length > 0 ? (
                <div className="train-grid">
                    {filteredTrains.map(train => (
                        <div key={train.id}>
                            <TrainCard
                                train={train}
                                user={user}
                                onUpdate={() => navigate(`/update-train/${train.id}`)}
                                onDelete={() => handleDelete(train.id)}
                                onBook={() => handleBookNow(train)}
                            />
                            {selectedTrain?.id === train.id && (
                                <BookingForm
                                    train={selectedTrain}
                                    onCancel={handleCancelBooking}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results">No trains found</div>
            )}
        </div>
    );
};

const TrainCard = ({ train, user, onUpdate, onDelete, onBook }) => {
    const formatTime = (time) => (time ? time.slice(0, 5) : 'N/A');
    const formatRunningDays = (days) => {
        if (!days || !days.length) return <span className="badge bg-secondary">N/A</span>;

        const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        const sortedDays = days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

        return sortedDays.map((day, i) => (
            <span key={i} className="badge bg-primary">{day.slice(0, 3)}</span>
        ));
    };

    return (
        <div className="train-card">
            <div className="train-header">
                <h3>
                    {train.name} <span>({train.number})</span>
                </h3>
            </div>
            <div className="route">
                <span>{train.source}</span> <FaArrowRight /> <span>{train.destination}</span>
                <div className="running-days">{formatRunningDays(train.runningDays)}</div>
            </div>
            <div className="timings">
                <span>Dep: {formatTime(train.departureTime)}</span>
                <span>Arr: {formatTime(train.arrivalTime)}</span>
            </div>
            <div className="price">₹{train.price || 'N/A'}</div>
            <div className="actions">
                {user?.role === 'ADMIN' ? (
                    <>
                        <button className="btn btn-warning" onClick={onUpdate}>
                            Update
                        </button>
                        <button className="btn btn-danger" onClick={onDelete}>
                            Delete
                        </button>
                    </>
                ) : (
                    <button className="btn btn-primary" onClick={onBook}>
                        Book Now
                    </button>
                )}
            </div>
        </div>
    );
};

const Spinner = () => (
    <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
);

export default TrainList;