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
    open: false,
    madamisId: undefined,
    createOpen: (madamisId) =>
      set(() => ({ open: true, madamisId: madamisId })),
    onClose: () => set(() => ({ open: false, madamisId: undefined })),
  }),
);
