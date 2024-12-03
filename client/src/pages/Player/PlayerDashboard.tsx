import {useParams} from "react-router-dom";
import React from "react";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";

const PlayerDashboard: React.FC = () => {


    return (
        <div>
            <NavBarPlayer/>

            <div className="container mx-auto py-10 text-white text-center z-10">
                <h1 className='text-3xl font-bold'>Welcome to Dead Pigeons</h1>
                <p className='mt-4'>Choose an option from the navbar </p>
            </div>
        </div>
    );
};

export default PlayerDashboard;