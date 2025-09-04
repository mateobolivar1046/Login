
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import type { User } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from session storage", error);
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = (user: User) => {
        const userToStore = { username: user.username };
        setCurrentUser(userToStore);
        try {
            sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
        } catch (error) {
            console.error("Failed to save user to session storage", error);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        try {
            sessionStorage.removeItem('currentUser');
        } catch (error) {
            console.error("Failed to remove user from session storage", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-800">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white font-sans">
            {currentUser ? (
                <DashboardPage user={currentUser} onLogout={handleLogout} />
            ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;
