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

  setPlayed: (played: boolean) => set(() => ({ onlyNotPlayed: played })),
  setPlayable: (playable: boolean) => set(() => ({ onlyPlayable: playable })),
  setPlayers: (n: string) => set(() => ({ players: n })),
}));
