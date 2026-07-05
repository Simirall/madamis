import { Button, Tag, Text, VStack } from "@yamada-ui/react";
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

  return (
    <VStack align="stretch" gap="xs" w="full">
      <Tag
        colorScheme="gray"
        justifyContent="center"
        size="md"
        variant="surface"
        w="full"
      >
        プレイ済
      </Tag>
      <Text color="gray" fontSize="xs" textAlign="center">
        追加できるプレイヤーが足りません
      </Text>
    </VStack>
  );
};
