import React, { useEffect, useState } from "react";
import { GetBoardDto, GetPlayerDto, GetGameDto } from "/src/Api.ts";
import { http } from "/src/http";

import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx";

const BoardsAdmin: React.FC = () => {
    const [boards, setBoards] = useState<GetBoardDto[]>([]);
    const [players, setPlayers] = useState<GetPlayerDto[]>([]);
    const [games, setGames] = useState<GetGameDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [sortColumn, setSortColumn] = useState<string>(""); // Колонка для сортування
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Напрямок сортування

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const boardsResponse = await http.boardList();
                setBoards(boardsResponse.data);

                const playersResponse = await http.playerList();
                setPlayers(playersResponse.data);

                const gamesResponse = await http.gameList();
                setGames(gamesResponse.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Знаходимо ім'я гравця за його ID
    const getPlayerName = (playerId: string) => {
        const player = players.find((p) => p.id === playerId);
        return player?.name || "Unknown Player";
    };

    // Обчислюємо тиждень гри за датою початку
    const getGameWeek = (gameId: string) => {
        const game = games.find((g) => g.id === gameId);
        if (game?.startDate) {
            const date = new Date(game.startDate);
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        }
        return null;
    };

    // Сортування даних
    const sortedBoards = [...boards].sort((a, b) => {
        if (!sortColumn) return 0;

        let aValue: string | number | null = "";
        let bValue: string | number | null = "";

        if (sortColumn === "playerName") {
            aValue = getPlayerName(a.playerId || "");
            bValue = getPlayerName(b.playerId || "");
        } else if (sortColumn === "gameWeek") {
            aValue = getGameWeek(a.gameId || "") || 0;
            bValue = getGameWeek(b.gameId || "") || 0;
        }

        if (aValue === bValue) return 0;

        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Функція для зміни сортування
    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarAdmin />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">All Boards</h1>
                {isLoading ? (
                    <p className="text-center text-lg">Loading...</p>
                ) : sortedBoards.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full bg-white shadow-lg rounded-lg text-black border-collapse border border-gray-200">
                            <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                            <tr>
                                <th className="px-4 lg:px-6 py-2 lg:py-3 text-center">#</th>
                                <th
                                    className="px-4 lg:px-6 py-2 lg:py-3 text-left cursor-pointer"
                                    onClick={() => handleSort("playerName")}
                                >
                                    Player Name {sortColumn === "playerName" && (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    className="px-4 lg:px-6 py-2 lg:py-3 text-left cursor-pointer"
                                    onClick={() => handleSort("gameWeek")}
                                >
                                    Game Week {sortColumn === "gameWeek" && (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">Numbers</th>
                                <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedBoards.map((board, index) => (
                                <tr
                                    key={board.id}
                                    className={`hover:bg-gray-100 transition duration-300 ease-in-out ${
                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }`}
                                >
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-center">{index + 1}</td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-gray-900 font-medium">
                                        {getPlayerName(board.playerId || "")}
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-gray-600">
                                        {getGameWeek(board.gameId || "") !== null
                                            ? `Week ${getGameWeek(board.gameId || "")}`
                                            : "Unknown Week"}
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-gray-600">
                                        {board.numbers?.length ? board.numbers.join(", ") : "N/A"}
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-gray-600">{board.price || "N/A"} DKK</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-lg">No boards found</p>
                )}
            </div>
        </div>
    );
};

export default BoardsAdmin;
