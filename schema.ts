import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const madamis = sqliteTable("Madamis", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  link: text("link").notNull(),
  player: integer("player").notNull(),
  gmRequired: integer("gmRequired").notNull(),
});

export const madamisRelations = relations(madamis, ({ many }) => ({
  games: many(games),
}));

export const games = sqliteTable("Games", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),

  madamisId: integer("madamisId").references(() => madamis.id),
});

export const gamesRelations = relations(games, ({ many }) => ({
  gameUsers: many(gameUsers),
}));

export const users = sqliteTable("Users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  gameUsers: many(gameUsers),
}));

export const gameUsers = sqliteTable("GameUsers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  gm: integer("gm").notNull(),

  gameId: integer("gameId").references(() => games.id),
  userId: integer("userId").references(() => users.id),
});
