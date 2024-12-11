import React, { useState, useEffect } from "react";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";
import { http } from "/src/http";
import { useAtom } from "jotai";
import { playerIdAtom } from "/src/atoms/transactionAtoms.ts";
import { GetGameDto } from "/src/Api";
import PlayerBalance from "/src/components/playerComponents/PlayerBalance";
import toast from "react-hot-toast";


const GameTable: React.FC = () => {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [games, setGames] = useState<GetGameDto[]>([]);
    const playerId = useAtom(playerIdAtom)[0];
    const price = { 5: 20, 6: 40, 7: 80, 8: 160 };

    const [balanceUpdated, setBalanceUpdated] = useState(false);
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await http.gameList(); // Підтягуємо список ігор
                setGames(response.data);
            } catch (error) {
                console.error("Failed to fetch games:", error);
            }
        };
        fetchGames();
    }, [balanceUpdated]);

    const toggleNumber = (number: number) => {
        if (selectedNumbers.includes(number)) {
            setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
        } else if (selectedNumbers.length < 8) {
            setSelectedNumbers([...selectedNumbers, number]);
        }
    };

    const calculatePrice = () => {
        const count = selectedNumbers.length;
        return price[count] || 0;
    };

    const handleSubmit = async () => {
        if (!playerId || !selectedGameId) {
            toast.error("Please select a game and ensure you're logged in.");
            return;
        }

        if (selectedNumbers.length < 5 || selectedNumbers.length > 8) {
            toast.error("Please select between 5 and 8 numbers.");

            return;
        }

        const payload = {
            playerId: playerId,
            gameId: selectedGameId,
            numbers: selectedNumbers,
        };

        try {
            const response = await http.boardCreate(payload); // Відправляємо запит на створення дошки
            toast.success("Board created successfully!");
            setBalanceUpdated(!balanceUpdated);
        } catch (error) {
            console.error("Failed to create board:", error);
            toast.error("Failed to create board.");
        }
    };
    // Calculate week number from game start date
    function getWeekNumber(dateString: string): number {
        const date = new Date(dateString);
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    return (
        <div className="pt-10">
            <PlayerBalance key={balanceUpdated ? 1 : 0} />
            <div>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Select your Numbers</h2>

                <div className="mb-6 text-center">
                    <label className="text-xl font-bold text-white">Select a Game:</label>
                    <select
                        className="ml-4 p-2 rounded bg-white text-black w-64" // Додаємо стилі для чорного тексту
                        value={selectedGameId || ""}
                        onChange={(e) => setSelectedGameId(e.target.value)}
                    >
                        <option value="" className="text-gray-500">Choose a game</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.id} className="text-black">
                                {game.startDate
                                    ? `Game Week ${getWeekNumber(game.startDate)}`
                                    : `Unknown Week (${game.id})`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto p-4 bg-transparent rounded-lg shadow-xl">
                    {Array.from({length: 16}, (_, index) => index + 1).map((number) => (
                        <button
                            key={number}
                            onClick={() => toggleNumber(number)}
                            className={`py-16 w-full rounded-xl font-extrabold text-4xl transition-all transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl ${
                                selectedNumbers.includes(number)
                                    ? "bg-gradient-to-tr from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600"
                                    : "bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-900 hover:from-gray-300 hover:to-gray-400"
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <p className="text-4xl font-bold text-white">Price: {calculatePrice()}</p>
                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-6 py-6 text-3xl bg-purple-500 hover:bg-purple-800 text-white font-bold rounded-lg shadow-md transition-all"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameTable;
