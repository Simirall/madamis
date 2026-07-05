import { FunnelSimple } from "@phosphor-icons/react";
import {
  Button,
  CheckboxCard,
  HStack,
  IconButton,
  Modal,
  Select,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useState } from "react";
import type {
  MadamisSortKey,
  MadamisSortOrder,
} from "../../stores/madamisNavigationStore";
import {
  madamisNavigationChangedEvent,
  useMadamisNavigationStore,
} from "../../stores/madamisNavigationStore";

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

type MadamisNavigationDraft = {
  gmRequired: string | undefined;
  onlyBought: boolean;
  onlyNotPlayed: boolean;
  players: string | undefined;
  sortKey: MadamisSortKey;
  sortOrder: MadamisSortOrder;
};

const defaultDraft: MadamisNavigationDraft = {
  gmRequired: undefined,
  onlyBought: false,
  onlyNotPlayed: false,
  players: undefined,
  sortKey: "added",
  sortOrder: "asc",
};

export const MadamisNavigation = () => {
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
  const currentDraft = {
    gmRequired,
    onlyBought,
    onlyNotPlayed,
    players,
    sortKey,
    sortOrder,
  } satisfies MadamisNavigationDraft;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<MadamisNavigationDraft>(currentDraft);

  const resetPage = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    window.history.replaceState(null, "", `?${params.toString()}`);
    window.dispatchEvent(new CustomEvent(madamisNavigationChangedEvent));
  };

  const onOpen = () => {
    setDraft(currentDraft);
    setOpen(true);
  };

  const onClose = () => {
    const changed =
      draft.gmRequired !== gmRequired ||
      draft.onlyBought !== onlyBought ||
      draft.onlyNotPlayed !== onlyNotPlayed ||
      draft.players !== players ||
      draft.sortKey !== sortKey ||
      draft.sortOrder !== sortOrder;

    setGmRequired(draft.gmRequired);
    setOnlyBought(draft.onlyBought);
    setPlayed(draft.onlyNotPlayed);
    setPlayers(draft.players);
    setSortKey(draft.sortKey);
    setSortOrder(draft.sortOrder);

    if (changed) {
      resetPage();
    }

    setOpen(false);
  };

  return (
    <>
      <IconButton
        colorScheme="teal"
        fullRounded
        onClick={onOpen}
        size="lg"
        variant="subtle"
      >
        <FunnelSimple size="1.6rem" weight="bold" />
      </IconButton>
      <Modal.Root onClose={onClose} open={open} size="lg">
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>表示条件</Modal.Title>
            <HStack gap="sm">
              <Button
                colorScheme="warning"
                onClick={() => {
                  setDraft(defaultDraft);
                }}
                size="sm"
                variant="subtle"
              >
                リセット
              </Button>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <VStack align="stretch" gap="lg">
              <VStack align="stretch" gap="md">
                <Text fontSize="lg" fontWeight="bold">
                  フィルター
                </Text>
                <HStack wrap="wrap">
                  <CheckboxCard.Root
                    checked={draft.onlyNotPlayed}
                    colorScheme="teal"
                    flexShrink={0}
                    label="未プレイのみ"
                    onChange={(e) => {
                      setDraft((value) => ({
                        ...value,
                        onlyNotPlayed: e.target.checked,
                      }));
                    }}
                    variant="surface"
                    w="fit-content"
                    whiteSpace="nowrap"
                  />
                  <CheckboxCard.Root
                    checked={draft.onlyBought}
                    colorScheme="cyan"
                    flexShrink={0}
                    label="購入済みのみ"
                    onChange={(e) => {
                      setDraft((value) => ({
                        ...value,
                        onlyBought: e.target.checked,
                      }));
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
                      setDraft((draftValue) => ({
                        ...draftValue,
                        players: value,
                      }));
                    }}
                    placeholder="遊ぶ人数"
                    rootProps={{
                      w: "fit-content",
                    }}
                    size="lg"
                    value={draft.players}
                    variant="outline"
                  />
                  <Select.Root
                    items={gmRequiredItems}
                    onChange={(value) => {
                      setDraft((draftValue) => ({
                        ...draftValue,
                        gmRequired: value,
                      }));
                    }}
                    placeholder="GM種別"
                    rootProps={{
                      w: "fit-content",
                    }}
                    size="lg"
                    value={draft.gmRequired}
                    variant="outline"
                  />
                </HStack>
              </VStack>
              <VStack align="stretch" gap="md">
                <Text fontSize="lg" fontWeight="bold">
                  ソート
                </Text>
                <HStack wrap="wrap">
                  <Select.Root
                    items={sortKeyItems}
                    onChange={(value) => {
                      setDraft((draftValue) => ({
                        ...draftValue,
                        sortKey: value as MadamisSortKey,
                      }));
                    }}
                    rootProps={{
                      w: "fit-content",
                    }}
                    size="lg"
                    value={draft.sortKey}
                    variant="outline"
                  />
                  <Select.Root
                    items={sortOrderItems}
                    onChange={(value) => {
                      setDraft((draftValue) => ({
                        ...draftValue,
                        sortOrder: value as MadamisSortOrder,
                      }));
                    }}
                    rootProps={{
                      w: "fit-content",
                    }}
                    size="lg"
                    value={draft.sortOrder}
                    variant="outline"
                  />
                </HStack>
              </VStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
