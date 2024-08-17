import axios from 'axios';


export const addLocation = async (location) => {
    try {
        const response = await axios.post('http://localhost:8082/locations/add', location);
        return response.data;
    } catch (error) {
        console.error('Error adding location:', error);
        throw error;
    }
};

export const getAllLocations = async () => {
    try {
        const response = await axios.get('http://localhost:8082/locations');
        return response.data; // Ensure this matches the structure you expect
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

export const deleteLocation = async (id) => {
    try {
        await axios.delete(`http://localhost:8082/locations/${id}`);
    } catch (error) {
        console.error(`Error deleting location with ID: ${id}`, error);
        throw error;
    }
};
