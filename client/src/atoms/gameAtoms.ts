import { atom } from "jotai";
import { GetGameDto } from "/src/Api";

// Атом для списку ігор
export const gamesAtom = atom<GetGameDto[]>([]);

// Атом для стану вибраного Game
export const selectedGameAtom = atom<GetGameDto | null>(null);

// Атом для стану завантаження
export const isLoadingGamesAtom = atom(false);

// Атом для помилки
export const gamesErrorAtom = atom<string | null>(null);