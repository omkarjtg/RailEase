import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Get all trains
export const getAllTrains = async () => {
  try {
    const response = await api.get('/trains'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching trains:', error);
    throw error;
  }
};

// Get train by number
export const getTrainByNumber = async (trainNumber) => {
  try {
    const response = await api.get(`/trains/${trainNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching train ${trainNumber}:`, error);
    throw error;
  }
};

// Add a new train
export const addTrain = async (train) => {
  try {
    const response = await api.post('/trains', train);
    return response.data;
  } catch (error) {
    console.error('Error adding train:', error);
    throw error;
  }
};

// Update an existing train
export const updateTrain = async (train) => {
  try {
    const response = await api.put('/trains', train);
    return response.data;
  } catch (error) {
    console.error('Error updating train:', error);
    throw error;
  }
};

// Delete a train
export const deleteTrain = async (trainId) => {
  try {
    await api.delete(`/trains/${trainId}`);
  } catch (error) {
    console.error(`Error deleting train ${trainId}:`, error);
    throw error;
  }
};

// Submit a booking
export const submitBooking = async (from, to, date) => {
  try {
    console.log('Requesting trains with', { from, to, date });

    const encodedFrom = encodeURIComponent(from);
    const encodedTo = encodeURIComponent(to);

 
    const url = `/trains/${encodedFrom}/${encodedTo}/${date}`;

    const response = await api.get(url);
    console.log('Trains fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching trains:', error);
    throw error;
  }
};
