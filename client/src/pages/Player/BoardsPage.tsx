import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { boardsAtom, boardsLoadingAtom, fetchBoards } from "/src/atoms/boardAtoms";
import { jwtAtom } from "/src/atoms/auth";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";
import { GetGameDto } from "/src/Api";
import { http } from "/src/http";

const BoardsPage: React.FC = () => {
    const [boards, setBoards] = useAtom(boardsAtom);
    const [isLoading, setLoading] = useAtom(boardsLoadingAtom);
    const [token] = useAtom(jwtAtom);
    const [games, setGames] = useState<GetGameDto[]>([]);
    const [sortAscending, setSortAscending] = useState<boolean>(true);
    // Завантаження списку ігор
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await http.gameList();
                setGames(response.data);
            } catch (error) {
                console.error("Failed to fetch games:", error);
            }
        };

        fetchGames();
    }, []);

    useEffect(() => {
        if (!token) {
            console.error("Token not found. User might not be logged in.");
            return;
        }

        const loadBoards = async () => {
            setLoading(true);
            await fetchBoards(setBoards, token);
            setLoading(false);
        };

        loadBoards();
    }, [setBoards, setLoading, token]);

    // Отримання стартової дати гри за gameId
    const getGameStartDate = (gameId: string | undefined): string | undefined | null => {
        const game = games.find((g) => g.id === gameId);
        return game ? game.startDate : null;
    };

    // Функція для обчислення тижня за датою
    const getWeekNumber = (dateString: string | undefined | null): string => {
        if (!dateString) return "Unknown Week";
        const date = new Date(dateString);
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return `Game Week ${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
    };
    const sortByGameWeek = () => {
        const sortedBoards = [...boards].sort((a, b) => {
            const weekA = getWeekNumber(getGameStartDate(a.gameId));
            const weekB = getWeekNumber(getGameStartDate(b.gameId));
            if (weekA === "Unknown Week") return 1; // Невідомі тижні завжди йдуть в кінці
            if (weekB === "Unknown Week") return -1;

            const weekANumber = parseInt(weekA.replace("Game Week ", ""), 10);
            const weekBNumber = parseInt(weekB.replace("Game Week ", ""), 10);

            return sortAscending ? weekANumber - weekBNumber : weekBNumber - weekANumber;
        });

        setBoards(sortedBoards);
        setSortAscending(!sortAscending); // Змінюємо напрямок сортування
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarPlayer />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-6">My Boards</h1>
                {isLoading ? (
                    <p className="text-center">Loading boards...</p>
                ) : boards.length > 0 ? (
                    <table className="table-auto w-full bg-white text-black rounded-lg shadow">
                        <thead>
                        <tr>
                            <th
                                className="px-4 py-2 border cursor-pointer"
                                onClick={sortByGameWeek} // Додаємо сортування при кліці
                            >
                                Game Week {sortAscending ? "▲" : "▼"}
                            </th>

                            <th className="px-4 py-2 border">Numbers</th>
                            <th className="px-4 py-2 border">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {boards.map((board) => (
                            <tr key={board.id}>
                                <td className="px-4 py-2 border">
                                    {getWeekNumber(getGameStartDate(board.gameId))}
                                </td>
                                <td className="px-4 py-2 border">
                                    {board.numbers?.length ? board.numbers.join(", ") : "N/A"}
                                </td>
                                <td className="px-4 py-2 border">{board.price || "N/A"} DKK</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No boards found</p>
                )}
            </div>
        </div>
    );
};

export default BoardsPage;
