import API from './axios';

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} Created booking
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await API.post('/booking', bookingData);
        return response.data;
    } catch (error) {
        console.error('Booking error details:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });

        if (error.response?.status === 403) {
            if (error.response.data?.message?.includes('seat availability')) {
                throw new Error('Not enough seats available');
            }
            throw new Error('Booking forbidden. Please check your permissions or train availability');
        }
        
        throw error.response?.data?.message || error.message;
    }
};  

/**
 * Get current user's bookings
 * @returns {Promise<Array>} List of user's bookings
 */
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
 * Get all bookings (admin only)
 * @returns {Promise<Array>} List of all bookings
 */
export const getAllBookings = async () => {
    try {
        const response = await API.get('/booking/all');
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
 * @returns {Promise<string>} Success message
 */
export const confirmBooking = async (bookingId) => {
    try {
        const response = await API.put(`/booking/confirm/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('Error confirming booking:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Cancel a booking
 * @param {number} bookingId - Booking ID to cancel
 * @returns {Promise<string>} Success message
 */
export const cancelBooking = async (bookingId) => {
    try {
        const response = await API.put(`/booking/${bookingId}/cancel`);
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