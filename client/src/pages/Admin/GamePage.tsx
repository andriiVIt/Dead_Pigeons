import React, { useEffect } from "react";
import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx";
import { useAtom } from "jotai";
import {
    gamesAtom,
    selectedGameAtom,
    isLoadingGamesAtom,
    gamesErrorAtom,
} from "/src/atoms/gameAtoms.ts";
import { http } from "/src/http";
import EditGameModal from "/src/components/adminComponents/EditGameModal";
import { GetGameDto, CreateGameDto, UpdateGameDto } from "/src/Api";

const GamePage: React.FC = () => {
    const [games, setGames] = useAtom(gamesAtom);
    const [isLoading, setIsLoading] = useAtom(isLoadingGamesAtom);
    const [error, setError] = useAtom(gamesErrorAtom);
    const [selectedGame, setSelectedGame] = useAtom(selectedGameAtom);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await http.gameList();
                setGames(response.data);
            } catch (err) {
                setError("Failed to fetch games.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, [setGames, setIsLoading, setError]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this game?")) {
            try {
                await http.gameDelete(id);
                setGames((prev) => prev.filter((game) => game.id !== id));
            } catch (err) {
                alert("Failed to delete game.");
                console.error(err);
            }
        }
    };

    const handleCreate = () => {
        setSelectedGame(null);
        setIsModalOpen(true);
    };

    const handleEdit = (game: GetGameDto) => {
        setSelectedGame({
            id: game.id, // Додайте ID гри
            startDate: game.startDate,
            endDate: game.endDate,
            winningSequence: game.winningSequence,
        });
        setIsModalOpen(true);
    };

    const handleSave = async (data: CreateGameDto | UpdateGameDto) => {
        try {
            if (selectedGame) {

                const response = await http.gameUpdate(selectedGame.id!, {
                    ...data,
                    startDate: new Date(data.startDate!).toISOString(),
                    endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
                });
                setGames((prev) =>
                    prev.map((game) =>
                        game.id === selectedGame.id ? { ...game, ...response.data } : game
                    )
                );
            } else {
                // Створення нової гри
                const response = await http.gameCreate({
                    ...data,
                    startDate: new Date(data.startDate!).toISOString(),
                    endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
                });
                setGames((prev) => [...prev, response.data]);
            }
            alert("Game saved successfully!");
            setIsModalOpen(false);
        } catch (err) {
            alert("Failed to save game.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarAdmin />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-6">Manage Games</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    onClick={handleCreate}
                >
                    Create Game
                </button>

                {isLoading && <p>Loading games...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <table className="table-auto w-full bg-white text-black rounded shadow">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Start Date</th>
                        <th className="px-4 py-2 border">End Date</th>
                        <th className="px-4 py-2 border">Winning Sequence</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td className="px-4 py-2 border">{game.id}</td>
                            <td className="px-4 py-2 border">{game.startDate}</td>
                            <td className="px-4 py-2 border">{game.endDate}</td>
                            <td className="px-4 py-2 border">{game.winningSequence?.join(", ")}</td>
                            <td className="px-4 py-2 border">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                    onClick={() => handleEdit(game)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleDelete(game.id!)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Інтеграція модального вікна */}
            <EditGameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                game={selectedGame}
                onSubmit={handleSave}
            />
        </div>
    );
};

export default GamePage;
