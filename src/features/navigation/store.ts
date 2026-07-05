import { create } from "zustand";
import { persist } from "zustand/middleware";

export const madamisPageSize = 24;

export type MadamisSortKey = "added" | "title";
export type MadamisSortOrder = "asc" | "desc";

export type MadamisNavigationDraft = {
  gmRequired: string | undefined;
  onlyBought: boolean;
  onlyNotPlayed: boolean;
  players: string | undefined;
  sortKey: MadamisSortKey;
  sortOrder: MadamisSortOrder;
};

type MadamisNavigationState = MadamisNavigationDraft & {
  revision: number;
};

type MadamisNavigationAction = {
  applyDraft: (draft: MadamisNavigationDraft) => void;
  getDraft: () => MadamisNavigationDraft;
  resetDraft: () => void;
};

export const defaultMadamisNavigationDraft: MadamisNavigationDraft = {
  gmRequired: undefined,
  onlyBought: false,
  onlyNotPlayed: false,
  players: undefined,
  sortKey: "added",
  sortOrder: "asc",
};

const hasDraftChanged = (
  current: MadamisNavigationDraft,
  next: MadamisNavigationDraft,
) =>
  current.gmRequired !== next.gmRequired ||
  current.onlyBought !== next.onlyBought ||
  current.onlyNotPlayed !== next.onlyNotPlayed ||
  current.players !== next.players ||
  current.sortKey !== next.sortKey ||
  current.sortOrder !== next.sortOrder;

const toDraft = (state: MadamisNavigationState): MadamisNavigationDraft => ({
  gmRequired: state.gmRequired,
  onlyBought: state.onlyBought,
  onlyNotPlayed: state.onlyNotPlayed,
  players: state.players,
  sortKey: state.sortKey,
  sortOrder: state.sortOrder,
});

export const useMadamisNavigationStore = create<
  MadamisNavigationState & MadamisNavigationAction
>()(
  persist(
    (set, get) => ({
      ...defaultMadamisNavigationDraft,
      applyDraft: (draft) =>
        set((state) => ({
          ...draft,
          revision: hasDraftChanged(toDraft(state), draft)
            ? state.revision + 1
            : state.revision,
        })),
      getDraft: () => toDraft(get()),
      resetDraft: () =>
        set((state) => ({
          ...defaultMadamisNavigationDraft,
          revision: hasDraftChanged(state, defaultMadamisNavigationDraft)
            ? state.revision + 1
            : state.revision,
        })),
      revision: 0,
    }),
    {
      name: "madamis-navigation",
      partialize: (state) => toDraft(state),
    },
  ),
);

export const useMadamisNavigationRevision = () =>
  useMadamisNavigationStore((state) => state.revision);
