import { Card, HStack, Tag, VStack, Wrap } from "@yamada-ui/react";
import type { FC } from "react";
import { gm } from "../../../constants/gmRequired";
import type { MadamisGame } from "../../madamis/hooks/useMadamisList";
import { DeleteGameButton } from "./DeleteGameButton";

export const GameState: FC<{
  game: MadamisGame;
  gmRequired: (typeof gm)[keyof typeof gm];
  player: number;
}> = ({ game, gmRequired, player }) => {
  const date = new Date(game.date).toLocaleDateString("ja-JP");

  return (
    <Card.Root p="sm" shadow="md">
      <VStack gap="sm">
        <HStack gap="sm">
          <Tag colorScheme="blue" size="sm">
            プレイ日時: {date}
          </Tag>
          <DeleteGameButton gameId={game.id} />
        </HStack>
        <Wrap gap="sm" justify="center">
          {game.gameUsers.map((gameUser) => {
            const isGm =
              gmRequired === gm.required
                ? true
                : gmRequired === gm.any
                  ? game.gameUsers.length === player + 1
                  : false;

            return (
              <Tag
                colorScheme={gameUser.gm ? "orange" : "purple"}
                key={gameUser.user.id}
                size="sm"
                variant={gameUser.gm && isGm ? "solid" : "subtle"}
              >
                {gameUser.user.name}
              </Tag>
            );
          })}
        </Wrap>
      </VStack>
    </Card.Root>
  );
};
