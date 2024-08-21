import useSWR from "swr";
import { hc } from "hono/client";
import { AppType } from "../../api";

const client = hc<AppType>;

export const useUser = () => {
  const { data, mutate } = useSWR("/api/user", (path) =>
    client("/api")
      .user.$get()
      .then((res) => res.json())
  );

  return { data, mutate };
};
