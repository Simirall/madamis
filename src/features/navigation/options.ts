import type { Select } from "@yamada-ui/react";

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
