import type { ColorScheme, Select } from "@yamada-ui/react";
import type {
  MadamisNavigationDraft,
  MadamisSortKey,
  MadamisSortOrder,
} from "./store";

export const playerItems: Select.Item[] = [
  { label: "2人", value: "2" },
  { label: "3人", value: "3" },
  { label: "4人", value: "4" },
  { label: "5人", value: "5" },
  { label: "6人", value: "6" },
  { label: "7人", value: "7" },
];

export const gmRequiredItems: Select.Item[] = [
  { label: "GM任意", value: "0" },
  { label: "GM必須", value: "1" },
  { label: "GMなし", value: "2" },
];

export const sortKeyItems: Select.Item[] = [
  { label: "追加順", value: "added" },
  { label: "名前順", value: "title" },
];

export const sortOrderItems: Select.Item[] = [
  { label: "昇順", value: "asc" },
  { label: "降順", value: "desc" },
];

export type MadamisNavigationActiveItem = {
  colorScheme: ColorScheme;
  key: "gmRequired" | "onlyBought" | "onlyNotPlayed" | "players";
  label: string;
};

const getSelectLabel = (
  items: ReadonlyArray<Select.Item>,
  value: string | undefined,
) => {
  const item = items.find((candidate) =>
    "value" in candidate ? candidate.value === value : false,
  );

  return item && "label" in item ? String(item.label) : undefined;
};

export const getMadamisNavigationActiveItems = (
  draft: MadamisNavigationDraft,
): MadamisNavigationActiveItem[] => {
  const items: MadamisNavigationActiveItem[] = [];

  if (draft.onlyNotPlayed) {
    items.push({
      colorScheme: "teal",
      key: "onlyNotPlayed",
      label: "未プレイのみ",
    });
  }

  if (draft.onlyBought) {
    items.push({
      colorScheme: "cyan",
      key: "onlyBought",
      label: "購入済みのみ",
    });
  }

  const playerLabel = getSelectLabel(playerItems, draft.players);

  if (playerLabel) {
    items.push({
      colorScheme: "violet",
      key: "players",
      label: `PL: ${playerLabel}`,
    });
  }

  const gmRequiredLabel = getSelectLabel(gmRequiredItems, draft.gmRequired);

  if (gmRequiredLabel) {
    items.push({
      colorScheme: "orange",
      key: "gmRequired",
      label: gmRequiredLabel,
    });
  }

  return items;
};

export const getMadamisNavigationActiveCount = (
  draft: MadamisNavigationDraft,
) => getMadamisNavigationActiveItems(draft).length;

export const getSortSummary = (
  sortKey: MadamisSortKey,
  sortOrder: MadamisSortOrder,
) => {
  const sortKeyLabel = getSelectLabel(sortKeyItems, sortKey) ?? "追加順";
  const sortOrderLabel = getSelectLabel(sortOrderItems, sortOrder) ?? "昇順";

  return `${sortKeyLabel} / ${sortOrderLabel}`;
};
