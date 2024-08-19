import { ActionIcon, Group, Title, useMantineColorScheme } from "@mantine/core";
import { MoonStars, Sun } from "@phosphor-icons/react";

export const Header = () => {
  return (
    <Group bg="green" justify="space-between" p="md">
      <Title fw="normal" c="white">
        J∞マダミス部
      </Title>
      <ColorModeToggle />
    </Group>
  );
};

const ColorModeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      variant="gradient"
      gradient={{ from: "cyan", to: "indigo", deg: 121 }}
      radius="xl"
      size="xl"
      onClick={() => {
        toggleColorScheme();
      }}
    >
      {colorScheme === "light" ? (
        <MoonStars size="1.6rem" weight="fill" />
      ) : (
        <Sun size="1.6rem" weight="fill" />
      )}
    </ActionIcon>
  );
};
