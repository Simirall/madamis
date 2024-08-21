import { Hono } from "hono";
import { userApp } from "./apis/user";
import { madamisApp } from "./apis/madamis";
import { gamesApp } from "./apis/game";

export const api = new Hono<{ Bindings: Env }>();

const app = api
  .route("/user", userApp)
  .route("/madamis", madamisApp)
  .route("/games", gamesApp);

export type AppType = typeof app;
