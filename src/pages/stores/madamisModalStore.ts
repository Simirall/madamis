import { create } from "zustand";

type MadamisModalState = {
  open: boolean;
  madamisId?: number;
};

type MadamisModalAction = {
  createOpen: () => void;
  editOpen: (id: number) => void;
  onClose: () => void;
};

export const useMadamisModalStore = create<
  MadamisModalState & MadamisModalAction
>((set) => ({
  createOpen: () => set(() => ({ open: true })),
  editOpen: (id) => set(() => ({ madamisId: id, open: true })),
  madamisId: undefined,
  onClose: () => set(() => ({ madamisId: undefined, open: false })),
  open: false,
}));
