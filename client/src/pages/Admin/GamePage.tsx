import React, { useEffect, useState } from "react";
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
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
            id: game.id,
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
                    endDate: data.endDate
                        ? new Date(data.endDate).toISOString()
                        : undefined,
                });
                setGames((prev) =>
                    prev.map((game) =>
                        game.id === selectedGame.id ? { ...game, ...response.data } : game
                    )
                );
            } else {
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

    const getWeekNumber = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // format dd/MM/yyyy
    };

    const handleSort = (column: string) => {
        const direction =
            sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(direction);

        const sortedGames = [...games].sort((a, b) => {
            const aValue =
                column === "week"
                    ? getWeekNumber(a.startDate)
                    : a[column as keyof GetGameDto];
            const bValue =
                column === "week"
                    ? getWeekNumber(b.startDate)
                    : b[column as keyof GetGameDto];

            if (aValue === bValue) return 0;
            if (aValue == null) return direction === "asc" ? -1 : 1;
            if (bValue == null) return direction === "asc" ? 1 : -1;

            return direction === "asc"
                ? aValue > bValue
                    ? 1
                    : -1
                : aValue > bValue
                    ? -1
                    : 1;
        });

        setGames(sortedGames);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarAdmin />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">Manage Games</h1>
                <div className="text-center mb-6">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm lg:text-base shadow"
                        onClick={handleCreate}
                    >
                        Create Game
                    </button>
                </div>

                {isLoading && <p className="text-center text-lg">Loading games...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white text-black rounded-lg shadow-lg border border-gray-200">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <tr>
                            <th className="px-4 lg:px-6 py-2 lg:py-3 text-center">#</th>
                            <th
                                className="px-4 lg:px-6 py-2 lg:py-3 text-left cursor-pointer"
                                onClick={() => handleSort("week")}
                            >
                                Game Week{" "}
                                {sortColumn === "week" && (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">Start Date</th>
                            <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">End Date</th>
                            <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">Winning Sequence</th>
                            <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map((game, index) => (
                            <tr
                                key={game.id}
                                className={`hover:bg-gray-100 transition duration-300 ${
                                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }`}
                            >
                                <td className="px-4 lg:px-6 py-2 lg:py-4 text-center">{index + 1}</td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4">{getWeekNumber(game.startDate)}</td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4">{formatDate(game.startDate)}</td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4">{formatDate(game.endDate)}</td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4">
                                    {game.winningSequence?.join(", ") || "N/A"}
                                </td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4 flex justify-center space-x-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow text-sm lg:text-base"
                                        onClick={() => handleEdit(game)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow text-sm lg:text-base"
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
            </div>
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
