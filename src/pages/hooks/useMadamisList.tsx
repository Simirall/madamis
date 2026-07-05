import { hc } from "hono/client";
import useSWR from "swr";
import type { AppType } from "../../api";

const client = hc<AppType>;

export const useMadamisList = () => {
  const { data, mutate, isLoading } = useSWR("/api/madamis", (path) =>
    client("/api")
      .madamis.$get()
      .then((res) => res.json()),
  );

  return { data, isLoading, mutate };
};
