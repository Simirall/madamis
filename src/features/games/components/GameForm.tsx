import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Calendar,
  Field,
  Heading,
  HStack,
  Select,
  Tag,
  Text,
  ToggleGroup,
  VStack,
  Wrap,
} from "@yamada-ui/react";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  gm,
  gmRequired,
  gmRequiredBadgeColor,
  gmRole,
} from "../../../constants/gmRequired";
import type { MadamisListItem } from "../../madamis/hooks/useMadamisList";
import { useAddGame } from "../hooks/useGameActions";
import type { UserListResponse } from "../hooks/useUser";
import {
  createGameFormSchema,
  type GameFormValues,
} from "../schemas/gameFormSchema";
import "dayjs/locale/ja";

type GameFormProps = {
  madamis: MadamisListItem;
  onSaved: () => void;
  userIds: ReadonlyArray<string>;
  users: UserListResponse;
};

export const GameForm: FC<GameFormProps> = ({
  madamis,
  onSaved,
  userIds,
  users,
}) => {
  const addGame = useAddGame(madamis.id);
  const playedPlayers = madamis.games.flatMap((game) =>
    game.gameUsers.map((user) => user.user.id.toString()),
  );
  const userItems: Select.Item[] = users.map((user) => ({
    label: user.name,
    value: user.id.toString(),
  }));
  const formSchema = createGameFormSchema(madamis.player, userIds);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<GameFormValues>({
    defaultValues: {
      date: new Date(),
      gm: users[0]?.id.toString() ?? "",
      players: [],
    },
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });
  const selectedGm = watch("gm");
  const selectedPlayers = watch("players");
  const selectedGmId = Number.parseInt(selectedGm, 10);
  const selectedPlayerCount = selectedPlayers.length;
  const playerCountColor =
    selectedPlayerCount === madamis.player ? "lime" : "orange";

  const onSubmit = async (data: GameFormValues) => {
    await addGame(data);
    onSaved();
    reset();
  };

  return (
    <VStack
      align="stretch"
      as="form"
      gap="md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Heading fontSize="2xl" lineHeight="1.4">
        {madamis.title}
      </Heading>
      <HStack wrap="wrap">
        <Tag colorScheme={gmRequiredBadgeColor[madamis.gmRequired]} size="lg">
          {gmRequired[madamis.gmRequired]}
        </Tag>
        <Tag colorScheme="violet" size="lg">
          PL: {madamis.player}人
        </Tag>
      </HStack>
      <Field.Root
        errorMessage={errors.gm?.message}
        invalid={!!errors.gm}
        label={gmRole[madamis.gmRequired]}
        name="gm"
      >
        <Controller
          control={control}
          name="gm"
          render={({ field }) => (
            <Select.Root
              items={userItems}
              onChange={(value) => {
                field.onChange(value);

                if (madamis.gmRequired === gm.required) {
                  setValue(
                    "players",
                    selectedPlayers.filter((player) => player !== value),
                  );
                }
              }}
              value={field.value}
            />
          )}
        />
      </Field.Root>
      <VStack gap="sm">
        <HStack justify="space-between" w="full">
          <Text>プレイヤー</Text>
          <Tag colorScheme={playerCountColor} size="sm" variant="surface">
            {selectedPlayerCount} / {madamis.player}人
          </Tag>
        </HStack>
        <ToggleGroup.Root
          as={Wrap}
          justifyContent="center"
          onChange={(value) => {
            setValue("players", value);
          }}
          value={selectedPlayers}
        >
          {users.map((user) => {
            const userId = user.id.toString();
            const isAlreadyPlayed = playedPlayers.includes(userId);
            const isSelectedGm =
              madamis.gmRequired === gm.required && user.id === selectedGmId;

            return (
              <ToggleGroup.Item
                colorScheme="orange"
                disabled={isAlreadyPlayed || isSelectedGm}
                key={user.id}
                px="sm"
                size="sm"
                value={userId}
                variant="outline"
              >
                {user.name}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>
        {errors.players ? (
          <Text color="red" fontSize="sm">
            {errors.players.message}
          </Text>
        ) : null}
      </VStack>
      <Field.Root
        errorMessage={errors.date?.message}
        invalid={!!errors.date}
        label="開催日"
        name="date"
      >
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Box maxW="28rem" w="full">
              <Calendar.Root
                {...field}
                locale="ja-JP"
                startDayOfWeek="sunday"
                w="full"
              />
            </Box>
          )}
        />
      </Field.Root>
      <Button colorScheme="lime" loading={isSubmitting} type="submit">
        追加
      </Button>
    </VStack>
  );
};
