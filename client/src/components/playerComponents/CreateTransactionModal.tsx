import React, { useState } from "react";
import { useAtom } from "jotai";
import { playerIdAtom, transactionsAtom, fetchTransactions } from "/src/atoms/transactionAtoms";
import { jwtAtom } from "/src/atoms/auth";
import { http } from "/src/http";

interface CreateTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ isOpen, onClose }) => {
    const [transactions, setTransactions] = useAtom(transactionsAtom); // Update transactions
    const [playerId] = useAtom(playerIdAtom); // Get the playerId from the atom
    const [token] = useAtom(jwtAtom); // We get a token from an atom
    const [formData, setFormData] = useState({
        amount: "",
        mobilePayTransactionId: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!playerId) {
            console.error("Player ID not found.");
            return;
        }

        try {
            // Sending a request to create a transaction
            const response = await http.transactionCreate({
                playerId: playerId,
                amount: parseFloat(formData.amount),
                mobilePayTransactionId: formData.mobilePayTransactionId,
            });

            console.log("Transaction created:", response.data);

            // Update the list of transactions
            if (token) {
                await fetchTransactions(setTransactions, token);
            }

            // Clear the form
            setFormData({ amount: "", mobilePayTransactionId: "" });

            // Close the modal window
            onClose();
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-center text-black">Create New Transaction</h2>
                <h3 className="text-lg font-bold mb-4">Create New Transaction</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">

                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="mobilePayTransactionId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            MobilePay Transaction ID
                        </label>
                        <input
                            type="text"
                            id="mobilePayTransactionId"
                            name="mobilePayTransactionId"
                            value={formData.mobilePayTransactionId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTransactionModal;
