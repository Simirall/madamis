import useSWR from "swr";
import { hc } from "hono/client";
import { AppType } from "../../api";

const client = hc<AppType>;

export const useMadamisList = () => {
  const { data, mutate } = useSWR("/api/madamis", (path) =>
    client("/api")
      .madamis.$get()
      .then((res) => res.json())
  );

  return { data, mutate };
};
