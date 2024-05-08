import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('userName') ? JSON.parse(localStorage.getItem('userName')).name : null;
    
        setIsLoggedIn(!!token);
        setCurrentUser(user);
    }, []);

    const handleLogout = async () => {
        // Send logout request to the backend
        try {
            const userId = currentUser; // Assuming you store userId in localStorage
            console.log("Sending logout request for userId:", userId);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                },
                body: JSON.stringify({ userId }) // Send userId if needed for the backend
            });
            
            if (response.ok) {
                console.log('Logout successful');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    
        // Clear local storage and update state
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Ensure you remove userId too
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate("/login");
    };


    return { isLoggedIn, currentUser, handleLogout };
};
