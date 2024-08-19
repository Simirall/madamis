import { create } from "zustand";

type MadamisModalState = {
  open: boolean;
  madamisId?: number;
};

type MadamisModalAction = {
  createOpen: () => void;
  editOpen: (id: number) => void;
  close: () => void;
};

export const useMadamisModalStore = create<
  MadamisModalState & MadamisModalAction
>((set) => ({
  open: false,
  madamisId: undefined,
  createOpen: () => set(() => ({ open: true })),
  editOpen: (id) => set(() => ({ open: true, madamisId: id })),
  close: () => set(() => ({ open: false, madamisId: undefined })),
}));
