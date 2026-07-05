import { ArrowUpIcon } from "@phosphor-icons/react";
import { Box, IconButton } from "@yamada-ui/react";
import { useEffect, useState } from "react";

const visibleScrollY = 240;

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisible = () => {
      setVisible(window.scrollY > visibleScrollY);
    };

    updateVisible();
    window.addEventListener("scroll", updateVisible, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisible);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Box
      bottom="0"
      left="0"
      p="sm"
      pos="fixed"
      style={{
        zIndex: 1,
      }}
    >
      <IconButton
        aria-label="ページ上部へ戻る"
        colorScheme="emerald"
        fullRounded
        onClick={() => {
          window.scrollTo({ behavior: "smooth", top: 0 });
        }}
        shadow="md"
        size="xl"
        variant="solid"
      >
        <ArrowUpIcon fontSize="1.6rem" weight="bold" />
      </IconButton>
    </Box>
  );
};
