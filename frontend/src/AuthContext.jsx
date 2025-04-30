import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Assuming you are using jwt-decode for token handling
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('jwtToken');

        if (storedUser && storedToken) {
            const decodedToken = jwtDecode(storedToken);
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();
            if (isTokenExpired) {
                logout(); 
            } else {
                setUser(storedUser);
            }
        }
    }, []);

    const login = (userData) => {
        const userObj = {
            username: userData.username,
            role: userData.role,
            isAdmin: userData.isAdmin,
            token: userData.accessToken,
        };

        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('jwtToken', userData.accessToken);  // Store token
        setUser(userObj);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setUser(null);
        toast.done('Logged Out Successfully')

    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
