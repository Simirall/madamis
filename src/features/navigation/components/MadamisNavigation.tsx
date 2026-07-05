import { FunnelSimpleIcon } from "@phosphor-icons/react";
import {
  Box,
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
import {
  getMadamisNavigationActiveCount,
  gmRequiredItems,
  playerItems,
  sortKeyItems,
  sortOrderItems,
} from "../options";
import {
  defaultMadamisNavigationDraft,
  type MadamisNavigationDraft,
  type MadamisSortKey,
  type MadamisSortOrder,
  useMadamisNavigationStore,
} from "../store";

export const MadamisNavigation = () => {
  const {
    applyDraft,
    getDraft,
    gmRequired,
    onlyBought,
    onlyNotPlayed,
    players,
    sortKey,
    sortOrder,
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

  const onOpen = () => {
    setDraft(getDraft());
    setOpen(true);
  };

  const onClose = () => {
    setDraft(getDraft());
    setOpen(false);
  };

  const onApply = () => {
    applyDraft(draft);
    setOpen(false);
  };

  const activeCount = getMadamisNavigationActiveCount(currentDraft);

  return (
    <>
      <Box pos="relative">
        <IconButton
          aria-label="表示条件を開く"
          colorScheme="sky"
          fullRounded
          onClick={onOpen}
          size="lg"
        >
          <FunnelSimpleIcon size="1.6rem" weight="bold" />
        </IconButton>
        {activeCount > 0 ? (
          <Box
            alignItems="center"
            bg="red.500"
            borderColor="white"
            borderRadius="full"
            borderWidth="2px"
            color="white"
            display="flex"
            fontSize="xs"
            fontWeight="bold"
            h="1.35rem"
            justifyContent="center"
            minW="1.35rem"
            pos="absolute"
            right="-0.15rem"
            top="-0.15rem"
          >
            {activeCount}
          </Box>
        ) : null}
      </Box>
      <Modal.Root onClose={onClose} open={open} size="lg">
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>表示条件</Modal.Title>
            <HStack gap="sm">
              <Button
                colorScheme="warning"
                onClick={() => {
                  setDraft(defaultMadamisNavigationDraft);
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
                    onChange={(event) => {
                      setDraft((value) => ({
                        ...value,
                        onlyNotPlayed: event.target.checked,
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
                    onChange={(event) => {
                      setDraft((value) => ({
                        ...value,
                        onlyBought: event.target.checked,
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
          <Modal.Footer>
            <Button onClick={onClose} variant="ghost">
              キャンセル
            </Button>
            <Button colorScheme="lime" onClick={onApply}>
              適用
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
