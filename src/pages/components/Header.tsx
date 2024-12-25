import { MoonStars, Sun } from "@phosphor-icons/react";
import {
  Button,
  type CSS,
  HStack,
  IconButton,
  type Token,
  useColorMode,
  useColorModeValue,
} from "@yamada-ui/react";

export const Header = () => {
  const bg = useColorModeValue<
    Token<CSS.Property.Background, "colors">,
    Token<CSS.Property.Background, "colors">
  >("emerald.100", "emerald.700");

  return (
    <HStack
      bg={bg}
      justify="space-between"
      p="md"
      top="0"
      pos="sticky"
      zIndex="1"
      shadow="md"
    >
      <Button
        size="xl"
        fontSize="3xl"
        colorScheme="emerald"
        variant="ghost"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        J∞マダミス部
      </Button>
      <ColorModeToggle />
    </HStack>
  );
};

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      colorScheme="amber"
      fullRounded
      size="lg"
      onClick={() => {
        toggleColorMode();
      }}
    >
      {colorMode === "light" ? (
        <MoonStars size="1.6rem" weight="fill" />
      ) : (
        <Sun size="1.6rem" weight="fill" />
      )}
    </IconButton>
  );
};
