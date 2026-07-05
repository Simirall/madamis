import {
  CaretDownIcon,
  CaretUpIcon,
  LinkIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import {
  Box,
  Button,
  Card,
  EmptyState,
  Grid,
  HStack,
  IconButton,
  Tag,
  Text,
  Tooltip,
  VStack,
  Wrap,
} from "@yamada-ui/react";
import { type FC, useEffect, useRef, useState } from "react";
import {
  gmRequired,
  gmRequiredBadgeColor,
} from "../../../constants/gmRequired";
import { Loader } from "../../../shared/components/Loader";
import { AddGameButton } from "../../games/components/AddGameButton";
import { GameState } from "../../games/components/GameState";
import {
  getMadamisNavigationActiveItems,
  getSortSummary,
} from "../../navigation/options";
import {
  madamisPageSize,
  useMadamisNavigationRevision,
  useMadamisNavigationStore,
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
    <VStack align="center" gap="md">
      <MadamisListToolbar end={end} start={start} total={madamis.total} />
      <Grid
        gap="sm"
        gridTemplateColumns="repeat(auto-fit, minmax(320px, 1fr))"
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

const MadamisListToolbar: FC<{
  end: number;
  start: number;
  total: number;
}> = ({ end, start, total }) => {
  const {
    applyDraft,
    gmRequired: selectedGmRequired,
    onlyBought,
    onlyNotPlayed,
    players,
    sortKey,
    sortOrder,
  } = useMadamisNavigationStore();
  const draft = {
    gmRequired: selectedGmRequired,
    onlyBought,
    onlyNotPlayed,
    players,
    sortKey,
    sortOrder,
  };
  const activeItems = getMadamisNavigationActiveItems(draft);

  const clearItem = (key: (typeof activeItems)[number]["key"]) => {
    applyDraft({
      ...draft,
      [key]:
        key === "onlyBought" || key === "onlyNotPlayed" ? false : undefined,
    });
  };

  return (
    <VStack align="stretch" gap="xs" w="full">
      <HStack justify="space-between" wrap="wrap">
        <Wrap gap="xs">
          <Tag colorScheme="gray" size="sm" variant="surface">
            並び: {getSortSummary(sortKey, sortOrder)}
          </Tag>
          {activeItems.length > 0 &&
            activeItems.map((item) => (
              <Button
                colorScheme={item.colorScheme}
                key={item.key}
                onClick={() => clearItem(item.key)}
                size="xs"
                variant="surface"
              >
                {item.label} ×
              </Button>
            ))}
        </Wrap>
        <Text color="gray" fontSize="sm">
          {start} - {end} / {total} 件
        </Text>
      </HStack>
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
  const [showHistory, setShowHistory] = useState(false);
  const sortedGames = [...madamis.games].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const visibleGames = showHistory ? sortedGames : sortedGames.slice(0, 1);

  return (
    <Card.Root
      as={Grid}
      borderRadius="md"
      display="grid"
      gridRow="span 5"
      gridTemplateRows="subgrid"
      p="sm"
      shadow={["md", "sm"]}
      w="19.5rem"
    >
      <HStack align="center" gap="xs">
        <Button
          as="a"
          colorScheme="lime"
          flex="1"
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
        <Tooltip
          content={
            madamis.games.length > 0
              ? "試合履歴があるため作品情報は編集できません"
              : "作品情報を編集"
          }
        >
          <IconButton
            aria-label="作品情報を編集"
            colorScheme="lime"
            disabled={madamis.games.length > 0}
            flexShrink={0}
            fullRounded
            onClick={() => {
              editOpen(madamis.id);
            }}
            variant="subtle"
          >
            <PencilSimpleIcon fontSize="1.2rem" />
          </IconButton>
        </Tooltip>
      </HStack>
      <Wrap gap="xs">
        <Tag colorScheme={gmRequiredBadgeColor[madamis.gmRequired]} size="md">
          {gmRequired[madamis.gmRequired]}
        </Tag>
        <Tag colorScheme="violet" size="md">
          PL: {madamis.player}人
        </Tag>
      </Wrap>
      {madamis.games.length > 0 ? (
        <VStack alignSelf="center" gap="xs">
          <HStack justify="space-between" w="full">
            <Text color="gray" fontSize="xs">
              履歴 {madamis.games.length}件
            </Text>
            {madamis.games.length > 1 ? (
              <Button
                endIcon={
                  showHistory ? (
                    <CaretUpIcon weight="bold" />
                  ) : (
                    <CaretDownIcon weight="bold" />
                  )
                }
                onClick={() => setShowHistory((value) => !value)}
                size="xs"
                variant="ghost"
              >
                {showHistory ? "閉じる" : "履歴を見る"}
              </Button>
            ) : null}
          </HStack>
          {visibleGames.map((game) => (
            <GameState
              game={game}
              gmRequired={madamis.gmRequired as 0 | 1 | 2}
              key={game.id}
              player={madamis.player}
            />
          ))}
        </VStack>
      ) : (
        <Box
          alignSelf="center"
          borderColor={["blackAlpha.200", "whiteAlpha.200"]}
          borderRadius="md"
          borderWidth="1px"
          p="sm"
        >
          <Text color="gray" fontSize="sm" textAlign="center">
            試合履歴なし
          </Text>
        </Box>
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
