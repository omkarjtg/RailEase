import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getAllFeedbacks, getMyFeedbacks, submitFeedback, updateFeedback, deleteFeedback } from '../services/FeedbackService';
import { getMyBookings } from '../services/BookingService';
import '../styles/Feedback.css';

const FeedbackForm = ({ user }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({ bookingId: '', comments: '', rating: 0 });
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState('');
    const [editingFeedback, setEditingFeedback] = useState(null);

    useEffect(() => {
        if (!user) return;
        fetchFeedbacks();
        fetchBookings();
    }, [user]);

    const fetchFeedbacks = async () => {
        try {
            setIsFetching(true);
            const feedbacks = user.isAdmin ? await getAllFeedbacks() : await getMyFeedbacks();
            setFeedbackList(feedbacks);
        } catch (err) {
            toast.error(err.message || 'Failed to load feedback');
            setError(err.message);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setIsFetching(true);
            const bookingsData = await getMyBookings();
            setBookings(bookingsData);
        } catch (err) {
            toast.error(err.message || 'Failed to load bookings');
            setError(err.message);
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStarClick = (rating) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { bookingId, comments, rating } = formData;
        if (!bookingId || !comments.trim() || !rating || rating < 1 || rating > 5) {
            toast.error('All fields are required, and rating must be between 1 and 5');
            return;
        }

        try {
            setLoading(true);
            if (editingFeedback) {
                await updateFeedback(editingFeedback.id, { comments: comments.trim(), rating });
                toast.success('Feedback updated successfully');
                setEditingFeedback(null);
            } else {
                await submitFeedback({ bookingId, comments: comments.trim(), rating });
                toast.success('Feedback submitted successfully');
            }
            setFormData({ bookingId: '', comments: '', rating: 0 });
            fetchFeedbacks();
        } catch (err) {
            if (err.message.includes('HTTP 401')) {
                toast.error('Session expired. Please log in again.');
                // Optionally redirect: window.location.href = '/login';
            } else if (err.message.includes('HTTP 403')) {
                toast.error('You are not authorized to perform this action.');
            } else if (err.message.includes('HTTP 404')) {
                toast.error('Feedback or booking not found.');
            } else {
                toast.error(err.message || 'Failed to submit feedback');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (feedback) => {
        setEditingFeedback(feedback);
        setFormData({
            bookingId: feedback.bookingId,
            comments: feedback.comments,
            rating: feedback.rating,
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to undo this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await deleteFeedback(id);
                toast.success('Feedback deleted successfully');
                fetchFeedbacks();
            } catch (err) {
                if (err.message.includes('HTTP 401')) {
                    toast.error('Session expired. Please log in again.');
                } else if (err.message.includes('HTTP 403')) {
                    toast.error('You are not authorized to delete this feedback.');
                } else if (err.message.includes('HTTP 404')) {
                    toast.error('Feedback not found.');
                } else {
                    toast.error(err.message || 'Failed to delete feedback');
                }
            }
        }
    };

    const formatTravelDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));
    };

    // Filter bookings to exclude those with existing feedback (for new feedback only)
    const availableBookings = editingFeedback
        ? bookings // Allow all bookings when editing (to show current booking)
        : bookings.filter(
            (booking) => !feedbackList.some((feedback) => feedback.bookingId === booking.bookingId)
        );

    return (
        <div className="feedback-container">
            <h2>{editingFeedback ? 'Edit Feedback' : 'Submit Feedback'}</h2>
            {error && <p className="error-text">{error}</p>}
            {isFetching && <p className="loading-text">Loading feedback and bookings...</p>}

            <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label style={{
                        "fontWeight": "600",
                        "fontSize": "0.95rem",
                        "color": "#1d1c1c"
                    }} htmlFor="bookingId">Booking</label>
                    <select
                        name="bookingId"
                        value={formData.bookingId}
                        onChange={handleChange}
                        required
                        disabled={editingFeedback || loading}
                        aria-describedby="bookingId-help"
                    >
                        <option value="">Select a booking</option>
                        {availableBookings.map((booking) => (
                            <option key={booking.bookingId} value={booking.bookingId}>
                                {booking.trainName} - {formatTravelDate(booking.travelDate)} ({booking.status})
                            </option>
                        ))}
                    </select>
                    <small id="bookingId-help" className="form-help-text">
                        {editingFeedback ? 'Booking cannot be changed' : 'Select a booking to provide feedback'}
                    </small>
                </div>

                <div className="form-group">
                    <label style={{
                        "fontWeight": "600",
                        "fontSize": "0.95rem",
                        "color": "#1d1c1c"
                    }} htmlFor="comments">Comments</label>
                    <textarea
                        name="comments"
                        rows="4"
                        value={formData.comments}
                        onChange={handleChange}
                        placeholder="Write your feedback here..."
                        required
                        disabled={loading}
                        aria-describedby="comments-help"
                    />
                    <small id="comments-help" className="form-help-text">
                        Share your experience (max 500 characters)
                    </small>
                </div>

                <div className="form-group">
                    <label style={{
                        "fontWeight": "600",
                        "fontSize": "0.95rem",
                        "color": "#1d1c1c"
                    }}>Rating</label>
                    <div className="star-rating" role="radiogroup" aria-label="Rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${formData.rating >= star ? 'filled' : ''}`}
                                onClick={() => !loading && handleStarClick(star)}
                                role="radio"
                                aria-checked={formData.rating >= star}
                                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && !loading && handleStarClick(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} aria-busy={loading}>
                        {loading ? 'Submitting...' : editingFeedback ? 'Update Feedback' : 'Submit Feedback'}
                    </button>
                    {editingFeedback && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setEditingFeedback(null);
                                setFormData({ bookingId: '', comments: '', rating: 0 });
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form >

            <section className="feedback-list-section">
                <h3>{user?.isAdmin ? 'All Feedback' : 'Your Feedback'}</h3>
                {feedbackList.length === 0 ? (
                    <p className="no-feedback-text">No feedback available.</p>
                ) : (
                    <ul className="feedback-list">
                        {feedbackList.map((feedback) => (
                            <li key={feedback.id} className="feedback-item">
                                <div className="feedback-content">
                                    <strong>Booking #{feedback.bookingId}</strong>
                                    <p>"{feedback.comments}"</p>
                                    <span className="feedback-rating">Rating: {feedback.rating}/5</span>
                                </div>
                                {!user.isAdmin && (
                                    <div className="feedback-actions">
                                        <button onClick={() => handleEdit(feedback)} aria-label={`Edit feedback ${feedback.id}`}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feedback.id)}
                                            aria-label={`Delete feedback ${feedback.id}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div >
    );
};

export default FeedbackForm;