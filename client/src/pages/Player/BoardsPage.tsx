import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { boardsAtom, boardsLoadingAtom, fetchBoards } from "/src/atoms/boardAtoms";
import { jwtAtom } from "/src/atoms/auth";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";

const BoardsTable: React.FC = () => {
    const [boards, setBoards] = useAtom(boardsAtom);
    const [isLoading, setLoading] = useAtom(boardsLoadingAtom);
    const [token] = useAtom(jwtAtom);

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
                            <th className="px-4 py-2 border">Board ID</th>
                            <th className="px-4 py-2 border">Game ID</th>
                            <th className="px-4 py-2 border">Numbers</th>
                            <th className="px-4 py-2 border">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {boards.map((board) => (
                            <tr key={board.id}>
                                <td className="px-4 py-2 border">{board.id || "N/A"}</td>
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

export default BoardsTable;
