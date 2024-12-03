// src/pages/Admin/TransactionPage.tsx

import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import NavBarAdmin from "/src/components/adminComponents/NavBarAdmin.tsx";
import { transactionsAtom, transactionsLoadingAtom } from "/src/atoms/transactionAtoms";
import { http } from "/src/http";

const TransactionPage: React.FC = () => {
    const [transactions, setTransactions] = useAtom(transactionsAtom);
    const [loading, setLoading] = useAtom(transactionsLoadingAtom);
    const [editTransactionId, setEditTransactionId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<number | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await http.transactionList({ limit: 50, startAt: 0 }); // Завантажуємо перші 50 транзакцій
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [setTransactions, setLoading]);

    // Функція видалення транзакції
    const handleDelete = async (transactionId: string) => {
        try {
            await http.transactionDelete(transactionId);
            setTransactions(transactions.filter((transaction) => transaction.id !== transactionId));
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    // Функція оновлення транзакції
    const handleEdit = async () => {
        if (!editTransactionId || editAmount === null) return;

        try {
            const payload = { amount: editAmount, mobilePayTransactionId: "SomeTransactionId" }; // Replace with actual ID if necessary
            console.log("Sending update request:", payload);

            await http.transactionUpdate(editTransactionId, payload);
            setTransactions((prev) =>
                prev.map((transaction) =>
                    transaction.id === editTransactionId
                        ? { ...transaction, amount: editAmount }
                        : transaction
                )
            );
            setEditTransactionId(null); // Закрити режим редагування
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarAdmin />

            {/* Тло */}
            <div className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 top-10 left-10 blur-xl animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 bottom-10 right-10 blur-2xl animate-bounce"></div>

            {/* Контент сторінки */}
            <div className="container mx-auto py-10 z-10">
                <h1 className="text-3xl font-bold text-center mb-6">Transactions</h1>

                {loading ? (
                    <p className="text-center text-lg">Loading transactions...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left text-white border-collapse border border-gray-500">
                            <thead>
                            <tr>
                                <th className="border border-gray-500 px-4 py-2">Player Name</th>
                                <th className="border border-gray-500 px-4 py-2">Amount</th>
                                <th className="border border-gray-500 px-4 py-2">MobilePay Transaction ID</th>
                                <th className="border border-gray-500 px-4 py-2">Transaction Date</th>
                                <th className="border border-gray-500 px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="border border-gray-500 px-4 py-2">{transaction.playerName || "Unknown"}</td>
                                    <td className="border border-gray-500 px-4 py-2">
                                        {editTransactionId === transaction.id ? (
                                            <input
                                                type="number"
                                                className="text-black px-2 py-1 rounded"
                                                value={editAmount ?? transaction.amount}
                                                onChange={(e) => setEditAmount(Number(e.target.value))}
                                            />
                                        ) : (
                                            transaction.amount
                                        )}
                                    </td>
                                    <td className="border border-gray-500 px-4 py-2">
                                        {transaction.mobilePayTransactionId || "N/A"}
                                    </td>
                                    <td className="border border-gray-500 px-4 py-2">
                                        {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : "N/A"}
                                    </td>
                                    <td className="border border-gray-500 px-4 py-2">
                                        {editTransactionId === transaction.id ? (
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                                                onClick={handleEdit}
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                                onClick={() => {
                                                    setEditTransactionId(transaction.id!);
                                                    setEditAmount(transaction.amount!);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={() => handleDelete(transaction.id!)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionPage;
