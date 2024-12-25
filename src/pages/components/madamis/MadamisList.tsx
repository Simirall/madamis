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
import { Loader } from "../Loader";
import { AddGameButton } from "./../games/AddGamesButton";
import { GameState } from "./../games/GameState";
import { MadamisNavigation } from "./MadamisNavigation";

const client = hc<AppType>("/api");

export const MadamisContainer = () => {
  const { data: madamis } = useMadamisList();
  const { data: users } = useUser();

  if (!madamis || !users) {
    return <Loader />;
  }

  return (
    <VStack p="sm" align="center">
      <MadamisNavigation />
      <Grid
        w="full"
        gap="md"
        justifyContent="center"
        justifyItems="center"
        gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
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

  return filteredMadamisList.map((d) => <MadamisCard madamis={d} key={d.id} />);
};

const MadamisCard: FC<{
  madamis: InferResponseType<typeof client.madamis.$get>[number];
}> = ({ madamis }) => {
  const { editOpen } = useMadamisModalStore();

  return (
    <Card
      w="20rem"
      p="md"
      display="grid"
      as={Grid}
      gridTemplateRows="subgrid"
      gridRow="span 4"
    >
      <Button
        variant="subtle"
        colorScheme="lime"
        textAlign="start"
        as="a"
        href={madamis.link}
        target="_blank"
        startIcon={<Link />}
      >
        {madamis.title}
      </Button>
      <HStack>
        <Tag size="lg" colorScheme={gmRequiredBadgeColor[madamis.gmRequired]}>
          {gmRequired[madamis.gmRequired]}
        </Tag>
        <Tag size="lg" colorScheme="violet">
          PL: {madamis.player}人
        </Tag>
        <IconButton
          fullRounded
          variant="subtle"
          colorScheme="lime"
          disabled={madamis.games.length > 0}
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
              key={g.id}
              game={g}
              gmRequired={madamis.gmRequired as 0 | 1 | 2}
              player={madamis.player}
            />
          ))}
        </VStack>
      ) : (
        <EmptyState
          title="No Game"
          indicator={<NuclearPlant weight="duotone" />}
        />
      )}
      {madamis.bought ? (
        <AddGameButton madamisId={madamis.id} />
      ) : (
        <Button disabled>未購入</Button>
      )}
    </Card>
  );
};
