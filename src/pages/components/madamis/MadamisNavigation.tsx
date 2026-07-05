import { Card, CheckboxCard, HStack, Select, VStack } from "@yamada-ui/react";
import type {
  MadamisSortKey,
  MadamisSortOrder,
} from "../../stores/madamisNavigationStore";
import { useMadamisNavigationStore } from "../../stores/madamisNavigationStore";

const playerItems: Select.Item[] = [
  {
    label: "2人",
    value: "2",
  },
  {
    label: "3人",
    value: "3",
  },
  {
    label: "4人",
    value: "4",
  },
  {
    label: "5人",
    value: "5",
  },
  {
    label: "6人",
    value: "6",
  },
  {
    label: "7人",
    value: "7",
  },
];

const gmRequiredItems: Select.Item[] = [
  {
    label: "GM任意",
    value: "0",
  },
  {
    label: "GM必須",
    value: "1",
  },
  {
    label: "GMなし",
    value: "2",
  },
];

const sortKeyItems: Select.Item[] = [
  {
    label: "追加順",
    value: "added",
  },
  {
    label: "名前順",
    value: "title",
  },
];

const sortOrderItems: Select.Item[] = [
  {
    label: "昇順",
    value: "asc",
  },
  {
    label: "降順",
    value: "desc",
  },
];

export const MadamisNavigation = ({
  onResetPage,
}: {
  onResetPage: () => void;
}) => {
  const {
    gmRequired,
    setGmRequired,
    onlyBought,
    setOnlyBought,
    onlyNotPlayed,
    setPlayed,
    players,
    setPlayers,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
  } = useMadamisNavigationStore();
  const resetPage = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    window.history.replaceState(null, "", `?${params.toString()}`);
    onResetPage();
  };

  return (
    <HStack>
      <VStack as={Card.Root} p="4">
        <HStack wrap="wrap">
          <CheckboxCard.Root
            checked={onlyNotPlayed}
            colorScheme="teal"
            flexShrink={0}
            label="未プレイのみ"
            onChange={(e) => {
              setPlayed(e.target.checked);
              resetPage();
            }}
            variant="surface"
            w="fit-content"
            whiteSpace="nowrap"
          />
          <CheckboxCard.Root
            checked={onlyBought}
            colorScheme="cyan"
            flexShrink={0}
            label="購入済みのみ"
            onChange={(e) => {
              setOnlyBought(e.target.checked);
              resetPage();
            }}
            variant="surface"
            w="fit-content"
            whiteSpace="nowrap"
          />
        </HStack>
        <HStack wrap="wrap">
          <Select.Root
            items={playerItems}
            onChange={(value) => {
              setPlayers(value);
              resetPage();
            }}
            placeholder="遊ぶ人数"
            rootProps={{
              w: "fit-content",
            }}
            size="lg"
            value={players}
            variant="outline"
          />
          <Select.Root
            items={gmRequiredItems}
            onChange={(value) => {
              setGmRequired(value);
              resetPage();
            }}
            placeholder="GM種別"
            rootProps={{
              w: "fit-content",
            }}
            size="lg"
            value={gmRequired}
            variant="outline"
          />
          <Select.Root
            items={sortKeyItems}
            onChange={(value) => {
              setSortKey(value as MadamisSortKey);
              resetPage();
            }}
            rootProps={{
              w: "fit-content",
            }}
            size="lg"
            value={sortKey}
            variant="outline"
          />
          <Select.Root
            items={sortOrderItems}
            onChange={(value) => {
              setSortOrder(value as MadamisSortOrder);
              resetPage();
            }}
            rootProps={{
              w: "fit-content",
            }}
            size="lg"
            value={sortOrder}
            variant="outline"
          />
        </HStack>
      </VStack>
    </HStack>
  );
};
