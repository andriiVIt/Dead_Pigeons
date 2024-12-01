import {useParams} from "react-router-dom";
import React from "react";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";

const PlayerDashboard: React.FC = () => {


    return (
        <div
            className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600  text-white relative overflow-hidden">
            <NavBarPlayer/>
            <div
                className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-10 left-10 blur-xl animate-pulse"></div>
            <div
                className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 bottom-10 right-10 blur-2xl animate-bounce"></div>


            <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="absolute top-20 left-20 w-64 h-64 text-yellow-300 opacity-50 animate-spin-slow"
                     fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
                <svg className="absolute bottom-20 right-20 w-64 h-64 text-pink-300 opacity-50 animate-spin-reverse"
                     fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
            </div>
            <div className="container mx-auto py-10 text-white text-center z-10">
                <h1 className='text-3x1 font-bold'>Welcome to Dead Pigeons</h1>
                <p className='mt-4'>Choose an option from the navbar </p>
            </div>
        </div>
    );
};

export default PlayerDashboard;