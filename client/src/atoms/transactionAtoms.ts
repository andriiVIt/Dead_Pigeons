import { atom } from "jotai";
import { http } from "../http";
import { GetTransactionDto } from "../Api";
import {jwtDecode} from "jwt-decode";
import {jwtAtom} from "/src/atoms/auth.ts";

// Атом для списку транзакцій
export const transactionsAtom = atom<GetTransactionDto[]>([]);

// Атом для стану завантаження
export const transactionsLoadingAtom = atom(false);

// Атом для фільтрації (опціонально)
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
// Функція для отримання транзакцій з API
export const fetchTransactions = async (setTransactions: (data: GetTransactionDto[]) => void, token: string) => {
    try {
        // Розкодування токена для отримання playerId
        const decodedToken: any = jwtDecode(token);
        const playerId = decodedToken.playerId;

        if (!playerId) {
            console.error("Player ID not found in the token.");
            return;
        }

        // Запит до бекенда з playerId
        const response = await http.transactionPlayerDetail(playerId, {
            limit: 50, // Можна змінити за потребою
            startAt: 0,
        });

        // @ts-ignore
        setTransactions(response.data); // Оновлення стану транзакцій
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]); // У разі помилки очищуємо стан
    }

    // Атом для Player ID (витягуємо з токена)



};
