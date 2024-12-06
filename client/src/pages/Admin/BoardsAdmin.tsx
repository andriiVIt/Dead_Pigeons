import React, { useEffect, useState } from "react";
import { GetBoardDto } from "/src/Api.ts";
import { http } from "/src/http";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";
import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx"; // Використовуйте ваш навбар або створіть окремий для адміністратора.

const BoardsAdmin: React.FC = () => {
    const [boards, setBoards] = useState<GetBoardDto[]>([]); // Типізований стан для бордів
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllBoards = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Викликаємо API для отримання всіх бордів
                const response = await http.boardList(); // API повинен повертати всі борди
                setBoards(response.data); // Оновлюємо стан бордами
            } catch (err) {
                console.error(err);
                setError("Failed to fetch boards");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllBoards();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarAdmin /> {/* Змініть на відповідний навбар для адміністратора */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-6">All Boards</h1>
                {isLoading ? (
                    <p className="text-center">Loading...</p>
                ) : boards.length > 0 ? (
                    <table className="table-auto w-full bg-white shadow rounded text-black">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border">Board ID</th>
                            <th className="px-4 py-2 border">Player ID</th>
                            <th className="px-4 py-2 border">Game ID</th>
                            <th className="px-4 py-2 border">Numbers</th>
                            <th className="px-4 py-2 border">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {boards.map((board) => (
                            <tr key={board.id}>
                                <td className="px-4 py-2 border">{board.id || "N/A"}</td>
                                <td className="px-4 py-2 border">{board.playerId || "N/A"}</td>
                                <td className="px-4 py-2 border">{board.gameId || "N/A"}</td>
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

export default BoardsAdmin;
