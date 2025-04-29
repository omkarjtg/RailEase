import API from './axios'; // Assuming you have an axios instance configured

/**
 * Submit new feedback
 * @param {Object} feedbackData - Feedback request data
 * @param {number} feedbackData.bookingId - Booking ID
 * @param {string} feedbackData.comments - Feedback comments
 * @param {number} feedbackData.rating - Rating (1-5)
 * @returns {Promise<Object>} Feedback response
 */
export const submitFeedback = async (feedbackData) => {
    try {
        const response = await API.post('/feedback', feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Get current user's feedbacks
 * @returns {Promise<Array>} List of user's feedbacks
 */
export const getMyFeedbacks = async () => {
    try {
        const response = await API.get('/feedback/my');
        return response.data;
    } catch (error) {
        console.error('Error fetching user feedbacks:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Get all feedbacks (Admin only)
 * @returns {Promise<Array>} List of all feedbacks
 */
export const getAllFeedbacks = async () => {
    try {
        const response = await API.get('/feedback/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all feedbacks:', error);
        if (error.response?.status === 403) {
            throw new Error('Unauthorized: Admin access required');
        }
        throw error.response?.data || error.message;
    }
};

/**
 * Update existing feedback
 * @param {number} id - Feedback ID
 * @param {Object} updateData - Updated feedback data
 * @param {string} [updateData.comments] - Updated comments
 * @param {number} [updateData.rating] - Updated rating
 * @returns {Promise<Object>} Updated feedback
 */
export const updateFeedback = async (id, updateData) => {
    try {
        const response = await API.put(`/feedback/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating feedback:', error);
        if (error.response?.status === 403) {
            throw new Error('Unauthorized to update this feedback');
        }
        if (error.response?.status === 404) {
            throw new Error('Feedback not found');
        }
        throw error.response?.data || error.message;
    }
};

/**
 * Delete feedback
 * @param {number} id - Feedback ID to delete
 * @returns {Promise<string>} Success message
 */
export const deleteFeedback = async (id) => {
    try {
        const response = await API.delete(`/feedback/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting feedback:', error);
        if (error.response?.status === 403) {
            throw new Error('Unauthorized to delete this feedback');
        }
        if (error.response?.status === 404) {
            throw new Error('Feedback not found');
        }
        throw error.response?.data || error.message;
    }
};

/**
 * Helper to format feedback data for submission
 * @param {Object} data - Raw feedback data
 * @returns {Object} Formatted request DTO
 */
export const formatFeedbackRequest = (data) => {
    return {
        bookingId: data.bookingId,
        comments: data.comments,
        rating: data.rating
    };
};