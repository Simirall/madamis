import { Modal, Text } from "@yamada-ui/react";
import { Loader } from "../../../shared/components/Loader";
import { useMadamisList } from "../../madamis/hooks/useMadamisList";
import { useUser } from "../hooks/useUser";
import { useGameModalStore } from "../stores/gameModalStore";
import { GameForm } from "./GameForm";

export const GameModal = () => {
  const { data: madamisList, error: madamisError } = useMadamisList();
  const { data: users, error: usersError } = useUser();
  const { madamisId, onClose, open } = useGameModalStore();

  const madamis = madamisList?.items.find((item) => item.id === madamisId);
  const userIds = users?.map((user) => user.id.toString());

  return (
    <Modal.Root closeOnOverlay={false} onClose={onClose} open={open} size="lg">
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>試合を追加</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {madamisError || usersError ? (
            <Text color="red">試合追加に必要な情報の取得に失敗しました</Text>
          ) : !madamis || !users || !userIds ? (
            <Loader />
          ) : (
            <GameForm
              madamis={madamis}
              onSaved={onClose}
              userIds={userIds}
              users={users}
            />
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
