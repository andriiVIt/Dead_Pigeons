import React from 'react';
import GameTable from "/src/pages/Player/GameTable.tsx";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";

const GamesPage = () => {
    return (
        <div>
            <NavBarPlayer/>
            <GameTable/>
        </div>
    );
};

export default GamesPage;