import { Trash } from "@phosphor-icons/react";
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalHeader,
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
    <Modal open={opened} onClose={onClose} size="sm">
      <ModalHeader>削除しますか？</ModalHeader>
      <ModalBody>
        <HStack>
          <Button colorScheme="red" onClick={onDelete} loading={loading}>
            削除する
          </Button>
          <Button
            colorScheme="sky"
            variant="subtle"
            onClick={onClose}
            loading={loading}
          >
            削除しない
          </Button>
        </HStack>
      </ModalBody>
    </Modal>
  );
};

export const DeleteGameButton: FC<{ gameId: number }> = ({ gameId }) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        colorScheme="red"
        variant="surface"
        size="xs"
        fullRounded
        onClick={onOpen}
      >
        <Trash />
      </IconButton>
      <DeleteGameModal gameId={gameId} opened={open} onClose={onClose} />
    </>
  );
};
