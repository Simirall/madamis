import { z } from "zod";

export const createGameFormSchema = (
  playerCount: number,
  userIds: ReadonlyArray<string>,
) =>
  z.object({
    date: z.date(),
    gm: z.string().refine((value) => userIds.includes(value)),
    players: z.array(z.string()).length(playerCount),
  });

export type GameFormValues = z.infer<ReturnType<typeof createGameFormSchema>>;
