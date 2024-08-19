import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { madamis } from "../../schema";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

const madamisPostSchema = z.object({
  title: z.string().min(1),
  link: z.string().url(),
  player: z.number().int().min(1).max(6),
  gmRequired: z.boolean().transform((b) => Number(b)),
});

const madamisPutSchema = madamisPostSchema.extend({
  id: z.number().int(),
});

const madamisApi = new Hono<{ Bindings: Env }>();

export const madamisApp = madamisApi
  .get("/", async (c) => {
    const db = drizzle(c.env.DB);

    const result = await db.select().from(madamis);
    return c.json(result);
  })
  .post("/", zValidator("json", madamisPostSchema), async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    const [result] = await db.insert(madamis).values(body).returning();
    return c.json(result);
  })
  .put("/", zValidator("json", madamisPutSchema), async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    const [result] = await db
      .update(madamis)
      .set(body)
      .where(eq(madamis.id, body.id))
      .returning();
    return c.json(result);
  })
  .delete("/:id", async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param("id");

    await db.delete(madamis).where(eq(madamis.id, parseInt(id)));
    return new Response(null, { status: 204 });
  });
