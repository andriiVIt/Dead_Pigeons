import React, {useEffect, useState} from "react";
import { useAtom } from "jotai";
import { transactionsAtom, transactionsLoadingAtom, fetchTransactions } from "/src/atoms/transactionAtoms";
import { jwtAtom } from "/src/atoms/auth";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx"; // Імпорт токена

import CreateTransactionModal from "/src/components/playerComponents/CreateTransactionModal";



const TransactionsTable: React.FC = () => {
    const [transactions, setTransactions] = useAtom(transactionsAtom);
    const [loading, setLoading] = useAtom(transactionsLoadingAtom);
    const [token] = useAtom(jwtAtom);  
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
                <div className="flex justify-center mb-6">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                        onClick={openModal}
                    >
                        Create Transaction
                    </button>
                </div>
                {loading ? (
                    <p className="text-center text-lg">Loading transactions...</p>
                ) : transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full bg-white text-black rounded-lg shadow-lg border border-gray-200">
                            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">Amount</th>
                                <th className="px-6 py-3 text-left">Transaction Date</th>
                                <th className="px-6 py-3 text-left ">MobilePay ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((transaction, index) => (
                                <tr
                                    key={transaction.id}
                                    className={`hover:bg-gray-100 transition duration-300 ${
                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }`}
                                >
                                    <td className="px-6 py-4 border-b text-gray-900 font-medium">
                                        {transaction.amount || "N/A"} DKK
                                    </td>
                                    <td className="px-6 py-4 border-b text-gray-600">
                                        {transaction.transactionDate
                                            ? new Date(transaction.transactionDate).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 border-b text-gray-600 ">
                                        {transaction.mobilePayTransactionId || "N/A"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-lg">No transactions yet.</p>
                )}
            </div>
            <CreateTransactionModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default TransactionsTable;
