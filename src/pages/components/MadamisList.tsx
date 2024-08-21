import { ActionIcon, Badge, Card, Group, NavLink, Stack } from "@mantine/core";
import { Link, PencilSimple } from "@phosphor-icons/react";
import { useMadamisList } from "../hooks/useMadamisList";
import { useMadamisModalStore } from "../stores/madamisModalStore";
import { AddGameButton } from "./AddGamesButton";
import { GameState } from "./GameState";
import { Fragment } from "react/jsx-runtime";

export const MadamisList = () => {
  const { data } = useMadamisList();
  const { editOpen } = useMadamisModalStore();

  return (
    <>
      <Group p="md" justify="center">
        {data &&
          data.map((d) => (
            <Card
              key={d.id}
              w="20rem"
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Stack>
                <Group>
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
                </Group>
                <Group>
                  <Badge size="xl" color={d.gmRequired ? "orange" : "cyan"}>
                    GM: {d.gmRequired ? "要" : "レス可"}
                  </Badge>
                  <Badge size="xl" color="violet">
                    PL: {d.player}人
                  </Badge>
                  <ActionIcon size="lg" radius="xl" variant="light">
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
                <AddGameButton madamisId={d.id} />
              </Stack>
            </Card>
          ))}
      </Group>
    </>
  );
};
