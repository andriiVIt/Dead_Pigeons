import { atom } from "jotai";
import { http } from "../http";
import { GetBoardDto } from "../Api";
import {jwtDecode} from "jwt-decode";
import { jwtAtom } from "/src/atoms/auth.ts";

// Атом для списку бордів
export const boardsAtom = atom<GetBoardDto[]>([]);

// Атом для стану завантаження
export const boardsLoadingAtom = atom(false);

// Атом для отримання Player ID із токена
// export const playerIdAtom = atom((get) => {
//     const token = get(jwtAtom);
//     if (!token) {
//         console.error("Token not found.");
//         return null;
//     }
//
//     try {
//
//         const decodedToken: any = jwtDecode(token);
//         return decodedToken.playerId || null;
//     } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//     }
// });

// Функція для отримання бордів з API
export const fetchBoards = async (setBoards: (data: GetBoardDto[]) => void, token: string) => {
    try {
        // Розкодування токена для отримання playerId
        const decodedToken: any = jwtDecode(token);
        const playerId = decodedToken.playerId;

        console.log("Decoded Token:", decodedToken);
        console.log("Player ID from Token:", playerId);

        if (!playerId) {
            console.error("Player ID not found in the token.");
            return;
        }

        // Запит до API
        const response = await http.boardList({
            limit: 50, // Обмеження кількості бордів
            startAt: 0,
        });

        console.log("Fetched Boards:", response.data);

        // Фільтрація бордів
        const playerBoards = response.data.filter((board: GetBoardDto) => board.playerId === playerId);

        console.log("Filtered Boards:", playerBoards);

        setBoards(playerBoards);
    } catch (error) {
        console.error("Error fetching boards:", error);
        setBoards([]);
    }
};
