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
    // State for sorting
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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
    const handleSort = (column: string) => {
        const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(direction);

        const sortedTransactions = [...transactions].sort((a, b) => {
            const aValue = a[column as keyof typeof a];
            const bValue = b[column as keyof typeof b];

            if (aValue === bValue) return 0;
            if (aValue == null) return direction === "asc" ? -1 : 1;
            if (bValue == null) return direction === "asc" ? 1 : -1;

            return direction === "asc"
                ? aValue > bValue
                    ? 1
                    : -1
                : aValue > bValue
                    ? -1
                    : 1;
        });

        setTransactions(sortedTransactions);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarAdmin />

            {/* Background animations */}

            {/* Main content */}
            <div className="container mx-auto py-6 lg:py-10 z-10">
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">Transactions</h1>

                {loading ? (
                    <p className="text-center text-lg">Loading transactions...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full bg-white text-black rounded-lg shadow-lg border-collapse border border-gray-300">
                            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <tr>
                                <th className="px-4 lg:px-6 py-2 lg:py-3 text-center">#</th>
                                <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">Player Name</th>
                                <th
                                    className="px-4 lg:px-6 py-2 lg:py-3 text-left cursor-pointer"
                                    onClick={() => handleSort("amount")}
                                >
                                    Amount {sortColumn === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">MobilePay Transaction ID</th>
                                <th
                                    className="px-4 lg:px-6 py-2 lg:py-3 text-left cursor-pointer"
                                    onClick={() => handleSort("transactionDate")}
                                >
                                    Transaction Date{" "}
                                    {sortColumn === "transactionDate" && (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="px-4 lg:px-6 py-2 lg:py-3 text-left">Actions</th>
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
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-center">{index + 1}</td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-gray-900">{transaction.playerName || "Unknown"}</td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3">
                                        {editTransactionId === transaction.id ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    className="border border-gray-300 rounded px-2 lg:px-3 py-1 lg:py-2 text-black"
                                                    value={editAmount ?? transaction.amount}
                                                    onChange={(e) => setEditAmount(Number(e.target.value))}
                                                />
                                                <span className="ml-2">DKK</span>
                                            </div>
                                        ) : (
                                            `${transaction.amount} DKK`
                                        )}
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3">{transaction.mobilePayTransactionId || "N/A"}</td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3">
                                        {transaction.transactionDate
                                            ? new Date(transaction.transactionDate).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 flex space-x-2">
                                        {editTransactionId === transaction.id ? (
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow text-sm lg:text-base"
                                                onClick={handleEdit}
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-sm lg:text-base"
                                                onClick={() => {
                                                    setEditTransactionId(transaction.id!);
                                                    setEditAmount(transaction.amount!);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-sm lg:text-base"
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