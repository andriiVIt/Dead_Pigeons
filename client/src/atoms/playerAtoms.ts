import { atom } from "jotai";
import { GetPlayerDto } from "../Api.ts";

// Список гравців
export const playerListAtom = atom<GetPlayerDto[]>([]);

// Вибраний гравець для редагування
export const selectedPlayerAtom = atom<GetPlayerDto | null>(null);

// Стан завантаження
export const isLoadingPlayersAtom = atom<boolean>(false);

// Стан помилок
export const playersErrorAtom = atom<string | null>(null);

