import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { games, gameUsers, madamis, users } from "../../schema";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

const madamisPostSchema = z.object({
  title: z.string().min(1),
  link: z.string().url(),
  player: z.number().int().min(1).max(6),
  gmRequired: z.boolean().transform((b) => Number(b)),
  bought: z.boolean().transform((b) => Number(b)),
});

const madamisPutSchema = madamisPostSchema.extend({
  id: z.number().int(),
});

const madamisApi = new Hono<{ Bindings: Env }>();

export const madamisApp = madamisApi
  .get("/", async (c) => {
    const db = drizzle(c.env.DB);

    // TODO: SQLを勉強すべき
    const madamisList = await db.select().from(madamis);
    const gameList = await db.select().from(games);
    const gameUserList = await Promise.all(
      gameList.map((g) =>
        db
          .select()
          .from(gameUsers)
          .where(eq(gameUsers.gameId, g.id))
          .leftJoin(users, eq(gameUsers.userId, users.id))
      )
    );

    const result = madamisList.map((m) => {
      return {
        ...m,
        games: gameList
          .filter((g) => g.madamisId === m.id)
          .map((g) => ({
            ...g,
            gameUsers: gameUserList
              .filter((gu) => gu[0].GameUsers.gameId === g.id)
              .flatMap((gu) =>
                gu.map((u) => ({
                  ...u.Users!,
                  gm: Boolean(u.GameUsers.gm),
                }))
              ),
          })),
      };
    });

    return c.json(result);
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

    await db.delete(madamis).where(eq(madamis.id, parseInt(id)));
    return new Response(null, { status: 204 });
  });
