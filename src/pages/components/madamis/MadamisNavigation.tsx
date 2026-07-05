import { CheckboxCard, Flex, Select } from "@yamada-ui/react";
import { useMadamisNavigationStore } from "../../stores/madamisNavigationStore";

const playerItems: Select.Item[] = [
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
];

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
    <Flex
      alignItems="center"
      flexWrap="nowrap"
      gap="md"
      justifyContent="center"
    >
      <CheckboxCard.Root
        checked={onlyNotPlayed}
        colorScheme="teal"
        flexShrink={0}
        label="未プレイのみ"
        onChange={(e) => {
          setPlayed(e.target.checked);
        }}
        variant="surface"
        w="fit-content"
        whiteSpace="nowrap"
      />
      <CheckboxCard.Root
        checked={onlyPlayable}
        colorScheme="cyan"
        flexShrink={0}
        label="プレイ可能のみ"
        onChange={(e) => {
          setPlayable(e.target.checked);
        }}
        variant="surface"
        w="fit-content"
        whiteSpace="nowrap"
      />
      <Select.Root
        flexShrink={0}
        items={playerItems}
        onChange={setPlayers}
        placeholder="遊ぶ人数"
        size="lg"
        value={players}
        variant="outline"
        w="36"
      />
    </Flex>
  );
};
