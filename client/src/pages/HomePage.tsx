import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 flex items-center justify-center text-white relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-10 left-10 blur-xl animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 bottom-10 right-10 blur-2xl animate-bounce"></div>

            <div className="hero-content flex flex-col items-center text-center z-10">
                <h1 className="text-6xl font-extrabold animate-fade-in">
                    Welcome to <span className="text-yellow-300">Dead Pigeons</span> Lottery!
                </h1>
                <p className="py-6 text-xl max-w-2xl">
                    Experience the thrill of Jerne IF's official lottery game. Join today to play and win amazing prizes!
                </p>
                <button
                    className="btn btn-warning btn-wide text-lg shadow-lg transform transition-transform hover:scale-105"
                    onClick={handleLoginRedirect}
                >
                    Get Started
                </button>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="absolute top-20 left-20 w-64 h-64 text-yellow-300 opacity-50 animate-spin-slow" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
                <svg className="absolute bottom-20 right-20 w-64 h-64 text-pink-300 opacity-50 animate-spin-reverse" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
            </div>

            <footer className="absolute bottom-4 text-sm text-gray-200 z-10">
                © 2024 Dead Pigeons.
            </footer>
        </div>
    );
};

export default HomePage;
