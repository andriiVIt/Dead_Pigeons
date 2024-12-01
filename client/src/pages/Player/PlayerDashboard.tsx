import {useParams} from "react-router-dom";
import React from "react";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";

const PlayerDashboard: React.FC = () => {


    return (
        <div
            className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarPlayer/>

            <div className="container mx-auto py-10 text-white text-center z-10">
                <h1 className='text-3x1 font-bold'>Welcome to Dead Pigeons</h1>
                <p className='mt-4'>Choose an option from the navbar </p>
            </div>
        </div>
    );
};

export default PlayerDashboard;