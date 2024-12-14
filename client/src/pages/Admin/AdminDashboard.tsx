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
             
            <NavBarAdmin />

             
            <div className="container mx-auto px-4 py-6 relative z-10 mt-36">
                <div className="text-white text-center mb-8">

                    <h1 className="text-6xl md:text-1xl font-bold">Welcome, Admin!</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8">
                    <div className="bg-white text-gray-700 p-4 md:p-6 rounded shadow-lg">
                        <h2 className="text-xl md:text-2xl font-bold">Players</h2>
                        <p className="text-2xl md:text-3xl font-bold text-indigo-600">{playersCount}</p>
                    </div>
                    <div className="bg-white text-gray-700 p-4 md:p-6 rounded shadow-lg">
                        <h2 className="text-xl md:text-2xl font-bold">Boards</h2>
                        <p className="text-2xl md:text-3xl font-bold text-indigo-600">{boardsCount}</p>
                    </div>
                    <div className="bg-white text-gray-700 p-4 md:p-6 rounded shadow-lg">
                        <h2 className="text-xl md:text-2xl font-bold">Transactions</h2>
                        <p className="text-2xl md:text-3xl font-bold text-indigo-600">{transactionsCount}</p>
                    </div>
                    <div className="bg-white text-gray-700 p-4 md:p-6 rounded shadow-lg">
                        <h2 className="text-xl md:text-2xl font-bold">Total Balance</h2>
                        <p className="text-2xl md:text-3xl font-bold text-indigo-600">DKK {totalBalance.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded shadow"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add New Game
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded shadow"
                        onClick={() => navigate('/register-player')}
                    >
                        Add New Player
                    </button>
                    <button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded shadow"
                        onClick={() => navigate('/admin/transactions')}
                    >
                        View Transactions
                    </button>
                </div>

                <div className="bg-white text-gray-700 p-4 md:p-6 rounded shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Recent Activities</h2>
                    <ul className="list-disc list-inside text-sm md:text-lg">
                        {recentWinners.map((winner, index) => (
                            <li key={index}>
                                {winner.playerName} won DKK {winner.winningAmount?.toLocaleString()} in Week #{winner.gameWeek}
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
