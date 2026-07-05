import { z } from "zod";

export const createMadamisFormSchema = (urls: ReadonlyArray<string>) =>
  z.object({
    bought: z.boolean(),
    gmRequired: z.number().nonnegative().max(2),
    link: z
      .string()
      .url()
      .refine((value) => !urls.includes(value), {
        message: "Already exists",
      }),
    player: z.coerce.number().int().min(1).max(6),
    title: z.string().min(1),
  });

export type MadamisFormInput = z.input<
  ReturnType<typeof createMadamisFormSchema>
>;
export type MadamisFormValues = z.output<
  ReturnType<typeof createMadamisFormSchema>
>;
