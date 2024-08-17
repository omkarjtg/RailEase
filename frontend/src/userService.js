import axios from 'axios';

const API_URL = 'http://localhost:8081/users'; // Backend base URL

const api = axios.create({
  baseURL: API_URL,
});

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/add', userData); 
    const token = response.data; // Ensure your backend returns just the token
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
      const response = await api.get('/'); // Adjust endpoint if needed
      return response.data;
  } catch (error) {
      // console.error('Error fetching current user:', error);
      throw error;
  }
};

// Get current user details


// Axios interceptor for attaching JWT token to all requests
// axios.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

