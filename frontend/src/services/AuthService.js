import API from './axios';
import { jwtDecode } from 'jwt-decode';

export const login = async (credentials) => {
    try {
        const response = await API.post('/auth/login', {
            identifier: credentials.identifier,
            password: credentials.password
        });

        if (response.data.accessToken) {
            const token = response.data.accessToken;
            const decodedToken = jwtDecode(token);

            // Assuming 'sub' is the username, 'role' is the role, and 'userId' is the userId
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                username: decodedToken.sub,
                role: decodedToken.role,
                userId: decodedToken.userId  // Ensure userId is included in the token payload
            }));
            console.log(decodedToken)
            return response.data;
        }

        throw new Error('Login failed - no token received');
    } catch (error) {
        let errorMessage = 'Login failed. Please try again.';

        if (error.response) {
            if (error.response.status === 403) {
                errorMessage = 'Invalid credentials. Please check your username/email and password.';
            } else if (error.response.data?.message) {
                errorMessage = error.response.data.message;
            }
        }

        console.error('Login error:', error.response?.data || error.message);
        throw new Error(errorMessage);
    }
};


export const register = async (userData) => {
    try {
        const response = await API.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
