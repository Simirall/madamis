import { Button, HStack, Modal } from "@yamada-ui/react";
import type { FC } from "react";

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  open: boolean;
  title: string;
};

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  cancelLabel = "削除しない",
  confirmLabel = "削除する",
  loading = false,
  onClose,
  onConfirm,
  open,
  title,
}) => {
  return (
    <Modal.Root onClose={onClose} open={open} size="sm">
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HStack>
            <Button colorScheme="red" loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </Button>
            <Button
              colorScheme="sky"
              loading={loading}
              onClick={onClose}
              variant="subtle"
            >
              {cancelLabel}
            </Button>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
