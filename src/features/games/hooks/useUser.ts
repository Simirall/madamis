import type { InferResponseType } from "hono";
import useSWR from "swr";
import { apiClient } from "../../../shared/apiClient";

export type UserListResponse = InferResponseType<typeof apiClient.user.$get>;
export type UserListItem = UserListResponse[number];

export const useUser = () => {
  const { data, error, mutate } = useSWR("/api/user", () =>
    apiClient.user.$get().then((res) => res.json()),
  );

  return { data, error, mutate };
};
