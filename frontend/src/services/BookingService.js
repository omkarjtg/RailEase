import API from './axios';

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Created booking
 */
export const createBooking = async (bookingData, token) => {
    try {
        const response = await API.post('/booking', bookingData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error.response?.data || error.message;
    }
};



export const getMyBookings = async () => {
    try {
        const response = await API.get('/booking/my');
        return response.data;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * @param {string} token - JWT token
 * @returns {Promise<Array>} List of all bookings
 */
export const getAllBookings = async (token) => {
    try {
        const response = await API.get('/booking/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        if (error.response?.status === 403) {
            throw new Error('Unauthorized: Admin access required');
        }
        throw error.response?.data || error.message;
    }
};

/**
 * Confirm a booking
 * @param {number} bookingId - Booking ID to confirm
 * @param {string} token - JWT token
 * @returns {Promise<string>} Success message
 */
export const confirmBooking = async (bookingId, token) => {
    try {
        const response = await API.put(`/booking/confirm/${bookingId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error confirming booking:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Cancel a booking
 * @param {number} bookingId - Booking ID to cancel
 * @param {string} token - JWT token
 * @returns {Promise<string>} Success message
 */
export const cancelBooking = async (bookingId, token) => {
    try {
        const response = await API.put(`/booking/${bookingId}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        if (error.response?.status === 403) {
            throw new Error('Not authorized to cancel this booking');
        }
        throw error.response?.data || error.message;
    }
};

/**
 * Format booking request data
 * @param {Object} data - Raw booking data
 * @returns {Object} Formatted booking request
 */
export const formatBookingRequest = (data) => {
    return {
        trainNumber: data.trainNumber,
        seatsBooked: data.seatsBooked,
        seatTier: data.seatTier,
        travelDate: data.travelDate,
        passengerDetails: data.passengerDetails
    };
};