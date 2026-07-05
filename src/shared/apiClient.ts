import { hc } from "hono/client";
import type { AppType } from "../api";

export const apiClient = hc<AppType>("/api");
