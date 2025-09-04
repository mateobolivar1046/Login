
import React, { useState, useCallback } from 'react';
import type { User } from '../types';

interface LoginPageProps {
    onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const clearForm = useCallback(() => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccessMessage(null);
    }, []);

    const toggleView = useCallback(() => {
        setIsLoginView(prev => !prev);
        clearForm();
    }, [clearForm]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!username || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const usersJSON = localStorage.getItem('users');
            const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

            if (users.some(user => user.username === username)) {
                setError("Username already exists.");
                return;
            }

            // NOTE: Storing passwords in localStorage is insecure. This is for demonstration only.
            // In a real application, passwords should be hashed on a secure backend.
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            setSuccessMessage("Registration successful! Please log in.");
            toggleView();
        } catch (err) {
            setError("Failed to register. Please try again.");
            console.error(err);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }

        try {
            const usersJSON = localStorage.getItem('users');
            const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];
            const foundUser = users.find(user => user.username === username && user.password === password);

            if (foundUser) {
                onLoginSuccess({ username: foundUser.username });
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("Failed to log in. Please try again.");
            console.error(err);
        }
    };
    
    const title = isLoginView ? "Welcome Back" : "Create Account";
    const subTitle = isLoginView ? "Sign in to continue" : "Join us today";
    const buttonText = isLoginView ? "Login" : "Register";
    const toggleText = isLoginView ? "Don't have an account?" : "Already have an account?";
    const toggleLinkText = isLoginView ? "Register" : "Login";

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">{title}</h1>
                    <p className="text-slate-400 mt-2">{subTitle}</p>
                </div>
                
                <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                    {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</div>}
                    {successMessage && <div className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4 text-sm">{successMessage}</div>}
                    
                    <div className="space-y-6">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                        />
                        {!isLoginView && (
                             <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                            />
                        )}
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg mt-8 transition-all duration-300 transform hover:scale-105"
                    >
                        {buttonText}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-slate-400 text-sm">
                        {toggleText}{' '}
                        <button onClick={toggleView} className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                            {toggleLinkText}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
