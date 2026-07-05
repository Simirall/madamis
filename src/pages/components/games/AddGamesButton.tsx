import { Button } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import type { AppType } from "../../../api";
import { gm } from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useUser } from "../../hooks/useUser";
import { useGameModalStore } from "../../stores/gameModalStore";
import { Loader } from "../Loader";

const client = hc<AppType>("/api");

export const AddGameButton = ({ madamisId }: { madamisId: number }) => {
  const { data: madamisList, mutate } = useMadamisList();
  const { data: users } = useUser();
  const { createOpen } = useGameModalStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const madamis = madamisList?.find((m) => m.id === madamisId);
  const playedPlayers = Array.from(
    new Set(madamis?.games.flatMap((g) => g.gameUsers.map((u) => u.user.id))),
  ).length;

  if (!madamis || !users) {
    return <Loader />;
  }

  const canAddGame =
    users.length -
      (playedPlayers + (madamis.gmRequired === gm.required ? 0 : 1)) >
    madamis.player;

  const handleBuy = async () => {
    setIsUpdating(true);
    await client.madamis.$put({
      json: {
        bought: true,
        gmRequired: madamis.gmRequired,
        id: madamis.id,
        link: madamis.link,
        player: madamis.player,
        title: madamis.title,
      },
    });
    await mutate();
    setIsUpdating(false);
  };

  return (
    <>
      {!madamis.bought ? (
        <Button
          colorScheme="lime"
          loading={isUpdating}
          onClick={handleBuy}
          variant="surface"
        >
          購入済みにする
        </Button>
      ) : canAddGame ? (
        <Button
          colorScheme="lime"
          onClick={() => {
            createOpen(madamisId);
          }}
          variant="surface"
        >
          試合を追加
        </Button>
      ) : (
        <Button disabled>プレイ済</Button>
      )}
    </>
  );
};
