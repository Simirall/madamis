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
  open: false,
  madamisId: undefined,
  createOpen: () => set(() => ({ open: true })),
  editOpen: (id) => set(() => ({ open: true, madamisId: id })),
  onClose: () => set(() => ({ open: false, madamisId: undefined })),
}));
