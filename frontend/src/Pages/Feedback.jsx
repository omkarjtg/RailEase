import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllFeedbacks, getMyFeedbacks, submitFeedback } from '../services/FeedbackService';
import { getMyBookings } from '../services/BookingService';
import '../styles/Feedback.css';

const FeedbackForm = ({ user }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({ bookingId: '', comments: '', rating: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        fetchFeedbacks();
        fetchBookings();
    }, [user]);

    const fetchFeedbacks = async () => {
        try {
            const feedbacks = user.isAdmin ? await getAllFeedbacks() : await getMyFeedbacks();
            setFeedbackList(feedbacks);
        } catch (err) {
            toast.error(err.message || 'Failed to load feedback');
            setError(err.message);
        }
    };

    const fetchBookings = async () => {
        try {
            const bookingsData = await getMyBookings();
            setBookings(bookingsData);
        } catch (err) {
            toast.error(err.message || 'Failed to load bookings');
            setError(err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStarClick = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { bookingId, comments, rating } = formData;
        if (!bookingId || !comments.trim() || !rating) {
            toast.error('All fields are required');
            return;
        }

        try {
            setLoading(true);
            await submitFeedback({
                bookingId,
                comments: comments.trim(),
                rating,
            });
            toast.success('Feedback submitted successfully');
            setFormData({ bookingId: '', comments: '', rating: 0 });
            fetchFeedbacks();
        } catch (err) {
            toast.error(err.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const formatTravelDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short', // Abbreviated month (e.g., Apr)
            year: 'numeric',
        }).format(new Date(date));
    };

    return (
        <div className="feedback-container">
            <h2>Feedback Form</h2>
            {error && <p className="error-text">{error}</p>}

            <form className="feedback-form" onSubmit={handleSubmit}>
                <label htmlFor="bookingId">Booking:</label>
                <select name="bookingId" value={formData.bookingId} onChange={handleChange} required>
                    <option value="">Select a booking</option>
                    {bookings.map(booking => (
                        <option key={booking.id} value={booking.id}>
                            {booking.trainName} {formatTravelDate(booking.travelDate)} ({booking.status})
                        </option>
                    ))}
                </select>

                <label htmlFor="comments">Comments:</label>
                <textarea
                    name="comments"
                    rows="4"
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Write your feedback here..."
                    required
                />

                <label htmlFor="rating">Rating:</label>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`star ${formData.rating >= star ? 'filled' : ''}`}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>

            <h3>{user?.isAdmin ? 'All Feedback' : 'Your Feedback'}</h3>
            <ul className="feedback-list">
                {feedbackList.map(feedback => (
                    <li key={feedback.id}>
                        <strong>Booking #{feedback.bookingId}</strong>: "{feedback.comments}" — <em>{feedback.rating}/5</em>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FeedbackForm;