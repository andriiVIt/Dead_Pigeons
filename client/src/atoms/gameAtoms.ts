import { atom } from "jotai";
import { GetGameDto } from "/src/Api";

// An atom for the list of games
export const gamesAtom = atom<GetGameDto[]>([]);

// Atom for selected state Game
export const selectedGameAtom = atom<GetGameDto | null>(null);

// Atom for loading state
export const isLoadingGamesAtom = atom(false);

// Atom for error
export const gamesErrorAtom = atom<string | null>(null);