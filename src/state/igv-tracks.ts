import { atom, useAtom } from "jotai";

export const igvTracksSet = atom<Set<string>>(new Set<string>())