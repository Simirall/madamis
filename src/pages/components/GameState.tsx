import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { PencilSimple } from "@phosphor-icons/react";
import { useGameModalStore } from "../stores/gameModalStore";

export const GameState = ({
  madamisId,
  game,
}: {
  madamisId: number;
  game: {
    id: number;
    date: string;
    gameUsers: ReadonlyArray<{
      id: number;
      gm: boolean;
      name: string;
      color: string;
    }>;
  };
}) => {
  const { colorScheme } = useMantineColorScheme();
  const { editOpen } = useGameModalStore();

  const date = new Date(game.date).toLocaleDateString("ja-JP");

  return (
    <Paper p="xs" withBorder>
      <Stack gap="xs">
        <Group gap="xs">
          <Badge
            color={colorScheme === "dark" ? "gray" : "gray.1"}
            c={colorScheme === "dark" ? "white" : "dark"}
          >
            プレイ日時: {date}
          </Badge>
          <ActionIcon
            size="sm"
            variant="light"
            radius="xl"
            onClick={() => {
              editOpen(madamisId, game.id);
            }}
          >
            <PencilSimple />
          </ActionIcon>
        </Group>
        <Group gap="xs" justify="center">
          {game.gameUsers.map((u) => (
            <Badge
              key={u.id}
              color={
                u.gm ? "orange" : colorScheme === "dark" ? "gray" : "gray.1"
              }
              size="sm"
              c={u.gm ? "white" : u.color}
            >
              {u.name}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Paper>
  );
};
