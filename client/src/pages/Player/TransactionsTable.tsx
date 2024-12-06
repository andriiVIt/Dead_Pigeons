import React, {useEffect, useState} from "react";
import { useAtom } from "jotai";
import { transactionsAtom, transactionsLoadingAtom, fetchTransactions } from "/src/atoms/transactionAtoms";
import { jwtAtom } from "/src/atoms/auth";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx"; // Імпорт токена

import CreateTransactionModal from "/src/components/playerComponents/CreateTransactionModal";



const TransactionsTable: React.FC = () => {
    const [transactions, setTransactions] = useAtom(transactionsAtom);
    const [loading, setLoading] = useAtom(transactionsLoadingAtom);
    const [token] = useAtom(jwtAtom); // Отримуємо токен із локального сховища
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        if (!token) {
            console.error("Token not found. User might not be logged in.");
            return;
        }

        const loadTransactions = async () => {
            setLoading(true);
            await fetchTransactions(setTransactions, token);
            setLoading(false);
        };

        loadTransactions();
    }, [setTransactions, setLoading, token]);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarPlayer />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-6">My Transactions</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mb-6"
                    onClick={openModal}
                >
                    Create Transaction
                </button>

                {loading ? (
                    <p className="text-center">Loading transactions...</p>
                ) : transactions.length > 0 ? (
                    <table className="table-auto w-full bg-white text-black rounded-lg shadow">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border">Amount</th>
                            <th className="px-4 py-2 border">Transaction Date</th>
                            <th className="px-4 py-2 border">MobilePay ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td className="px-4 py-2 border">{transaction.amount || "N/A"} DKK</td>
                                <td className="px-4 py-2 border">
                                    {transaction.transactionDate
                                        ? new Date(transaction.transactionDate).toLocaleString()
                                        : "N/A"}
                                </td>
                                <td className="px-4 py-2 border">
                                    {transaction.mobilePayTransactionId || "N/A"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No transactions yet.</p>
                )}
            </div>
            <CreateTransactionModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default TransactionsTable;
