import { Trash } from "@phosphor-icons/react";
import {
  Button,
  HStack,
  IconButton,
  Modal,
  useDisclosure,
} from "@yamada-ui/react";
import { hc } from "hono/client";
import { type FC, useState } from "react";
import type { AppType } from "../../../api";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useGameModalStore } from "../../stores/gameModalStore";

const client = hc<AppType>("/api");

const DeleteGameModal: FC<{
  gameId: number;
  opened: boolean;
  onClose: () => void;
}> = ({ gameId, opened, onClose }) => {
  const { onClose: closeGameModal } = useGameModalStore();
  const { mutate } = useMadamisList();

  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await client.games[":id"].$delete({
      param: { id: gameId.toString() },
    });
    await mutate();
    closeGameModal();
    onClose();
  };

  return (
    <Modal.Root onClose={onClose} open={opened} size="sm">
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>削除しますか？</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HStack>
            <Button colorScheme="red" loading={loading} onClick={onDelete}>
              削除する
            </Button>
            <Button
              colorScheme="sky"
              loading={loading}
              onClick={onClose}
              variant="subtle"
            >
              削除しない
            </Button>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export const DeleteGameButton: FC<{ gameId: number }> = ({ gameId }) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        colorScheme="red"
        fullRounded
        onClick={onOpen}
        size="xs"
        variant="surface"
      >
        <Trash />
      </IconButton>
      <DeleteGameModal gameId={gameId} onClose={onClose} opened={open} />
    </>
  );
};
