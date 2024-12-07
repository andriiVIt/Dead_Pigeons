import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { playerIdAtom } from "/src/atoms/transactionAtoms.ts";
import { http } from "/src/http";

const PlayerBalance: React.FC = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const playerId = useAtom(playerIdAtom)[0];

    useEffect(() => {
        const fetchBalance = async () => {
            if (!playerId) return;
            try {
                const response = await http.playerDetail(playerId);
                // @ts-ignore
                setBalance(response.data.balance);
            } catch (err) {
                console.error("Failed to fetch player balance:", err);
            }
        };

        fetchBalance();
    }, [playerId]);

    return (
        <div
            className="absolute left-4 bg-green-500 text-white px-10 py-6 rounded shadow text-xl"
            style={{top: "112px"}} // Висота двох кнопок: 2 * 48px = 96px + 16px (відступ)
        >
            {balance !== null ? (
                <span>Balance: {balance} DKK</span>
            ) : (
                <span>Loading balance...</span>
            )}
        </div>
    );
};

export default PlayerBalance;
