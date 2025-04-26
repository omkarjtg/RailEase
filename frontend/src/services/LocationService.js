import API from './axios';

const LocationService = {
    // Get location by city name
    getLocationByCity: async (city) => {
        try {
            const response = await API.get(`/locations/city/${city}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get all locations
    getAllLocations: async () => {
        try {
            const response = await API.get('/locations');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create a new location
    createLocation: async (locationData) => {
        try {
            const response = await API.post('/locations', locationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get location by ID
    getLocationById: async (id) => {
        try {
            const response = await API.get(`/locations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete location by ID
    deleteLocation: async (id) => {
        try {
            const response = await API.delete(`/locations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete all locations
    deleteAllLocations: async () => {
        try {
            const response = await API.delete('/locations');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default LocationService;