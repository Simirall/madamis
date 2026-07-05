import { Modal, Text } from "@yamada-ui/react";
import { Loader } from "../../../shared/components/Loader";
import {
  useMadamisListItem,
  useUnfilteredMadamisList,
} from "../hooks/useMadamisList";
import { useMadamisModalStore } from "../stores/madamisModalStore";
import { MadamisForm } from "./MadamisForm";

export const MadamisModal = () => {
  const { madamisId, onClose, open } = useMadamisModalStore();
  const { data, error } = useUnfilteredMadamisList();
  const {
    data: currentPageEditData,
    error: currentPageError,
    isLoading: currentPageLoading,
  } = useMadamisListItem(madamisId);
  const isEditing = madamisId !== undefined;

  const editData = isEditing
    ? (currentPageEditData ?? data?.find((madamis) => madamis.id === madamisId))
    : undefined;
  const madamisUrls = data
    ?.filter((madamis) => (madamisId ? madamis.id !== madamisId : true))
    .map((madamis) => madamis.link);

  return (
    <Modal.Root closeOnOverlay={false} onClose={onClose} open={open} size="lg">
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{`マダミスを${isEditing ? "編集" : "追加"}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error || currentPageError ? (
            <Text color="red">マダミス情報の取得に失敗しました</Text>
          ) : !madamisUrls || (isEditing && currentPageLoading) ? (
            <Loader />
          ) : isEditing && !editData ? (
            <Text color="red">編集対象のマダミスが見つかりません</Text>
          ) : (
            <MadamisForm
              editData={editData}
              madamisId={madamisId}
              madamisUrls={madamisUrls}
              onSaved={onClose}
            />
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
