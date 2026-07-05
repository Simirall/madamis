import { useState } from "react";
import { apiClient } from "../../../shared/apiClient";
import { useRefreshMadamis } from "../../madamis/hooks/useMadamisList";
import type { GameFormValues } from "../schemas/gameFormSchema";

export const useAddGame = (madamisId: number) => {
  const refreshMadamis = useRefreshMadamis();

  return async (data: GameFormValues) => {
    await apiClient.games.$post({
      json: {
        date: data.date.toISOString(),
        gm: Number.parseInt(data.gm, 10),
        madamisId,
        players: data.players.map((player) => Number.parseInt(player, 10)),
      },
    });
    await refreshMadamis();
  };
};

export const useDeleteGame = (gameId: number) => {
  const [loading, setLoading] = useState(false);
  const refreshMadamis = useRefreshMadamis();

  const deleteGame = async () => {
    setLoading(true);
    try {
      await apiClient.games[":id"].$delete({
        param: { id: gameId.toString() },
      });
      await refreshMadamis();
    } finally {
      setLoading(false);
    }
  };

  return { deleteGame, loading };
};
