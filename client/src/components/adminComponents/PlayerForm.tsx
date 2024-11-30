import React, { useState } from "react";
import { UpdatePlayerDto, RegisterRequest } from "Api.ts";

type PlayerFormProps = {
    player?: UpdatePlayerDto | null;
    onSubmit: (data: UpdatePlayerDto | RegisterRequest) => void;
    onCancel: () => void;
};

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSubmit, onCancel }) => {
    const [name, setName] = useState(player?.name || "");
    const [email, setEmail] = useState(player ? "" : "");
    const [balance, setBalance] = useState(player?.balance || 0);
    const [isActive, setIsActive] = useState(player?.isActive || true);

    const handleSubmit = () => {
        const data = player
            ? { name, balance, isActive }
            : { name, email, password: "TemporaryPassword123!" };
        onSubmit(data as UpdatePlayerDto | RegisterRequest);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered mb-2 w-full"
            />
            {!player && (
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered mb-2 w-full"
                />
            )}
            {player && (
                <input
                    type="number"
                    placeholder="Balance"
                    value={balance}
                    onChange={(e) => setBalance(parseFloat(e.target.value))}
                    className="input input-bordered mb-2 w-full"
                />
            )}
            {player && (
                <label className="label cursor-pointer">
                    <span className="label-text">Active</span>
                    {/*<input*/}
                    {/*    type="checkbox"*/}
                    {/*    checked={isActive}*/}
                    {/*    onChange={(e) => setIsActive(e.target.checked)}*/}
                    {/*    className="checkbox"*/}
                    {/*/>*/}
                </label>
            )}
            <div className="flex justify-between">
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Save
                </button>
                <button className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PlayerForm;
