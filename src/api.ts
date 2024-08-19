import { Hono } from "hono";
import { userApp } from "./apis/user";
import { madamisApp } from "./apis/madamis";

export const api = new Hono<{ Bindings: Env }>();

const app = api.route("/user", userApp).route("/madamis", madamisApp);

export type AppType = typeof app;
