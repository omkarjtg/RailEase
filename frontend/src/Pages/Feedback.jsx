import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8085/feedback'; // Adjust the URL if needed

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState('');
    const [feedbackList, setFeedbackList] = useState([]);
    const [deleteId, setDeleteId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const response = await axios.get(API_URL);
            setFeedbackList(response.data);
        } catch (error) {
            setError('Error fetching feedback');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(API_URL, { message: feedback });
            setFeedback('');
            fetchFeedback(); // Refresh the feedback list
        } catch (error) {
            setError('Error submitting feedback');
        }
    };

    const handleDelete = async () => {
        setError('');
        try {
            await axios.delete(`${API_URL}/${deleteId}`);
            setDeleteId('');
            fetchFeedback(); // Refresh the feedback list
        } catch (error) {
            setError('Error deleting feedback');
        }
    };

    return (
        <div className="container">
            <h1>Feedback Form</h1>
            
            {/* Submit Feedback Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="feedbackInput" className="form-label">Feedback</label>
                    <textarea
                        id="feedbackInput"
                        className="form-control"
                        rows="4"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit Feedback</button>
            </form>

            {/* Delete Feedback Form */}
            <div className="mt-4">
                <h2>Delete Feedback</h2>
                <div className="mb-3">
                    <label htmlFor="deleteIdInput" className="form-label">Feedback ID</label>
                    <input
                        id="deleteIdInput"
                        type="text"
                        className="form-control"
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                >
                    Delete Feedback
                </button>
            </div>

            {/* Feedback List */}
            <div className="mt-4">
                <h1 className="mb-4">Feedback List</h1>
                <ul className="list-group">
                   {feedbackList.map((fb, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                           <span>{fb.message}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FeedbackForm;
