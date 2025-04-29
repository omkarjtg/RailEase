import API from './axios';

// Get location by city name
export const getLocationByCity = async (city) => {
    try {
        const response = await API.get(`/locations/city/${city}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all locations
export const getAllLocations = async () => {
    try {
        const response = await API.get('/locations');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Create a new location
export const addLocation = async (locationData) => {
    try {
        const response = await API.post('/locations', locationData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get location by ID
export const getLocationById = async (id) => {
    try {
        const response = await API.get(`/locations/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
// Update location by ID
export const updateLocation = async (id, updatedLocation) => {
    try {
        const response = await API.put(`/locations/${id}`, updatedLocation);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
// Delete location by ID
export const deleteLocation = async (id) => {
    try {
        const response = await API.delete(`/locations/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete all locations
export const deleteAllLocations = async () => {
    try {
        const response = await API.delete('/locations');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};