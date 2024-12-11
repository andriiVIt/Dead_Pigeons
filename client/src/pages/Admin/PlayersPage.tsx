import React, {useEffect, useState} from "react";
import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx";
import EditPlayerModal from "/src/components/adminComponents/EditPlayerModal";
import { useAtom } from "jotai";
import {
    playerListAtom,
    selectedPlayerAtom,
    isLoadingPlayersAtom,
    playersErrorAtom,
} from "/src/atoms/playerAtoms.ts";
import { http } from "/src/http";
import {useNavigate} from "react-router-dom";
import {GetPlayerDto, UpdatePlayerDto} from "/src/Api.ts";

const PlayersPage: React.FC = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useAtom(playerListAtom);
    const [isLoading, setIsLoading] = useAtom(isLoadingPlayersAtom);
    const [error, setError] = useAtom(playersErrorAtom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<GetPlayerDto | null>(null);
    useEffect(() => {
        const fetchPlayers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await http.playerList();
                setPlayers(response.data);
            } catch (err) {
                setError("Failed to fetch players.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayers();
    }, [setPlayers, setIsLoading, setError]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this player?")) {
            try {
                await http.playerDelete(id);
                setPlayers((prev) => prev.filter((player) => player.id !== id));
            } catch (err) {
                alert("Failed to delete player.");
                console.error(err);
            }
        }
    };
    const handleRegisterNewPlayer = () => {
        navigate("/register-player");
    };

    const handleEdit = (player: GetPlayerDto) => {
        setSelectedPlayer(player);
        setIsModalOpen(true);
    };

    // Handle updating a player
    const handleUpdatePlayer = async (updatedPlayer: UpdatePlayerDto) => {
        if (!selectedPlayer) return;

        try {
            await http.playerUpdate(selectedPlayer.id!, updatedPlayer); // API call to update
            setPlayers((prev) =>
                prev.map((player) =>
                    player.id === selectedPlayer.id ? { ...player, ...updatedPlayer } : player
                )
            );
            setIsModalOpen(false);
            alert("Player updated successfully!");
        } catch (err) {
            alert("Failed to update player.");
            console.error(err);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarAdmin />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">Manage Players</h1>
                <div className="mb-4 text-center">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm lg:text-base"
                        onClick={handleRegisterNewPlayer}
                    >
                        Register New Player
                    </button>
                </div>
                {isLoading && <p className="text-center text-lg">Loading players...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white text-black rounded-lg shadow-lg border border-gray-200">
                        <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        <tr>
                            <th className="px-4 lg:px-6 py-2 lg:py-3">Name</th>
                            <th className="px-4 lg:px-6 py-2 lg:py-3">Balance</th>
                            <th className="px-4 lg:px-6 py-2 lg:py-3">Status</th>
                            <th className="px-4 lg:px-6 py-2 lg:py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players.map((player, index) => (
                            <tr
                                key={player.id}
                                className={`hover:bg-gray-100 transition duration-300 ${
                                    player.isActive ? "bg-green-50" : "bg-red-50"
                                }`}
                            >
                                <td className="px-4 lg:px-6 py-2 lg:py-4 border-b text-gray-900">
                                    {player.name}
                                </td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4 border-b text-gray-900">
                                    {player.balance} DKK
                                </td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4 border-b text-center">
                                    <span
                                        className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm text-white ${
                                            player.isActive ? "bg-green-500" : "bg-red-500"
                                        }`}
                                    >
                                        {player.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 lg:px-6 py-2 lg:py-4 border-b flex justify-center space-x-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 lg:px-4 py-1 lg:py-2 rounded shadow text-sm lg:text-base"
                                        onClick={() => handleEdit(player)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-1 lg:py-2 rounded shadow text-sm lg:text-base"
                                        onClick={() => handleDelete(player.id!)}
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
            {/* Edit Player Modal */}
            <EditPlayerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                player={selectedPlayer}
                onSubmit={handleUpdatePlayer}
            />
        </div>
    );
};

export default PlayersPage;
