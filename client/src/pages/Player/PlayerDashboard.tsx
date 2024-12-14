import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { playerIdAtom } from "/src/atoms/transactionAtoms";
import { http } from "/src/http";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer";
import { GetWinnerDto, GetGameDto } from "/src/Api.ts";

const PlayerDashboard: React.FC = () => {
    const [playerId] = useAtom(playerIdAtom);
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [gameResults, setGameResults] = useState<{ game: GetGameDto; winner: GetWinnerDto | null }[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [isWinner, setIsWinner] = useState<boolean | null>(null);
    const [prizeAmount, setPrizeAmount] = useState<number | null>(null);

    useEffect(() => {
        const fetchPlayerName = async () => {
            try {
                if (!playerId) return;
                const response = await http.playerDetail(playerId);
                setPlayerName(response.data.name || "Player");
            } catch (error) {
                console.error("Error fetching player name:", error);
            }
        };

        const fetchGamesAndResults = async () => {
            try {
                const gamesResponse = await http.gameList();
                const games = gamesResponse.data;

                const results = await Promise.all(
                    games.map(async (game: GetGameDto) => {
                        try {
                            const winnerResponse = await http.winnerPlayerDetail(playerId);
                            const winner = winnerResponse.data.find(
                                (w: GetWinnerDto) => w.gameId === game.id
                            );
                            return { game, winner: winner || null };
                        } catch {
                            return { game, winner: null };
                        }
                    })
                );

                setGameResults(results);
            } catch (error) {
                console.error("Error fetching games and results:", error);
            }
        };

        fetchPlayerName();
        fetchGamesAndResults();
    }, [playerId]);

    const checkWinner = async (gameId: string) => {
        const existingResult = gameResults.find((result) => result.game.id === gameId)?.winner;
        if (existingResult) {
            setIsWinner(true);
            // @ts-ignore
            setPrizeAmount(existingResult.winningAmount);
            return;
        }

        try {
            const response = await http.winnerGameCheckCreate(gameId, playerId);
            // @ts-ignore
            setIsWinner(response.data.isWinner);
            // @ts-ignore
            setPrizeAmount(response.data.prizeAmount);
        } catch (error) {
            console.error("Error checking winner:", error);
        }
    };

    const getWeekNumber = (dateString: string): number => {
        const date = new Date(dateString);
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarPlayer />

            {/* Welcome message */}
            <div className="flex justify-center items-center h-[30vh]">
                <div className="animate-fade-in bg-indigo-500 bg-opacity-20 p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-4xl font-bold animate-bounce">
                        Welcome back, <span className="text-yellow-400">{playerName}</span>!
                    </h1>
                    <p className="mt-4 text-2xl">Good luck in the next game!</p>
                </div>
            </div>

            {/* Check win */}
            <div className="container mx-auto py-10 text-white text-center z-10">
                <h2 className="text-3xl font-bold mb-6">Check if you are a winner!</h2>
                <div className="mb-4">
                    <select
                        className="border rounded px-4 py-2 text-black"
                        onChange={(e) => setSelectedGameId(e.target.value)}
                        value={selectedGameId || ""}
                    >
                        <option value="">Select a Game</option>
                        {gameResults.map(({ game }) => (
                            <option key={game.id} value={game.id}>
                                Week {getWeekNumber(game.startDate!)} (Start: {new Date(game.startDate!).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => selectedGameId && checkWinner(selectedGameId)}
                        className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Check
                    </button>
                </div>
                {isWinner !== null && (
                    <div className="mt-4">
                        {isWinner ? (
                            <p className="text-2xl text-green-400">
                                Congratulations! You won <span className="font-bold">{prizeAmount} DKK</span>!
                            </p>
                        ) : (
                            <p className="text-2xl text-red-400">Sorry, you did not win this time.</p>
                        )}
                    </div>
                )}
            </div>

            {/* List of victories */}
            <div className="container mx-auto py-10 text-white text-center z-10">
                <h2 className="text-4xl font-bold mb-6">Your Winning Results:</h2>
                {gameResults.filter((result) => result.winner).length > 0 ? (
                    <table className="table-auto w-full bg-white text-black rounded shadow mt-6">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Game Week</th>
                            <th className="px-4 py-2 border">Winning Amount</th>
                            <th className="px-4 py-2 border">Start Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gameResults.map(({ game, winner }, index) =>
                            winner ? (
                                <tr key={winner.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">
                                        Week {getWeekNumber(game.startDate!)}
                                    </td>
                                    <td className="px-4 py-2 border">{winner.winningAmount} DKK</td>
                                    <td className="px-4 py-2 border">
                                        {new Date(game.startDate!).toLocaleDateString()}
                                    </td>
                                </tr>
                            ) : null
                        )}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-lg mt-6">No wins found.</p>
                )}
            </div>

            {/* Signature */}
            <footer className="text-center py-4 text-sm text-gray-200">
                <p>© {new Date().getFullYear()} Dead Pigeons Lottery. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PlayerDashboard;
