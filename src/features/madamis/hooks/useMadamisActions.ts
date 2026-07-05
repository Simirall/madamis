import { useState } from "react";
import { apiClient } from "../../../shared/apiClient";
import type { MadamisListItem } from "./useMadamisList";
import { useRefreshMadamis } from "./useMadamisList";

export const useSaveMadamis = (madamisId: number | undefined) => {
  const refreshMadamis = useRefreshMadamis();

  return async (data: {
    bought: boolean;
    gmRequired: number;
    link: string;
    player: number;
    title: string;
  }) => {
    if (madamisId) {
      await apiClient.madamis.$put({
        json: { id: madamisId, ...data },
      });
    } else {
      await apiClient.madamis.$post({
        json: data,
      });
    }

    await refreshMadamis();
  };
};

export const useMarkMadamisAsBought = (madamis: MadamisListItem) => {
  const [loading, setLoading] = useState(false);
  const refreshMadamis = useRefreshMadamis();

  const markAsBought = async () => {
    setLoading(true);
    try {
      await apiClient.madamis.$put({
        json: {
          bought: true,
          gmRequired: madamis.gmRequired,
          id: madamis.id,
          link: madamis.link,
          player: madamis.player,
          title: madamis.title,
        },
      });
      await refreshMadamis();
    } finally {
      setLoading(false);
    }
  };

  return { loading, markAsBought };
};

export const useMarkMadamisAsNotBought = (
  madamis: MadamisListItem | undefined,
) => {
  const [loading, setLoading] = useState(false);
  const refreshMadamis = useRefreshMadamis();

  const markAsNotBought = async () => {
    if (!madamis) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.madamis.$put({
        json: {
          bought: false,
          gmRequired: madamis.gmRequired,
          id: madamis.id,
          link: madamis.link,
          player: madamis.player,
          title: madamis.title,
        },
      });
      await refreshMadamis();
    } finally {
      setLoading(false);
    }
  };

  return { loading, markAsNotBought };
};

export const useDeleteMadamis = (madamisId: number) => {
  const [loading, setLoading] = useState(false);
  const refreshMadamis = useRefreshMadamis();

  const deleteMadamis = async () => {
    setLoading(true);
    try {
      await apiClient.madamis[":id"].$delete({
        param: { id: madamisId.toString() },
      });
      await refreshMadamis();
    } finally {
      setLoading(false);
    }
  };

  return { deleteMadamis, loading };
};
