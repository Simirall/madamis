import { Card, HStack, Tag, VStack, Wrap } from "@yamada-ui/react";
import type { InferResponseType } from "hono";
import { hc } from "hono/client";
import type { FC } from "react";
import type { AppType } from "../../../api";
import { gm } from "../../../constants/gmRequired";
import { DeleteGameButton } from "./DeleteGameModal";

const client = hc<AppType>("/api");

export const GameState: FC<{
  game: InferResponseType<typeof client.madamis.$get>[number]["games"][number];
  gmRequired: (typeof gm)[keyof typeof gm];
  player: number;
}> = ({ game, gmRequired, player }) => {
  const date = new Date(game.date).toLocaleDateString("ja-JP");

  return (
    <Card p="sm" shadow="md">
      <VStack gap="sm">
        <HStack gap="sm">
          <Tag colorScheme="blue" size="sm">
            プレイ日時: {date}
          </Tag>
          <DeleteGameButton gameId={game.id} />
        </HStack>
        <Wrap gap="sm" justify="center">
          {game.gameUsers.map((u) => {
            const isGm =
              gmRequired === gm.required
                ? true
                : gmRequired === gm.any
                  ? game.gameUsers.length === player + 1
                  : false;

            return (
              <Tag
                key={u.user.id}
                size="sm"
                colorScheme={u.gm ? "orange" : "purple"}
                variant={u.gm && isGm ? "solid" : "subtle"}
              >
                {u.user.name}
              </Tag>
            );
          })}
        </Wrap>
      </VStack>
    </Card>
  );
};
