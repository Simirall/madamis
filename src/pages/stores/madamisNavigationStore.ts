import { create } from "zustand";
import { persist } from "zustand/middleware";

export const madamisPageSize = 24;
export const madamisNavigationChangedEvent = "madamis-navigation-changed";

export type MadamisSortKey = "added" | "title";
export type MadamisSortOrder = "asc" | "desc";

type MadamisNavigationStore = {
  gmRequired: string | undefined;
  onlyBought: boolean;
  onlyNotPlayed: boolean;
  players: string | undefined;
  sortKey: MadamisSortKey;
  sortOrder: MadamisSortOrder;
};

type MadamisNavigationAction = {
  setGmRequired: (gmRequired: string | undefined) => void;
  setOnlyBought: (onlyBought: boolean) => void;
  setPlayed: (played: boolean) => void;
  setPlayers: (n: string | undefined) => void;
  setSortKey: (sortKey: MadamisSortKey) => void;
  setSortOrder: (sortOrder: MadamisSortOrder) => void;
};

export const useMadamisNavigationStore = create<
  MadamisNavigationStore & MadamisNavigationAction
>()(
  persist(
    (set) => ({
      gmRequired: undefined,
      onlyBought: false,
      onlyNotPlayed: false,
      players: undefined,
      setGmRequired: (gmRequired: string | undefined) =>
        set(() => ({ gmRequired })),
      setOnlyBought: (onlyBought: boolean) => set(() => ({ onlyBought })),

      setPlayed: (played: boolean) => set(() => ({ onlyNotPlayed: played })),
      setPlayers: (n: string | undefined) => set(() => ({ players: n })),
      setSortKey: (sortKey: MadamisSortKey) => set(() => ({ sortKey })),
      setSortOrder: (sortOrder: MadamisSortOrder) => set(() => ({ sortOrder })),
      sortKey: "added",
      sortOrder: "asc",
    }),
    {
      name: "madamis-navigation",
    },
  ),
);
