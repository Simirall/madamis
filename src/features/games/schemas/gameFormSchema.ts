import { z } from "zod";

export const createGameFormSchema = (
  playerCount: number,
  userIds: ReadonlyArray<string>,
) =>
  z.object({
    date: z.date({ error: "開催日を選択してください" }),
    gm: z
      .string({ error: "GM/進行役を選択してください" })
      .refine((value) => userIds.includes(value), {
        message: "GM/進行役を選択してください",
      }),
    players: z
      .array(z.string(), { error: "プレイヤーを選択してください" })
      .length(playerCount, {
        message: `プレイヤーを${playerCount}人選択してください`,
      }),
  });

export type GameFormValues = z.infer<ReturnType<typeof createGameFormSchema>>;
