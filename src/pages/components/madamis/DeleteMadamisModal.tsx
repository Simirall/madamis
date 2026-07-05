import {
  Button,
  HStack,
  ModalRoot as Modal,
  ModalBody,
  ModalHeader,
  useDisclosure,
} from "@yamada-ui/react";
import { hc } from "hono/client";
import { type FC, useState } from "react";
import type { AppType } from "../../../api";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useMadamisModalStore } from "../../stores/madamisModalStore";

const client = hc<AppType>("/api");

const DeleteMadamisModal: FC<{
  madamisId: number;
  opened: boolean;
  onClose: () => void;
}> = ({ madamisId, opened, onClose }) => {
  const { onClose: closeMadamisModal } = useMadamisModalStore();
  const { mutate } = useMadamisList();

  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await client.madamis[":id"].$delete({
      param: { id: madamisId.toString() },
    });
    await mutate();
    closeMadamisModal();
    onClose();
  };

  return (
    <Modal onClose={onClose} open={opened} size="sm">
      <ModalHeader>削除しますか？</ModalHeader>
      <ModalBody>
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
      </ModalBody>
    </Modal>
  );
};

export const DeleteMadamisButton: FC<{ madamisId: number }> = ({
  madamisId,
}) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="red" onClick={onOpen} variant="surface">
        削除
      </Button>
      <DeleteMadamisModal
        madamisId={madamisId}
        onClose={onClose}
        opened={open}
      />
    </>
  );
};
