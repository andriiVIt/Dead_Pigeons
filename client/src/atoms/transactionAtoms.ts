import { atom } from "jotai";
import { http } from "../http";
import { GetTransactionDto } from "../Api";

// Атом для списку транзакцій
export const transactionsAtom = atom<GetTransactionDto[]>([]);

// Атом для стану завантаження
export const transactionsLoadingAtom = atom(false);

// Атом для фільтрації (опціонально)
export const transactionFilterAtom = atom("");

// Функція для отримання транзакцій з API
export const fetchTransactions = async (setTransactions: (data: GetTransactionDto[]) => void) => {
    try {
        const response = await http.transactionList({
            limit: 50, // Ви можете змінити обмеження кількості транзакцій
            startAt: 0,
        });
        setTransactions(response.data); // Оновлюємо стан транзакцій
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
    }
};
