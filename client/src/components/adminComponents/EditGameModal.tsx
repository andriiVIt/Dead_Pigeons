import React, { useState } from "react";
import { CreateGameDto, UpdateGameDto } from "/src/Api";

type EditGameModalProps = {
    isOpen: boolean;
    onClose: () => void;
    game: UpdateGameDto | null;
    onSubmit: (data: CreateGameDto | UpdateGameDto) => void;
};

const EditGameModal: React.FC<EditGameModalProps> = ({ isOpen, onClose, game, onSubmit }) => {
    const [startDate, setStartDate] = useState(game?.startDate || new Date().toISOString().slice(0, 16));
    const [endDate, setEndDate] = useState(game?.endDate || "");
    const [winningSequence, setWinningSequence] = useState(game?.winningSequence?.join(",") || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: CreateGameDto | UpdateGameDto = {
            startDate: new Date(startDate).toISOString(),
            endDate: endDate ? new Date(endDate).toISOString() : null,
            winningSequence: winningSequence.split(",").map(Number),
        };
        onSubmit(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{game ? "Edit Game" : "Create Game"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Start Date</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input input-bordered w-full text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">End Date</label>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input input-bordered w-full text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Winning Sequence</label>
                        <input
                            type="text"
                            value={winningSequence}
                            onChange={(e) => setWinningSequence(e.target.value)}
                            className="input input-bordered w-full text-black"
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

export default EditGameModal;
