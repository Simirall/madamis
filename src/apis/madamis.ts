import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";
import * as schema from "../../schema";
import { madamis } from "../../schema";

const madamisPostSchema = z.object({
  bought: z.boolean().transform((b) => Number(b)),
  gmRequired: z.number().nonnegative().max(2),
  link: z.string().url(),
  player: z.number().int().min(1).max(6),
  title: z.string().min(1),
});

export const madamisPutSchema = madamisPostSchema.extend({
  id: z.number().int(),
});

const madamisApi = new Hono<{ Bindings: Env }>();

export const madamisApp = madamisApi
  .get("/", async (c) => {
    const db = drizzle(c.env.DB, { schema });

    const query = await db.query.madamis.findMany({
      with: {
        games: {
          with: {
            gameUsers: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });

    return c.json(query);
  })
  .post("/", zValidator("json", madamisPostSchema), async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    await db.insert(madamis).values(body);
    return new Response(null, { status: 204 });
  })
  .put("/", zValidator("json", madamisPutSchema), async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    await db.update(madamis).set(body).where(eq(madamis.id, body.id));
    return new Response(null, { status: 204 });
  })
  .delete("/:id", async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param("id");

    await db.delete(madamis).where(eq(madamis.id, Number.parseInt(id)));
    return new Response(null, { status: 204 });
  });
