import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { users } from "../schema";
import { madamisApi } from "./apis/madamis";

export const api = new Hono<{ Bindings: Env }>();

const userGet = api.get("/users/", async (c) => {
  const db = drizzle(c.env.DB);

  const result = await db.select().from(users).all();
  return c.json(result);
});

export type UserGetType = typeof userGet;

api.route("/madamis", madamisApi);
