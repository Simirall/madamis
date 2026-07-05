import { create } from "zustand";

type MadamisModalState = {
  madamisId?: number;
  open: boolean;
};

type MadamisModalAction = {
  createOpen: () => void;
  editOpen: (id: number) => void;
  onClose: () => void;
};

export const useMadamisModalStore = create<
  MadamisModalState & MadamisModalAction
>((set) => ({
  createOpen: () => set(() => ({ madamisId: undefined, open: true })),
  editOpen: (id) => set(() => ({ madamisId: id, open: true })),
  madamisId: undefined,
  onClose: () => set(() => ({ madamisId: undefined, open: false })),
  open: false,
}));
