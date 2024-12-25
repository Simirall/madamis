import { Button } from "@yamada-ui/react";
import { gm } from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useUser } from "../../hooks/useUser";
import { useGameModalStore } from "../../stores/gameModalStore";
import { Loader } from "../Loader";

export const AddGameButton = ({ madamisId }: { madamisId: number }) => {
  const { data: madamisList } = useMadamisList();
  const { data: users } = useUser();
  const { createOpen } = useGameModalStore();

  const madamis = madamisList?.find((m) => m.id === madamisId);
  const playedPlayers = Array.from(
    new Set(madamis?.games.flatMap((g) => g.gameUsers.map((u) => u.user.id))),
  ).length;

  if (!madamis || !users) {
    return <Loader />;
  }

  return (
    <>
      {users.length -
        (playedPlayers + (madamis.gmRequired === gm.required ? 0 : 1)) >
      madamis.player ? (
        <Button
          variant="surface"
          colorScheme="lime"
          onClick={() => {
            createOpen(madamisId);
          }}
        >
          試合を追加
        </Button>
      ) : (
        <Button disabled>プレイ済</Button>
      )}
    </>
  );
};
