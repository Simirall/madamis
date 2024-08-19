import { Badge, Card, Group, NavLink, Stack } from "@mantine/core";
import { Link } from "@phosphor-icons/react";
import { useMadamisList } from "../hooks/useMadamisList";

export const MadamisList = () => {
  const { data } = useMadamisList();

  return (
    <>
      <Group p="md">
        {data &&
          data.map((d) => (
            <Card
              key={d.id}
              w="20rem"
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Stack>
                <Group>
                  <NavLink
                    href={d.link}
                    target="_blank"
                    label={d.title}
                    variant="subtle"
                    active
                    leftSection={<Link fontSize="1.4rem" />}
                    style={{
                      borderRadius: "4px",
                    }}
                  />
                </Group>
                <Group>
                  <Badge
                    size="xl"
                    color={d.gmRequired ? "orange" : "cyan"}
                    fw="normal"
                  >
                    GM: {d.gmRequired ? "要" : "不要"}
                  </Badge>
                  <Badge size="xl" color="violet" fw="normal">
                    PL: {d.player}人
                  </Badge>
                </Group>
              </Stack>
            </Card>
          ))}
      </Group>
    </>
  );
};
