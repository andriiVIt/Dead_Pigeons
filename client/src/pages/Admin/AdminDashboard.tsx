import React from "react";
import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx";

const AdminDashboard: React.FC = () => {
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
                {/* Вітальний блок */}
                <div className="   text-white text-center mb-8">
                    <h1 className="text-7xl font-bold">Welcome, Admin!</h1>
                    <p className="mt-2">
                        All systems are running smoothly. You have 5 new notifications.
                    </p>
                </div>

                {/* Дашборд зі статистикою */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold">Players</h2>
                        <p className="text-3xl font-bold text-indigo-600">125</p>
                    </div>
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold">Games</h2>
                        <p className="text-3xl font-bold text-indigo-600">56</p>
                    </div>
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold">Transactions</h2>
                        <p className="text-3xl font-bold text-indigo-600">845</p>
                    </div>
                    <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold">Total Balance</h2>
                        <p className="text-3xl font-bold text-indigo-600">DKK 452,300</p>
                    </div>
                </div>

                {/* Кнопки швидкого доступу */}
                <div className="flex justify-center gap-4 mb-8">
                    <button className="btn btn-primary">Add New Game</button>
                    <button className="btn btn-secondary">Add New Player</button>
                    <button className="btn btn-accent">View Transactions</button>
                </div>

                {/* Останні дії */}
                <div className="bg-white text-gray-700 p-6 rounded shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
                    <ul className="list-disc list-inside">
                        <li>John Doe won DKK 5,000 in Game #45</li>
                        <li>New player: Alice Smith</li>
                        <li>Transaction: Player ID 123 added DKK 1,200</li>
                    </ul>
                </div>
            </div>

            {/* SVG анімація */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg
                    className="absolute top-20 left-20 w-64 h-64 text-yellow-300 opacity-50 animate-spin-slow"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                >
                    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
                <svg
                    className="absolute bottom-20 right-20 w-64 h-64 text-pink-300 opacity-50 animate-spin-reverse"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                >
                    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="4"></circle>
                </svg>
            </div>
        </div>
    );
};

export default AdminDashboard;
