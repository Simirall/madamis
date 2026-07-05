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
    <Wrap gap="md" justifyContent="center">
      <Wrap gap="md" justifyContent="center">
        <CheckboxCard
          checked={onlyNotPlayed}
          colorScheme="teal"
          label="未プレイのみ"
          onChange={(e) => {
            setPlayed(e.target.checked);
          }}
          variant="surface"
          whiteSpace="nowrap"
        />
        <CheckboxCard
          checked={onlyPlayable}
          colorScheme="cyan"
          label="プレイ可能のみ"
          onChange={(e) => {
            setPlayable(e.target.checked);
          }}
          variant="surface"
          whiteSpace="nowrap"
        />
      </Wrap>
      <Select
        items={[
          {
            label: "2人",
            value: "2",
          },
          {
            label: "3人",
            value: "3",
          },
          {
            label: "4人",
            value: "4",
          },
          {
            label: "5人",
            value: "5",
          },
          {
            label: "6人",
            value: "6",
          },
          {
            label: "7人",
            value: "7",
          },
        ]}
        onChange={setPlayers}
        placeholder="遊ぶ人数"
        size="lg"
        value={players}
        variant="outline"
        w="32"
      />
    </Wrap>
  );
};
