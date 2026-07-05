import { Button, useDisclosure } from "@yamada-ui/react";
import type { FC } from "react";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { useDeleteMadamis } from "../hooks/useMadamisActions";

export const DeleteMadamisButton: FC<{
  madamisId: number;
  onDeleted: () => void;
}> = ({ madamisId, onDeleted }) => {
  const { open, onOpen, onClose } = useDisclosure();
  const { deleteMadamis, loading } = useDeleteMadamis(madamisId);

  const onConfirm = async () => {
    await deleteMadamis();
    onDeleted();
    onClose();
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen} variant="surface">
        削除
      </Button>
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
