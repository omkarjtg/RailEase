import API from './axios';
import BookingService from '../services/BookingService';

const handleBookingError = (error) => {
    console.error('Booking Error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
    });

    if (error.response?.status === 403) {
        if (error.response.data?.message?.includes('seat availability')) {
            throw new Error('Not enough seats available');
        }
        throw new Error('Booking forbidden. Please check availability');
    }

    throw new Error(error.response?.data?.message || error.message || 'Booking failed');
};

export const createBooking = async (bookingData) => {
    try {
        const response = await API.post('/booking', bookingData);
        return response.data;
    } catch (error) {
        handleBookingError(error);
    }
};

export const getMyBookings = async () => {
    try {
        const response = await API.get('/booking/my');
        return response.data;
    } catch (error) {
        handleBookingError(error);
    }
};

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

export const formatBookingRequest = (data) => {
    return {
        trainNumber: data.trainNumber,
        seatsBooked: data.seatsBooked,
        seatTier: data.seatTier,
        travelDate: data.travelDate,
        passengerDetails: data.passengerDetails
    };
};

export const getBookingById = async (bookingId) => {
    try {
        const response = await API.get(`/booking/id/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching booking:', error);
        if (error.response?.status === 404) {
            throw new Error('Booking not found');
        }
        throw error.response?.data || error.message;
    }
};

export default {
    createBooking,
    getMyBookings,
    cancelBooking,
    getBookingById
};