import {
  ActionIcon,
  Badge,
  Card,
  Chip,
  Group,
  NavLink,
  Select,
  Stack,
} from "@mantine/core";
import { Link, PencilSimple } from "@phosphor-icons/react";
import { useMadamisList } from "../hooks/useMadamisList";
import { useMadamisModalStore } from "../stores/madamisModalStore";
import { AddGameButton } from "./AddGamesButton";
import { GameState } from "./GameState";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";

export const MadamisList = () => {
  const { data } = useMadamisList();
  const { editOpen } = useMadamisModalStore();

  const [onlyNotPlayed, updatePlayed] = useState(false);
  const [players, setPlayers] = useState<string | null>(null);

  return (
    <Stack p="sm" align="center">
      <Group justify="center">
        <Chip
          size="xl"
          checked={onlyNotPlayed}
          onChange={(e) => {
            updatePlayed(e);
          }}
        >
          未プレイのみ
        </Chip>
        <Select
          placeholder="遊ぶ人数"
          size="md"
          radius="xl"
          variant="filled"
          data={[
            {
              value: "2",
              label: "2人",
            },
            {
              value: "3",
              label: "3人",
            },
            {
              value: "4",
              label: "4人",
            },
            {
              value: "5",
              label: "5人",
            },
            {
              value: "6",
              label: "6人",
            },
            {
              value: "7",
              label: "7人",
            },
          ]}
          value={players}
          onChange={setPlayers}
        />
      </Group>
      <Group justify="center">
        {data &&
          data
            .filter((d) => (onlyNotPlayed ? d.games.length === 0 : true))
            .filter((d) =>
              !players
                ? true
                : d.player + 1 === parseInt(players) ||
                  (!d.gmRequired && d.player === parseInt(players))
            )
            .map((d) => (
              <Card
                key={d.id}
                w="20rem"
                shadow="sm"
                p="md"
                radius="md"
                withBorder
              >
                <Stack>
                  <NavLink
                    href={d.link}
                    target="_blank"
                    label={d.title}
                    variant="subtle"
                    active
                    leftSection={<Link fontSize="1.4rem" />}
                    style={{
                      borderRadius: "4px",
                    }}
                  />
                  <Group>
                    <Badge size="xl" color={d.gmRequired ? "orange" : "cyan"}>
                      GM: {d.gmRequired ? "要" : "レス可"}
                    </Badge>
                    <Badge size="xl" color="violet">
                      PL: {d.player}人
                    </Badge>
                    <ActionIcon
                      size="lg"
                      radius="xl"
                      variant="light"
                      disabled={d.games.length > 0}
                    >
                      <PencilSimple
                        fontSize="1.4rem"
                        onClick={() => {
                          editOpen(d.id);
                        }}
                      />
                    </ActionIcon>
                  </Group>
                  {d.games.length > 0 && (
                    <Stack>
                      {d.games.map((g) => (
                        <Fragment key={g.id}>
                          <GameState game={g} madamisId={d.id} />
                        </Fragment>
                      ))}
                    </Stack>
                  )}
                  {Boolean(d.bought) && <AddGameButton madamisId={d.id} />}
                </Stack>
              </Card>
            ))}
      </Group>
    </Stack>
  );
};
