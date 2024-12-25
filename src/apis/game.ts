import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";
import { gameUsers, games } from "../../schema";

const gamesPostSchema = z.object({
  madamisId: z.number().int(),
  date: z.string(),
  gm: z.number().int(),
  players: z.array(z.number().int()),
});

const gamesApi = new Hono<{ Bindings: Env }>();

export const gamesApp = gamesApi
  .post("/", zValidator("json", gamesPostSchema), async (c) => {
    const db = drizzle(c.env.DB);
    const body = c.req.valid("json");

    const [gameResult] = await db
      .insert(games)
      .values({
        date: body.date,
        madamisId: body.madamisId,
      })
      .returning();

    await db.insert(gameUsers).values([
      {
        userId: body.gm,
        gameId: gameResult.id,
        gm: 1,
      },
      ...body.players
        .filter((u) => u !== body.gm)
        .map((p) => ({
          userId: p,
          gameId: gameResult.id,
          gm: 0,
        })),
    ]);

    return new Response(null, { status: 204 });
  })
  .delete("/:id", async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param("id");

    await db.delete(gameUsers).where(eq(gameUsers.gameId, Number.parseInt(id)));
    await db.delete(games).where(eq(games.id, Number.parseInt(id)));
    return new Response(null, { status: 204 });
  });
