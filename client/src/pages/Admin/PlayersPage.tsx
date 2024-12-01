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
                <h1 className="text-3xl font-bold text-center mb-6">Manage Players</h1>
                <div className="mb-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleRegisterNewPlayer}
                    >
                        Register New Player
                    </button>
                </div>
                {isLoading && <p>Loading players...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <table className="table-auto w-full bg-white text-black rounded shadow">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Balance</th>
                        <th className="px-4 py-2 border">Status</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {players.map((player) => (
                        <tr key={player.id}>
                            <td className="px-4 py-2 border">{player.name}</td>
                            <td className="px-4 py-2 border">{player.balance} DKK</td>
                            <td className="px-4 py-2 border">
                                {player.isActive ? "Active" : "Inactive"}
                            </td>
                            <td className="px-4 py-2 border">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                    onClick={() => handleEdit(player)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
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
