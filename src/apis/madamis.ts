import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";
import * as schema from "../../schema";
import { madamis, users } from "../../schema";

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

const booleanQuerySchema = z
  .enum(["true", "false"])
  .optional()
  .transform((v) => v === "true");

const madamisGetSchema = z.object({
  gmRequired: z.coerce.number().int().min(0).max(2).optional(),
  onlyAddable: booleanQuerySchema,
  onlyBought: booleanQuerySchema,
  onlyNotPlayed: booleanQuerySchema,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  players: z.coerce.number().int().min(2).max(7).optional(),
  sortKey: z.enum(["added", "title"]).default("added"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const madamisApi = new Hono<{ Bindings: Env }>();

export const madamisApp = madamisApi
  .get("/", zValidator("query", madamisGetSchema), async (c) => {
    const db = drizzle(c.env.DB, { schema });
    const params = c.req.valid("query");

    const madamisList = await db.query.madamis.findMany({
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
    const userList = await db.select().from(users).all();

    const filteredMadamisList = madamisList
      .filter((d) => (params.onlyNotPlayed ? d.games.length === 0 : true))
      .filter((d) => (params.onlyBought ? Boolean(d.bought) : true))
      .filter((d) => {
        if (!params.onlyAddable) {
          return true;
        }

        const playedUsers = new Set(
          d.games.flatMap((g) => g.gameUsers.map((u) => u.user.id)),
        );

        return userList.length - playedUsers.size >= d.player;
      })
      .filter((d) =>
        params.gmRequired === undefined
          ? true
          : d.gmRequired === params.gmRequired,
      )
      .filter((d) => {
        if (params.players === undefined) {
          return true;
        }

        return d.gmRequired === 1
          ? d.player + 1 === params.players
          : d.player === params.players;
      });

    const sortedMadamisList = [...filteredMadamisList].sort((a, b) => {
      const sortResult =
        params.sortKey === "title"
          ? a.title.localeCompare(b.title, "ja")
          : a.id - b.id;

      return params.sortOrder === "asc" ? sortResult : -sortResult;
    });

    const total = sortedMadamisList.length;
    const totalPages = Math.max(1, Math.ceil(total / params.pageSize));
    const page = Math.min(params.page, totalPages);
    const start = (page - 1) * params.pageSize;

    return c.json({
      items: sortedMadamisList.slice(start, start + params.pageSize),
      page,
      pageSize: params.pageSize,
      total,
      totalPages,
    });
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

    await db.delete(madamis).where(eq(madamis.id, Number.parseInt(id, 10)));
    return new Response(null, { status: 204 });
  });
