import { CheckboxCard, Select, Wrap } from "@yamada-ui/react";
import { useMadamisNavigationStore } from "../../stores/madamisNavigationStore";

export const MadamisNavigation = () => {
  const {
    onlyNotPlayed,
    setPlayed,
    onlyPlayable,
    setPlayable,
    players,
    setPlayers,
  } = useMadamisNavigationStore();

  return (
    <Wrap justifyContent="center" gap="md">
      <Wrap justifyContent="center" gap="md">
        <CheckboxCard
          whiteSpace="nowrap"
          label="未プレイのみ"
          variant="surface"
          colorScheme="teal"
          checked={onlyNotPlayed}
          onChange={(e) => {
            setPlayed(e.target.checked);
          }}
        />
        <CheckboxCard
          whiteSpace="nowrap"
          label="プレイ可能のみ"
          variant="surface"
          colorScheme="cyan"
          checked={onlyPlayable}
          onChange={(e) => {
            setPlayable(e.target.checked);
          }}
        />
      </Wrap>
      <Select
        w="32"
        size="lg"
        variant="outline"
        placeholder="遊ぶ人数"
        value={players}
        onChange={setPlayers}
        items={[
          {
            value: "2",
            label: "2人",
          },
          {
            value: "3",
            label: "3人",
          },
          {
            value: "4",
            label: "4人",
          },
          {
            value: "5",
            label: "5人",
          },
          {
            value: "6",
            label: "6人",
          },
          {
            value: "7",
            label: "7人",
          },
        ]}
      />
    </Wrap>
  );
};
