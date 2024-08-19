import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { madamis } from "../../schema";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const madamisApi = new Hono<{ Bindings: Env }>();

const madamisGet = madamisApi.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  const result = await db.select().from(madamis);
  return c.json(result);
});

export type MadamisGetType = typeof madamisGet;

const madamisSchema = z.object({
  title: z.string().min(1),
  link: z.string().url(),
  player: z.number().int().min(1).max(6),
  gmRequired: z.boolean().transform((b) => Number(b)),
});

const madamisPost = madamisApi.post(
  "/",
  zValidator("json", madamisSchema),
  async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    await db.insert(madamis).values(body);
    return c.json(body);
  }
);

export type MadamisPostType = typeof madamisPost;
