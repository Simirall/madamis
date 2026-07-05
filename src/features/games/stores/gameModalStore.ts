import { create } from "zustand";

type GameModalState = {
  madamisId?: number;
  open: boolean;
};

type GameModalAction = {
  createOpen: (madamisId: number) => void;
  onClose: () => void;
};

export const useGameModalStore = create<GameModalState & GameModalAction>(
  (set) => ({
    createOpen: (madamisId) => set(() => ({ madamisId, open: true })),
    madamisId: undefined,
    onClose: () => set(() => ({ madamisId: undefined, open: false })),
    open: false,
  }),
);
