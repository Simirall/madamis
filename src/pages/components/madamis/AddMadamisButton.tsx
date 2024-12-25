import { Plus } from "@phosphor-icons/react";
import { Box, IconButton } from "@yamada-ui/react";
import { useMadamisModalStore } from "../../stores/madamisModalStore";

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
        <IconButton
          variant="solid"
          colorScheme="orange"
          size="xl"
          fullRounded
          aria-label="Add Madamis"
          onClick={createOpen}
        >
          <Plus fontSize="1.6rem" />
        </IconButton>
      </Box>
    </>
  );
};
