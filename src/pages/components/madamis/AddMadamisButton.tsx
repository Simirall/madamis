import { Plus } from "@phosphor-icons/react";
import { Box, IconButton } from "@yamada-ui/react";
import { useMadamisModalStore } from "../../stores/madamisModalStore";

export const AddMadamisButton = () => {
  const { createOpen } = useMadamisModalStore();

  return (
    <>
      <Box
        bottom="0"
        p="sm"
        pos="fixed"
        right="0"
        style={{
          zIndex: 1,
        }}
      >
        <IconButton
          aria-label="Add Madamis"
          colorScheme="orange"
          fullRounded
          onClick={createOpen}
          size="xl"
          variant="solid"
        >
          <Plus fontSize="1.6rem" />
        </IconButton>
      </Box>
    </>
  );
};
