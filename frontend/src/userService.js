import axios from 'axios';

const API_URL = 'http://localhost:8081/users'; 

const api = axios.create({
  baseURL: API_URL,
});

// Automatically add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
