import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const madamis = sqliteTable("Madamis", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  link: text("link").notNull().unique(),
  player: integer("player").notNull(),
  gmRequired: integer("gmRequired").notNull(),
  bought: integer("bought").notNull(),
});

export const madamisRelations = relations(madamis, ({ many }) => ({
  games: many(games),
}));

export const games = sqliteTable("Games", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),

  madamisId: integer("madamisId")
    .references(() => madamis.id)
    .notNull(),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
  madamis: one(madamis, {
    fields: [games.madamisId],
    references: [madamis.id],
  }),
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

  gameId: integer("gameId")
    .references(() => games.id)
    .notNull(),
  userId: integer("userId")
    .references(() => users.id)
    .notNull(),
});

export const usersToGamesRelations = relations(gameUsers, ({ one }) => ({
  game: one(games, {
    fields: [gameUsers.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [gameUsers.userId],
    references: [users.id],
  }),
}));
