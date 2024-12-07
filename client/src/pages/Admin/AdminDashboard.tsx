import React, { useEffect, useState } from "react";
import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { http } from "/src/http";
import { jwtAtom } from "/src/atoms/auth.ts";
import EditGameModal from "/src/components/adminComponents/EditGameModal";
import { CreateGameDto, GetWinnerDto, GetPlayerDto, GetTransactionDto } from "/src/Api";

type WinnerWithGameWeek = GetWinnerDto & { gameWeek: number };

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [playersCount, setPlayersCount] = useState<number>(0);
    const [boardsCount, setBoardsCount] = useState<number>(0);
    const [transactionsCount, setTransactionsCount] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [token] = useAtom(jwtAtom);
    const [recentWinners, setRecentWinners] = useState<WinnerWithGameWeek[]>([]);
    const [recentPlayers, setRecentPlayers] = useState<GetPlayerDto[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<GetTransactionDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const getWeekNumber = (date: Date): number => {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + startDate.getDay() + 1) / 7);
    };

    const handleCreateGame = async (data: CreateGameDto) => {
        try {
            await http.gameCreate(data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Game created successfully!");
        } catch (error) {
            console.error("Error creating game:", error);
            alert("Failed to create game.");
        }
    };

    useEffect(() => {
        const fetchRecentActivities = async () => {
            try {
                const gamesResponse = await http.gameList(
                    { limit: 1, startAt: 0 },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const games = gamesResponse.data;
                if (!games.length) {
                    console.warn("No games found");
                    return;
                }

                const latestGame = games[0];
                const gameWeek = getWeekNumber(new Date(latestGame.startDate!));

                if (latestGame?.id) {
                    const winnersResponse = await http.winnerGameDetail(latestGame.id, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const winners = winnersResponse.data.map((winner) => ({
                        ...winner,
                        gameWeek,
                    }));
                    setRecentWinners(winners.slice(0, 5));
                }
            } catch (error) {
                console.error("Error fetching recent activities:", error);
            }
        };

        fetchRecentActivities();
    }, [token]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) {
                console.error("No token available. Please log in.");
                return;
            }

            try {
                const playersResponse = await http.playerList(
                    { limit: 1000, startAt: 0 },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setPlayersCount(playersResponse.data.length);

                const totalBalance = playersResponse.data.reduce(
                    (sum: number, player: { balance?: number }) =>
                        sum + (player.balance || 0),
                    0
                );
                setTotalBalance(totalBalance);

                const boardsResponse = await http.boardList(
                    { limit: 1000, startAt: 0 },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setBoardsCount(boardsResponse.data.length);

                const transactionsResponse = await http.transactionList(
                    { limit: 1000, startAt: 0 },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTransactionsCount(transactionsResponse.data.length);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };

        fetchDashboardData();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            {/* Навбар */}
            <NavBarAdmin />

            {/* Фонова анімація */}
            <div
                className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-10 left-10 blur-xl animate-pulse"
            ></div>
            <div
                className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 bottom-10 right-10 blur-2xl animate-bounce"
            ></div>

            {/* Контент */}
            <div className="container mx-auto p-6 relative z-10">
                <div className="text-white text-center mb-8">
                    <h1 className="text-7xl font-bold">Welcome, Admin!</h1>
                    <p className="mt-2 text-xl">
                        All systems are running smoothly. You have 5 new notifications.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-2xl font-bold">Players</h2>
                        <p className="text-3xl font-bold text-indigo-600">{playersCount}</p>
                    </div>
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-2xl font-bold">Boards</h2>
                        <p className="text-3xl font-bold text-indigo-600">{boardsCount}</p>
                    </div>
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-2xl font-bold">Transactions</h2>
                        <p className="text-3xl font-bold text-indigo-600">{transactionsCount}</p>
                    </div>
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-2xl font-bold">Total Balance</h2>
                        <p className="text-3xl font-bold text-indigo-600">DKK {totalBalance.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add New Game
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/register-player")}
                    >
                        Add New Player
                    </button>
                    <button
                        className="btn btn-accent"
                        onClick={() => navigate("/admin/transactions")}
                    >
                        View Transactions
                    </button>
                </div>

                <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">Recent Activities</h2>
                    <ul className="list-disc list-inside text-lg">
                        {recentWinners.map((winner, index) => (
                            <li key={index}>
                                {winner.playerName} won DKK {winner.winningAmount?.toLocaleString()} in Week #
                                {winner.gameWeek}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <EditGameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                game={null}
                onSubmit={handleCreateGame}
            />
        </div>
    );
};

export default AdminDashboard;
