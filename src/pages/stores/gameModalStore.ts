import { create } from "zustand";

type GameModalState = {
  open: boolean;
  madamisId?: number;
  gameId?: number;
};

type GameModalAction = {
  createOpen: (madamisId: number) => void;
  editOpen: (madamisId: number, gameId: number) => void;
  close: () => void;
};

export const useGameModalStore = create<GameModalState & GameModalAction>(
  (set) => ({
    open: false,
    madamisId: undefined,
    gameId: undefined,
    createOpen: (madamisId) =>
      set(() => ({ open: true, madamisId: madamisId })),
    editOpen: (madamisId, gameId) =>
      set(() => ({ open: true, madamisId: madamisId, gameId: gameId })),
    close: () =>
      set(() => ({ open: false, madamisId: undefined, gameId: undefined })),
  })
);
