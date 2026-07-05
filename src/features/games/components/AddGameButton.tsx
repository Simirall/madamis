import { Button, Text } from "@yamada-ui/react";
import { Loader } from "../../../shared/components/Loader";
import { useMarkMadamisAsBought } from "../../madamis/hooks/useMadamisActions";
import type { MadamisListItem } from "../../madamis/hooks/useMadamisList";
import { useUser } from "../hooks/useUser";
import { useGameModalStore } from "../stores/gameModalStore";

export const AddGameButton = ({ madamis }: { madamis: MadamisListItem }) => {
  const { data: users, error } = useUser();
  const { createOpen } = useGameModalStore();
  const { loading, markAsBought } = useMarkMadamisAsBought(madamis);

  const playedPlayers = Array.from(
    new Set(
      madamis.games.flatMap((game) => game.gameUsers.map((u) => u.user.id)),
    ),
  ).length;

  if (error) {
    return (
      <Text color="red" fontSize="sm">
        ユーザー取得失敗
      </Text>
    );
  }

  if (!users) {
    return <Loader />;
  }

  const canAddGame = users.length - playedPlayers >= madamis.player;

  if (!madamis.bought) {
    return (
      <Button
        colorScheme="lime"
        loading={loading}
        onClick={markAsBought}
        variant="surface"
      >
        購入済みにする
      </Button>
    );
  }

  if (canAddGame) {
    return (
      <Button
        colorScheme="lime"
        onClick={() => {
          createOpen(madamis.id);
        }}
        variant="surface"
      >
        試合を追加
      </Button>
    );
  }

  return <Button disabled>プレイ済</Button>;
};
