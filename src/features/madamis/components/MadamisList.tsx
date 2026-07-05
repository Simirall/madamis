import {
  LinkIcon,
  NuclearPlantIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
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
import { type FC, useEffect, useRef } from "react";
import {
  gmRequired,
  gmRequiredBadgeColor,
} from "../../../constants/gmRequired";
import { Loader } from "../../../shared/components/Loader";
import { AddGameButton } from "../../games/components/AddGameButton";
import { GameState } from "../../games/components/GameState";
import {
  madamisPageSize,
  useMadamisNavigationRevision,
} from "../../navigation/store";
import { type MadamisListItem, useMadamisList } from "../hooks/useMadamisList";
import { useMadamisPageParam } from "../hooks/useMadamisPageParam";
import { useMadamisModalStore } from "../stores/madamisModalStore";

export const MadamisContainer = () => {
  const { page, resetPage, setPage } = useMadamisPageParam();
  const navigationRevision = useMadamisNavigationRevision();
  const { data: madamis, error } = useMadamisList(page);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (navigationRevision < 1) {
      return;
    }

    resetPage();
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, [navigationRevision, resetPage]);

  const updatePage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  if (error) {
    return <Text color="red">マダミス一覧の取得に失敗しました</Text>;
  }

  if (!madamis) {
    return <Loader />;
  }

  const start =
    madamis.total === 0 ? 0 : (madamis.page - 1) * madamisPageSize + 1;
  const end = madamis.total === 0 ? 0 : start + madamis.items.length - 1;

  return (
    <VStack align="center" gap="sm">
      <Text color="gray" fontSize="sm" textAlign="end" w="full">
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

  return madamis.map((madamisItem) => (
    <MadamisCard key={madamisItem.id} madamis={madamisItem} />
  ));
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
        startIcon={<LinkIcon fontSize="1.2rem" weight="bold" />}
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
          onClick={() => {
            editOpen(madamis.id);
          }}
          variant="subtle"
        >
          <PencilSimpleIcon fontSize="1.4rem" />
        </IconButton>
      </HStack>
      {madamis.games.length > 0 ? (
        <VStack alignSelf="center" gap="sm">
          {madamis.games.map((game) => (
            <GameState
              game={game}
              gmRequired={madamis.gmRequired as 0 | 1 | 2}
              key={game.id}
              player={madamis.player}
            />
          ))}
        </VStack>
      ) : (
        <EmptyState.Root>
          <EmptyState.Indicator>
            <NuclearPlantIcon weight="duotone" />
          </EmptyState.Indicator>
          <EmptyState.Title>No Game</EmptyState.Title>
        </EmptyState.Root>
      )}
      <AddGameButton madamis={madamis} />
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
