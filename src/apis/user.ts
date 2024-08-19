import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { users } from "../../schema";

const userApi = new Hono<{ Bindings: Env }>();

export const userApp = userApi.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  const result = await db.select().from(users).all();
  return c.json(result);
});
