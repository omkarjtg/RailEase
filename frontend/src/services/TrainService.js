import API from './axios';

export const getAllTrains = async () => {
    const response = await API.get('/trains');
    return response.data;
};

export const getTrainByNumber = async (number) => {
    const response = await API.get(`/trains/${number}`);
    return response.data;
};

export const getTrainsByRoute = async (source, destination, date) => {
    const response = await API.get(`/trains/${source}/${destination}/${date}`);
    return response.data;
};

export const addTrain = async (trainData) => {
    const response = await API.post('/trains', trainData);
    return response.data;
};

export const updateTrain = async (id, trainData) => {
    const response = await API.put(`/trains/${id}`, trainData);
    return response.data;
};

export const deleteTrain = async (id) => {
    const response = await API.delete(`/trains/${id}`);
    return response.data;
};