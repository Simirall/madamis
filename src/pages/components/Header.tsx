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
import { MadamisNavigation } from "./madamis/MadamisNavigation";

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
      pos="sticky"
      shadow="md"
      top="0"
      zIndex="2"
    >
      <Button
        colorScheme="emerald"
        fontSize="3xl"
        onClick={() => {
          window.scrollTo({ behavior: "smooth", top: 0 });
        }}
        size="xl"
        variant="ghost"
      >
        J∞マダミス部
      </Button>
      <HStack>
        <MadamisNavigation />
        <ColorModeToggle />
      </HStack>
    </HStack>
  );
};

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      colorScheme="amber"
      fullRounded
      onClick={() => {
        toggleColorMode();
      }}
      size="lg"
    >
      {colorMode === "light" ? (
        <MoonStars size="1.6rem" weight="fill" />
      ) : (
        <Sun size="1.6rem" weight="fill" />
      )}
    </IconButton>
  );
};
