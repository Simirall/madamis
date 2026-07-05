import type { InferResponseType } from "hono";
import useSWR, { useSWRConfig } from "swr";
import { apiClient } from "../../../shared/apiClient";
import {
  madamisPageSize,
  useMadamisNavigationStore,
} from "../../navigation/store";
import { getCurrentMadamisPage } from "./useMadamisPageParam";

export type MadamisListResponse = InferResponseType<
  typeof apiClient.madamis.$get,
  200
>;
export type MadamisListItem = MadamisListResponse["items"][number];
export type MadamisGame = MadamisListItem["games"][number];

type MadamisListQuery = NonNullable<
  Parameters<typeof apiClient.madamis.$get>[0]
>["query"];

const booleanQuery = (value: boolean): "true" | "false" =>
  value ? "true" : "false";

const isMadamisCacheKey = (key: unknown) =>
  key === "/api/madamis/unfiltered" ||
  (Array.isArray(key) && key[0] === "/api/madamis");

export const useRefreshMadamis = () => {
  const { mutate } = useSWRConfig();

  return () => mutate(isMadamisCacheKey);
};

export const useMadamisList = (page = getCurrentMadamisPage()) => {
  const { gmRequired, onlyBought, onlyNotPlayed, players, sortKey, sortOrder } =
    useMadamisNavigationStore();

  const query: MadamisListQuery = {
    ...(gmRequired ? { gmRequired } : {}),
    onlyBought: booleanQuery(onlyBought),
    onlyNotPlayed: booleanQuery(onlyNotPlayed),
    page: String(page),
    pageSize: String(madamisPageSize),
    ...(players ? { players } : {}),
    sortKey,
    sortOrder,
  };

  const { data, error, isLoading, mutate } = useSWR<MadamisListResponse>(
    ["/api/madamis", query],
    async ([, currentQuery]) => {
      const res = await apiClient.madamis.$get({
        query: currentQuery as MadamisListQuery,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch madamis list");
      }

      return (await res.json()) as MadamisListResponse;
    },
  );

  return { data, error, isLoading, mutate };
};

export const useMadamisListItem = (madamisId: number | undefined) => {
  const { data, error, isLoading, mutate } = useMadamisList();

  return {
    data: madamisId ? data?.items.find((m) => m.id === madamisId) : undefined,
    error,
    isLoading,
    mutate,
  };
};

export const useUnfilteredMadamisList = () => {
  const { data, error, isLoading, mutate } = useSWR<MadamisListResponse>(
    "/api/madamis/unfiltered",
    async () => {
      const res = await apiClient.madamis.$get({
        query: {
          page: "1",
          pageSize: "100",
          sortKey: "added",
          sortOrder: "asc",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch madamis list");
      }

      return (await res.json()) as MadamisListResponse;
    },
  );

  return { data: data?.items, error, isLoading, mutate };
};
