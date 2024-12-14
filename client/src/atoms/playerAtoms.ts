import { atom } from "jotai";
import { GetPlayerDto } from "../Api.ts";

// List of players
export const playerListAtom = atom<GetPlayerDto[]>([]);

// Selected player to edit
export const selectedPlayerAtom = atom<GetPlayerDto | null>(null);

// Loading state
export const isLoadingPlayersAtom = atom<boolean>(false);

// Error status
export const playersErrorAtom = atom<string | null>(null);

