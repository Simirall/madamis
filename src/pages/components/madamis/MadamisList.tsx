import { Link, NuclearPlant, PencilSimple } from "@phosphor-icons/react";
import {
  Button,
  Card,
  EmptyState,
  Grid,
  HStack,
  IconButton,
  Tag,
  VStack,
} from "@yamada-ui/react";
import type { InferResponseType } from "hono";
import { hc } from "hono/client";
import type { FC } from "react";
import type { AppType } from "../../../api";
import {
  gmRequired,
  gmRequiredBadgeColor,
} from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useUser } from "../../hooks/useUser";
import { useMadamisModalStore } from "../../stores/madamisModalStore";
import { useMadamisNavigationStore } from "../../stores/madamisNavigationStore";
import { AddGameButton } from "./../games/AddGamesButton";
import { GameState } from "./../games/GameState";
import { Loader } from "../Loader";
import { MadamisNavigation } from "./MadamisNavigation";

const client = hc<AppType>("/api");

export const MadamisContainer = () => {
  const { data: madamis } = useMadamisList();
  const { data: users } = useUser();

  if (!madamis || !users) {
    return <Loader />;
  }

  return (
    <VStack align="center" p="sm">
      <MadamisNavigation />
      <Grid
        gap="md"
        gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
        justifyContent="center"
        justifyItems="center"
        w="full"
      >
        <MadamisList madamis={madamis} users={users} />
      </Grid>
    </VStack>
  );
};

const MadamisList: FC<{
  madamis: InferResponseType<typeof client.madamis.$get>;
  users: InferResponseType<typeof client.user.$get>;
}> = ({ madamis, users }) => {
  const { onlyNotPlayed, onlyPlayable, players } = useMadamisNavigationStore();

  const filteredMadamisList = madamis
    .filter((d) => (onlyNotPlayed ? d.games.length === 0 : true))
    .filter((d) =>
      onlyPlayable
        ? d.bought && users.length - d.games.length * d.player > d.player
        : true,
    )
    .filter((d) => {
      if (!players) {
        return true;
      }

      const playerCount = Number.parseInt(players);

      if (d.gmRequired === 2) {
        // GMなしの場合
        return d.player === playerCount;
      }

      if (d.gmRequired === 1) {
        // GM必須の場合
        return d.player + 1 === playerCount;
      }

      // GM任意の場合
      return d.player + 1 === playerCount || d.player === playerCount;
    });

  return filteredMadamisList.map((d) => <MadamisCard key={d.id} madamis={d} />);
};

const MadamisCard: FC<{
  madamis: InferResponseType<typeof client.madamis.$get>[number];
}> = ({ madamis }) => {
  const { editOpen } = useMadamisModalStore();

  return (
    <Card.Root
      as={Grid}
      display="grid"
      gridRow="span 4"
      gridTemplateRows="subgrid"
      p="md"
      w="20rem"
    >
      <Button
        as="a"
        colorScheme="lime"
        h="full"
        href={madamis.link}
        lineHeight="2"
        minH="3rem"
        startIcon={<Link fontSize="1.2rem" weight="bold" />}
        target="_blank"
        textWrap="wrap"
        variant="surface"
      >
        {madamis.title}
      </Button>
      <HStack>
        <Tag colorScheme={gmRequiredBadgeColor[madamis.gmRequired]} size="lg">
          {gmRequired[madamis.gmRequired]}
        </Tag>
        <Tag colorScheme="violet" size="lg">
          PL: {madamis.player}人
        </Tag>
        <IconButton
          colorScheme="lime"
          disabled={madamis.games.length > 0}
          fullRounded
          variant="subtle"
        >
          <PencilSimple
            fontSize="1.4rem"
            onClick={() => {
              editOpen(madamis.id);
            }}
          />
        </IconButton>
      </HStack>
      {madamis.games.length > 0 ? (
        <VStack alignSelf="center" gap="sm">
          {madamis.games.map((g) => (
            <GameState
              game={g}
              gmRequired={madamis.gmRequired as 0 | 1 | 2}
              key={g.id}
              player={madamis.player}
            />
          ))}
        </VStack>
      ) : (
        <EmptyState.Root>
          <EmptyState.Indicator>
            <NuclearPlant weight="duotone" />
          </EmptyState.Indicator>
          <EmptyState.Title>No Game</EmptyState.Title>
        </EmptyState.Root>
      )}
      <AddGameButton madamisId={madamis.id} />
    </Card.Root>
  );
};
