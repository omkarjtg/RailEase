import API from './axios';

// Fetch all trains
export const getAllTrains = async () => {
    try {
        const { data } = await API.get('/trains');
        return data;
    } catch (error) {
        console.error('Error fetching trains:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch trains');
    }
};

// Fetch a train by id
export const getTrainById = async (id) => {
    try {
        const { data } = await API.get(`/trains/id/${id}`);
        return data;
    } catch (error) {
        console.error(`Error fetching train ${id}:`, error);
        throw new Error(error.response?.data?.message || 'Train not found');
    }
};

// Fetch a train by its number
export const getTrainByNumber = async (number) => {
    try {
        const { data } = await API.get(`/trains/number/${number}`);
        return data;
    } catch (error) {
        console.error(`Error fetching train ${number}:`, error);
        throw new Error(error.response?.data?.message || 'Train not found');
    }
};

// Fetch trains by source, destination, and date
export const getTrainsByRouteAndDate = async (source, destination, date) => {
    try {
        const { data } = await API.get(`/trains/${source}/${destination}/${date}`);
        return data;
    } catch (error) {
        console.error('Error fetching trains by route:', error);
        throw new Error(error.response?.data?.message || 'Failed to find trains for this route');
    }
};

// Fetch trains by source, destination, and day of week
export const getTrainsByRouteAndDay = async (source, destination, day) => {
    try {
        const { data } = await API.get(`/trains/${source}/${destination}/days/${day}`);
        return data;
    } catch (error) {
        console.error('Error fetching trains by day:', error);
        throw new Error(error.response?.data?.message || 'Failed to find trains for this day');
    }
};

// Consolidated route search (handles both date and day)
export const searchTrains = async (source, destination, dateOrDay) => {
    // Check if the parameter is a date (YYYY-MM-DD format)
    if (typeof dateOrDay === 'string' && dateOrDay.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return getTrainsByRouteAndDate(source, destination, dateOrDay);
    }
    // Otherwise treat as day of week
    return getTrainsByRouteAndDay(source, destination, dateOrDay);
};

// Add a new train
export const addTrain = async (trainData) => {
    try {
        const { data } = await API.post('/trains', trainData);
        return data;
    } catch (error) {
        console.error('Error adding train:', error);
        throw new Error(error.response?.data?.message || 'Failed to add train');
    }
};

// Update a train
export const updateTrain = async (trainData) => {
    try {
        console.log('Updating train with number:', trainData.number);
        const { data } = await API.put(`/trains/number/${trainData.number}`, trainData);
        return data;
    } catch (error) {
        console.error(`Error updating train ${trainData.number}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to update train');
    }
};

// Delete a train
export const deleteTrain = async (id) => {
    try {
        const { data } = await API.delete(`/trains/${id}`);
        return data;
    } catch (error) {
        console.error(`Error deleting train ${id}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to delete train');
    }
};