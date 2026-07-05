import { Link, NuclearPlant, PencilSimple } from "@phosphor-icons/react";
import {
  Button,
  Card,
  EmptyState,
  Grid,
  HStack,
  IconButton,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react";
import { type FC, useEffect, useState } from "react";
import {
  gmRequired,
  gmRequiredBadgeColor,
} from "../../../constants/gmRequired";
import type { MadamisListItem } from "../../hooks/useMadamisList";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useMadamisModalStore } from "../../stores/madamisModalStore";
import {
  madamisNavigationChangedEvent,
  madamisPageSize,
} from "../../stores/madamisNavigationStore";
import { AddGameButton } from "./../games/AddGamesButton";
import { GameState } from "./../games/GameState";
import { Loader } from "../Loader";

const getInitialPage = () => {
  const page = Number.parseInt(
    new URLSearchParams(window.location.search).get("page") ?? "1",
    10,
  );

  return Number.isNaN(page) || page < 1 ? 1 : page;
};

export const MadamisContainer = () => {
  const [page, setPage] = useState(getInitialPage);
  const { data: madamis } = useMadamisList(page);

  useEffect(() => {
    const onNavigationChanged = () => {
      setPage(getInitialPage());
      window.scrollTo({ behavior: "smooth", top: 0 });
    };

    window.addEventListener(madamisNavigationChangedEvent, onNavigationChanged);

    return () => {
      window.removeEventListener(
        madamisNavigationChangedEvent,
        onNavigationChanged,
      );
    };
  }, []);

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(nextPage));
    window.history.replaceState(null, "", `?${params.toString()}`);
    setPage(nextPage);
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  if (!madamis) {
    return <Loader />;
  }

  const start =
    madamis.total === 0 ? 0 : (madamis.page - 1) * madamisPageSize + 1;
  const end = madamis.total === 0 ? 0 : start + madamis.items.length - 1;

  return (
    <VStack align="center" p="sm">
      <Text color="gray" fontSize="sm" w="full">
        {start} - {end} / {madamis.total} 件
      </Text>
      <Grid
        gap="md"
        gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
        justifyContent="center"
        justifyItems="center"
        w="full"
      >
        <MadamisList madamis={madamis.items} />
      </Grid>
      <MadamisPagination
        currentPage={madamis.page}
        onChange={updatePage}
        totalPages={madamis.totalPages}
      />
    </VStack>
  );
};

const MadamisList: FC<{
  madamis: ReadonlyArray<MadamisListItem>;
}> = ({ madamis }) => {
  if (madamis.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Title>No Madamis</EmptyState.Title>
      </EmptyState.Root>
    );
  }

  return madamis.map((d) => <MadamisCard key={d.id} madamis={d} />);
};

const MadamisCard: FC<{
  madamis: MadamisListItem;
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

const MadamisPagination: FC<{
  currentPage: number;
  onChange: (page: number) => void;
  totalPages: number;
}> = ({ currentPage, onChange, totalPages }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <VStack gap="sm">
      <HStack flexWrap="wrap" justifyContent="center">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onChange(currentPage - 1)}
          size="sm"
          variant="outline"
        >
          前へ
        </Button>
        {pages.map((page) => (
          <Button
            colorScheme={page === currentPage ? "lime" : "gray"}
            key={page}
            onClick={() => onChange(page)}
            size="sm"
            variant={page === currentPage ? "solid" : "outline"}
          >
            {page}
          </Button>
        ))}
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => onChange(currentPage + 1)}
          size="sm"
          variant="outline"
        >
          次へ
        </Button>
      </HStack>
    </VStack>
  );
};
