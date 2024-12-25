import type { ThemeColorScheme } from "@yamada-ui/react";

export const gm = {
  any: 0,
  required: 1,
  none: 2,
} as const;
export const gmRequired = ["GM: 任意", "GM: 必須", "GM: なし"] as const;
export const gmRole = ["GM/進行役", "GM", "進行役"] as const;
export const gmRequiredBadgeColor = [
  "cyan",
  "orange",
  "green",
] as const satisfies ReadonlyArray<ThemeColorScheme>;
