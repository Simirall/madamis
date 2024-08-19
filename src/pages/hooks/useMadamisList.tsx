import useSWR from "swr";
import { hc } from "hono/client";
import { MadamisGetType } from "../../apis/madamis";

const client = hc<MadamisGetType>;

export const useMadamisList = () => {
  const { data, mutate } = useSWR("api/madamis/", (path) =>
    client(path)
      .index.$get()
      .then((res) => res.json())
  );

  return { data, mutate };
};
