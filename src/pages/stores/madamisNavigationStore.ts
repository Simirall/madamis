import { create } from "zustand";

type MadamisNavigationStore = {
  onlyNotPlayed: boolean;
  onlyPlayable: boolean;
  players: string | undefined;
};

type MadamisNavigationAction = {
  setPlayed: (played: boolean) => void;
  setPlayable: (playable: boolean) => void;
  setPlayers: (n: string) => void;
};

export const useMadamisNavigationStore = create<
  MadamisNavigationStore & MadamisNavigationAction
>((set) => ({
  onlyNotPlayed: false,
  onlyPlayable: false,
  players: undefined,
  setPlayable: (playable: boolean) => set(() => ({ onlyPlayable: playable })),

  setPlayed: (played: boolean) => set(() => ({ onlyNotPlayed: played })),
  setPlayers: (n: string) => set(() => ({ players: n })),
}));
