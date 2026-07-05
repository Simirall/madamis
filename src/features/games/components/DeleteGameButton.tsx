import { TrashIcon } from "@phosphor-icons/react";
import { IconButton, useDisclosure } from "@yamada-ui/react";
import type { FC } from "react";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { useDeleteGame } from "../hooks/useGameActions";

export const DeleteGameButton: FC<{ gameId: number }> = ({ gameId }) => {
  const { open, onOpen, onClose } = useDisclosure();
  const { deleteGame, loading } = useDeleteGame(gameId);

  const onConfirm = async () => {
    await deleteGame();
    onClose();
  };

  return (
    <>
      <IconButton
        colorScheme="red"
        fullRounded
        onClick={onOpen}
        size="xs"
        variant="surface"
      >
        <TrashIcon />
      </IconButton>
      <ConfirmDialog
        loading={loading}
        onClose={onClose}
        onConfirm={onConfirm}
        open={open}
        title="削除しますか？"
      />
    </>
  );
};
