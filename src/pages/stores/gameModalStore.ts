import { create } from "zustand";

type GameModalState = {
  open: boolean;
  madamisId?: number;
};

type GameModalAction = {
  createOpen: (madamisId: number) => void;
  onClose: () => void;
};

export const useGameModalStore = create<GameModalState & GameModalAction>(
  (set) => ({
    createOpen: (madamisId) =>
      set(() => ({ madamisId: madamisId, open: true })),
    madamisId: undefined,
    onClose: () => set(() => ({ madamisId: undefined, open: false })),
    open: false,
  }),
);
