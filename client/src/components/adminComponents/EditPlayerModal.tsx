import React, { useEffect, useState } from "react";
import { UpdatePlayerDto } from "../../Api.ts";

type EditPlayerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    player: UpdatePlayerDto | null;
    onSubmit: (updatedPlayer: UpdatePlayerDto) => void;
};

const EditPlayerModal: React.FC<EditPlayerModalProps> = ({ isOpen, onClose, player, onSubmit }) => {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (player) {
            setName(player.name || "");
            setBalance(player.balance || 0);
            setIsActive(player.isActive || false);
        }
    }, [player]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, balance, isActive });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Player</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Balance</label>
                        <input
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(Number(e.target.value))}
                            className="input input-bordered w-full text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Active</label>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="checkbox"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlayerModal;
