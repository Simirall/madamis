import { Button } from "@mantine/core";
import { useGameModalStore } from "../stores/gameModalStore";

export const AddGameButton = ({ madamisId }: { madamisId: number }) => {
  const { createOpen } = useGameModalStore();

  return (
    <>
      <Button
        variant="light"
        onClick={() => {
          createOpen(madamisId);
        }}
      >
        試合を追加
      </Button>
    </>
  );
};
