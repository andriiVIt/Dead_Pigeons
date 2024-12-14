import { atom } from "jotai";
import { http } from "../http";
import { GetTransactionDto } from "../Api";
import {jwtDecode} from "jwt-decode";
import {jwtAtom} from "/src/atoms/auth.ts";

// Atom for transaction list
export const transactionsAtom = atom<GetTransactionDto[]>([]);

// Atom for loading state
export const transactionsLoadingAtom = atom(false);

// Atom for filtering (optional)
export const transactionFilterAtom = atom("");


export const playerIdAtom = atom((get) => {
    const token = get(jwtAtom);
    if (!token) {
        console.error("Token not found.");
        return null;
    }

    try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.playerId || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
});
// Function to get transactions from the API
export const fetchTransactions = async (setTransactions: (data: GetTransactionDto[]) => void, token: string) => {
    try {
        // Decode token to get playerId
        const decodedToken: any = jwtDecode(token);
        const playerId = decodedToken.playerId;

        if (!playerId) {
            console.error("Player ID not found in the token.");
            return;
        }

        // Request backend with playerId
        const response = await http.transactionPlayerDetail(playerId, {
            limit: 50, // Можна змінити за потребою
            startAt: 0,
        });

        // @ts-ignore
        setTransactions(response.data); // Update transaction status
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]); // In case of an error, we clear the state
    }

     



};
