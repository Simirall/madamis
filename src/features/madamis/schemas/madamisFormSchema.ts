import { z } from "zod";

export const createMadamisFormSchema = (urls: ReadonlyArray<string>) =>
  z.object({
    bought: z.boolean(),
    gmRequired: z
      .number({ error: "GM種別を選択してください" })
      .nonnegative({ message: "GM種別を選択してください" })
      .max(2, { message: "GM種別を選択してください" }),
    link: z
      .string({ error: "リンクを入力してください" })
      .min(1, { message: "リンクを入力してください" })
      .url({ message: "URL形式で入力してください" })
      .refine((value) => !urls.includes(value), {
        message: "このリンクはすでに登録されています",
      }),
    player: z.coerce
      .number({ error: "PL人数を入力してください" })
      .int({ message: "PL人数は整数で入力してください" })
      .min(1, { message: "PL人数は1人以上で入力してください" })
      .max(6, { message: "PL人数は6人以下で入力してください" }),
    title: z
      .string({ error: "タイトルを入力してください" })
      .min(1, { message: "タイトルを入力してください" }),
  });

export type MadamisFormInput = z.input<
  ReturnType<typeof createMadamisFormSchema>
>;
export type MadamisFormValues = z.output<
  ReturnType<typeof createMadamisFormSchema>
>;
