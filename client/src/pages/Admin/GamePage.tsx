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
        return date.toLocaleDateString("en-GB"); // формат dd/MM/yyyy
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
                        <th className="px-4 py-2 border">#</th>
                        <th
                            className="px-4 py-2 border cursor-pointer"
                            onClick={() => handleSort("week")}
                        >
                            Game Week{" "}
                            {sortColumn === "week" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-4 py-2 border">Start Date</th>
                        <th className="px-4 py-2 border">End Date</th>
                        <th className="px-4 py-2 border">Winning Sequence</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {games.map((game, index) => (
                        <tr key={game.id}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">
                                {getWeekNumber(game.startDate)}
                            </td>
                            <td className="px-4 py-2 border">{formatDate(game.startDate)}</td>
                            <td className="px-4 py-2 border">{formatDate(game.endDate)}</td>
                            <td className="px-4 py-2 border">
                                {game.winningSequence?.join(", ") || "N/A"}
                            </td>
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
