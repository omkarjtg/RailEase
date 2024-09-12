import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (userData) => {
        // Directly use userData fields since it's already in the correct format
        const userObj = {
            username: userData.username,  // "omkar"
            isAdmin: userData.isAdmin,    // true
            token: userData.token         // JWT token
        };

        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('jwtToken', userData.token);

        setUser(userObj);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
