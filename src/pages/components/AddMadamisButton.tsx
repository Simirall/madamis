import { ActionIcon, Box } from "@mantine/core";
import { Plus } from "@phosphor-icons/react";
import { useMadamisModalStore } from "../stores/madamisModalStore";

export const AddMadamisButton = () => {
  const { createOpen } = useMadamisModalStore();
  return (
    <>
      <Box
        pos="fixed"
        bottom="0"
        right="0"
        p="sm"
        style={{
          zIndex: 1,
        }}
      >
        <ActionIcon
          variant="filled"
          color="orange"
          size="xl"
          radius="xl"
          aria-label="Add Madamis"
          onClick={createOpen}
        >
          <Plus fontSize="1.6rem" />
        </ActionIcon>
      </Box>
    </>
  );
};
