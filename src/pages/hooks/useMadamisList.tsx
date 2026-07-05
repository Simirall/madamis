import type { InferResponseType } from "hono";
import { hc } from "hono/client";
import useSWR from "swr";
import type { AppType } from "../../api";
import {
  madamisPageSize,
  useMadamisNavigationStore,
} from "../stores/madamisNavigationStore";

const client = hc<AppType>("/api");

export type MadamisListResponse = InferResponseType<
  typeof client.madamis.$get,
  200
>;
export type MadamisListItem = MadamisListResponse["items"][number];
export type MadamisGame = MadamisListItem["games"][number];

type MadamisListQuery = NonNullable<
  Parameters<typeof client.madamis.$get>[0]
>["query"];

const booleanQuery = (value: boolean): "true" | "false" =>
  value ? "true" : "false";

const getCurrentMadamisPage = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  const page = Number.parseInt(
    new URLSearchParams(window.location.search).get("page") ?? "1",
    10,
  );

  return Number.isNaN(page) || page < 1 ? 1 : page;
};

export const useMadamisList = (page = getCurrentMadamisPage()) => {
  const {
    gmRequired,
    onlyAddable,
    onlyBought,
    onlyNotPlayed,
    players,
    sortKey,
    sortOrder,
  } = useMadamisNavigationStore();

  const query: MadamisListQuery = {
    ...(gmRequired && gmRequired !== "all" ? { gmRequired } : {}),
    onlyAddable: booleanQuery(onlyAddable),
    onlyBought: booleanQuery(onlyBought),
    onlyNotPlayed: booleanQuery(onlyNotPlayed),
    page: String(page),
    pageSize: String(madamisPageSize),
    ...(players ? { players } : {}),
    sortKey,
    sortOrder,
  };

  const { data, mutate, isLoading } = useSWR<MadamisListResponse>(
    ["/api/madamis", query],
    async ([, currentQuery]) => {
      const res = await client.madamis.$get({
        query: currentQuery as MadamisListQuery,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch madamis list");
      }

      return (await res.json()) as MadamisListResponse;
    },
  );

  return { data, isLoading, mutate };
};

export const useCurrentMadamisItems = () => {
  const { data, isLoading, mutate } = useMadamisList();

  return { data: data?.items, isLoading, mutate };
};

export const useMadamisListItem = (madamisId: number | undefined) => {
  const { data, isLoading, mutate } = useMadamisList();

  return {
    data: madamisId ? data?.items.find((m) => m.id === madamisId) : undefined,
    isLoading,
    mutate,
  };
};

export const useUnfilteredMadamisList = () => {
  const { data, mutate, isLoading } = useSWR<MadamisListResponse>(
    "/api/madamis/unfiltered",
    async () => {
      const res = await client.madamis.$get({
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

  return { data: data?.items, isLoading, mutate };
};
