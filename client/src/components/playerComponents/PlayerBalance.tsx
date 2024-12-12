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
            className="relative bg-green-500 text-white px-6 py-4 rounded shadow text-lg md:text-xl mx-auto max-w-xs sm:max-w-sm lg:max-w-md"
            style={{
                marginTop: "1rem", // Відступ від тексту "Select a Game"
            }}
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
