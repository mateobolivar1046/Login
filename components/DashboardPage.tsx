
import React, { useState } from 'react';
import type { User } from '../types';
import { GoogleGenAI } from '@google/genai';

interface DashboardPageProps {
    user: User;
    onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                const url = `data:image/jpeg;base64,${base64ImageBytes}`;
                setImageUrl(url);
            } else {
                setError("Could not generate image. The model returned no images.");
            }
        } catch (err) {
            console.error("Image generation failed:", err);
            setError("Sorry, we couldn't generate the image. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12 border border-slate-700 text-center">
                 <div className="mb-4">
                     <span className="text-6xl" role="img" aria-label="wave">👋</span>
                 </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome, <span className="text-sky-400">{user.username}</span>!
                </h1>
                <p className="text-slate-300 text-lg mb-8">You have successfully logged in.</p>
                
                <div className="w-full h-px bg-slate-700 my-8"></div>

                <div className="w-full text-left">
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">Image Generator</h2>
                    <p className="text-slate-400 mb-6 text-center">Describe the image you want to create.</p>
                    
                    <form onSubmit={handleGenerateImage} className="space-y-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., An astronaut riding a horse on Mars, photorealistic"
                            className="w-full h-24 bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                            disabled={isLoading}
                            aria-label="Image generation prompt"
                            aria-required="true"
                        />
                        <button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generating...' : 'Generate Image'}
                        </button>
                    </form>

                    {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mt-6 text-sm" role="alert">{error}</div>}

                    <div className="mt-8 w-full aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700 overflow-hidden">
                        {isLoading && (
                            <div className="text-slate-400 animate-pulse">
                                Conjuring your masterpiece...
                            </div>
                        )}
                        {imageUrl && !isLoading && (
                            <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />
                        )}
                        {!imageUrl && !isLoading && (
                            <div className="text-slate-500">
                                Your generated image will appear here
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full h-px bg-slate-700 my-8"></div>

                <button 
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    Logout
                </button>
            </div>
             <footer className="text-center text-slate-500 mt-8">
                <p>React Auth Portal Demo</p>
            </footer>
        </div>
    );
};

export default DashboardPage;