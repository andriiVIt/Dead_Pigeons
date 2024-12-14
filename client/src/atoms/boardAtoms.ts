import { atom } from "jotai";
import { http } from "../http";
import { GetBoardDto } from "../Api";
import {jwtDecode} from "jwt-decode";
import { jwtAtom } from "/src/atoms/auth.ts";

// Atom for the board list
export const boardsAtom = atom<GetBoardDto[]>([]);

// Atom for loading state
export const boardsLoadingAtom = atom(false);



// Function to get boards from API
export const fetchBoards = async (setBoards: (data: GetBoardDto[]) => void, token: string) => {
    try {
        // Decode token to get playerId
        const decodedToken: any = jwtDecode(token);
        const playerId = decodedToken.playerId;

        console.log("Decoded Token:", decodedToken);
        console.log("Player ID from Token:", playerId);

        if (!playerId) {
            console.error("Player ID not found in the token.");
            return;
        }

        // API request
        const response = await http.boardList({
            limit: 50, // Limiting the number of boards
            startAt: 0,
        });

        console.log("Fetched Boards:", response.data);

        // Edge filtering
        const playerBoards = response.data.filter((board: GetBoardDto) => board.playerId === playerId);

        console.log("Filtered Boards:", playerBoards);

        setBoards(playerBoards);
    } catch (error) {
        console.error("Error fetching boards:", error);
        setBoards([]);
    }
};
