import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { madamis } from "../../schema";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

export const madamisApi = new Hono<{ Bindings: Env }>();

const madamisGet = madamisApi.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  const result = await db.select().from(madamis);
  return c.json(result);
});

export type MadamisGetType = typeof madamisGet;

const madamisPostSchema = z.object({
  title: z.string().min(1),
  link: z.string().url(),
  player: z.number().int().min(1).max(6),
  gmRequired: z.boolean().transform((b) => Number(b)),
});

const madamisPost = madamisApi.post(
  "/",
  zValidator("json", madamisPostSchema),
  async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    const [result] = await db.insert(madamis).values(body).returning();
    return c.json(result);
  }
);

export type MadamisPostType = typeof madamisPost;

const madamisPutSchema = madamisPostSchema.extend({
  id: z.number().int(),
});

const madamisPut = madamisApi.put(
  "/",
  zValidator("json", madamisPutSchema),
  async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    const [result] = await db
      .update(madamis)
      .set(body)
      .where(eq(madamis.id, body.id))
      .returning();
    return c.json(result);
  }
);

export type MadamisPutType = typeof madamisPut;

const madamisDelete = madamisApi.delete("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("id");

  await db.delete(madamis).where(eq(madamis.id, parseInt(id)));
  return new Response(null, { status: 204 });
});

export type MadamisDeleteType = typeof madamisDelete;
