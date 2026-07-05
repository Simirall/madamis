import { Hono } from "hono";
import { gamesApp } from "./apis/game";
import { madamisApp } from "./apis/madamis";
import { userApp } from "./apis/user";

export const api = new Hono<{ Bindings: Env }>();

const app = api
  .route("/user", userApp)
  .route("/madamis", madamisApp)
  .route("/games", gamesApp);

export type AppType = typeof app;
