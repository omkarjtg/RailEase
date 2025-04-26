import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axios';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get('/booking/my');
                setBookings(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load bookings');
                console.error('Booking fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        try {
            await API.put(`/booking/${bookingId}/cancel`);
            setBookings(bookings.filter(booking => booking.id !== bookingId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Bookings</h2>
                <button className="btn btn-primary" onClick={() => navigate('/book')}>
                    New Booking
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="alert alert-info">
                    You have no bookings yet. Click "New Booking" to book a ticket.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover booking-table">
                        <thead className="table-dark">
                            <tr>
                                <th>Train</th>
                                <th>Route</th>
                                <th>Date</th>
                                <th>Class</th>
                                <th>Fare</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id} className={booking.status === 'CANCELLED' ? 'table-secondary' : ''}>
                                    <td>
                                        <div className="fw-bold">{booking.trainName}</div>
                                        <small className="text-muted">{booking.trainNumber}</small>
                                    </td>
                                    <td>
                                        <div>{booking.from} → {booking.to}</div>
                                        <small className="text-muted">
                                            Dep: {new Date(booking.departureTime).toLocaleTimeString()}
                                        </small>
                                    </td>
                                    <td>{formatDate(booking.date)}</td>
                                    <td>{booking.class}</td>
                                    <td>{formatCurrency(booking.fare)}</td>
                                    <td>
                                        <span className={`badge ${
                                            booking.status === 'CONFIRMED' ? 'bg-success' :
                                            booking.status === 'CANCELLED' ? 'bg-secondary' :
                                            'bg-warning text-dark'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        {booking.status !== 'CANCELLED' && (
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleCancel(booking.id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookings;