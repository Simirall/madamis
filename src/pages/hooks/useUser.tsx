import { hc } from "hono/client";
import useSWR from "swr";
import type { AppType } from "../../api";

const client = hc<AppType>;

export const useUser = () => {
  const { data, mutate } = useSWR("/api/user", () =>
    client("/api")
      .user.$get()
      .then((res) => res.json()),
  );

  return { data, mutate };
};
