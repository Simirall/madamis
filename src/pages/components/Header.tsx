import { MoonStarsIcon, SunIcon } from "@phosphor-icons/react";
import {
  Button,
  type CSS,
  HStack,
  IconButton,
  type Token,
  useColorMode,
  useColorModeValue,
} from "@yamada-ui/react";
import { useMadamisPageParam } from "../../features/madamis/hooks/useMadamisPageParam";
import { MadamisNavigation } from "../../features/navigation/components/MadamisNavigation";

export const Header = () => {
  const { resetPage } = useMadamisPageParam();
  const bg = useColorModeValue<
    Token<CSS.Property.Background, "colors">,
    Token<CSS.Property.Background, "colors">
  >("emerald.100", "emerald.800");

  return (
    <HStack
      bg={bg}
      justify="space-between"
      pos="sticky"
      px="md"
      py="xs"
      shadow="md"
      top="0"
      zIndex="2"
    >
      <Button
        colorScheme="emerald"
        fontSize="3xl"
        onClick={() => {
          resetPage();
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
      aria-label="色モードを切り替え"
      colorScheme="amber"
      fullRounded
      onClick={() => {
        toggleColorMode();
      }}
      size="lg"
    >
      {colorMode === "light" ? (
        <MoonStarsIcon size="1.6rem" weight="fill" />
      ) : (
        <SunIcon size="1.6rem" weight="fill" />
      )}
    </IconButton>
  );
};
