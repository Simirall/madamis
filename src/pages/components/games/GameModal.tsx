import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@yamada-ui/calendar";
import {
  Button,
  Fieldset,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalHeader,
  NativeSelect,
  Tag,
  Text,
  Toggle,
  ToggleGroup,
  VStack,
  Wrap,
} from "@yamada-ui/react";
import { hc, type InferResponseType } from "hono/client";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { AppType } from "../../../api";
import {
  gm,
  gmRequired,
  gmRequiredBadgeColor,
  gmRole,
} from "../../../constants/gmRequired";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useUser } from "../../hooks/useUser";
import { useGameModalStore } from "../../stores/gameModalStore";
import { Loader } from "../Loader";
import "dayjs/locale/ja";

const client = hc<AppType>("/api");

export const GameModal = () => {
  const { data: madamisList } = useMadamisList();
  const { data: users } = useUser();

  const { open, onClose, madamisId } = useGameModalStore();

  const madamis = madamisList?.find((m) => m.id === madamisId);
  const userIds = users?.map((u) => u.id.toString());

  return (
    <Modal
      closeOnOverlay={false}
      onClose={() => {
        onClose();
      }}
      open={open}
      size="lg"
    >
      <ModalHeader>試合を追加</ModalHeader>
      <ModalBody>
        {!madamis || !users || !userIds ? (
          <Loader />
        ) : (
          <GameForm madamis={madamis} userIds={userIds} users={users} />
        )}
      </ModalBody>
    </Modal>
  );
};

const GameForm: FC<{
  madamis: InferResponseType<typeof client.madamis.$get>[number];
  users: InferResponseType<typeof client.user.$get>;
  userIds: ReadonlyArray<string>;
}> = ({ madamis, users, userIds }) => {
  const { mutate } = useMadamisList();
  const { onClose } = useGameModalStore();

  const playedPlayers = madamis.games.flatMap((g) =>
    g.gameUsers.map((u) => u.user.id.toString()),
  );

  const formSchema = z.object({
    date: z.date(),
    gm: z.string().refine((v) => userIds.includes(v)),
    players: z.array(z.string()).length(madamis.player),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    defaultValues: {
      date: new Date(),
      gm: "1",
      players: [],
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    const reqObj = {
      date: data.date.toISOString(),
      gm: Number.parseInt(data.gm),
      madamisId: madamis.id,
      players: data.players.map((p) => Number.parseInt(p)),
    };

    await client.games.$post({
      json: reqObj,
    });
    await mutate();
    onClose();
    reset();
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
      <Heading>{madamis.title}</Heading>
      <HStack>
        <Tag colorScheme={gmRequiredBadgeColor[madamis.gmRequired]} size="lg">
          {gmRequired[madamis.gmRequired]}
        </Tag>
        <Tag colorScheme="violet" size="lg">
          PL: {madamis.player}人
        </Tag>
      </HStack>
      <Fieldset
        errorMessage={errors.gm?.message}
        invalid={!!errors.gm}
        legend={gmRole[madamis.gmRequired]}
      >
        <NativeSelect
          items={users.map((u) => ({
            label: u.name,
            value: u.id.toString(),
          }))}
          {...register("gm")}
        />
      </Fieldset>
      <VStack gap="sm">
        <Text>プレイヤー</Text>
        <ToggleGroup
          as={Wrap}
          justifyContent="center"
          onChange={(e) => {
            setValue("players", e);
          }}
          value={watch("players")}
        >
          {users
            .filter(
              (u) =>
                !playedPlayers?.includes(u.id.toString()) &&
                !(
                  (
                    madamis.gmRequired === gm.required &&
                    u.id === Number.parseInt(watch("gm"))
                  ) // GM必須の場合GMを除外
                ),
            )
            .map((u) => (
              <Toggle
                colorScheme="orange"
                key={u.id}
                px="sm"
                size="sm"
                value={u.id.toString()}
                variant="outline"
              >
                {u.name}
              </Toggle>
            ))}
        </ToggleGroup>
        {errors.players && (
          <Text color="red" size="sm">
            {errors.players.message}
          </Text>
        )}
      </VStack>
      <Fieldset
        errorMessage={errors.date?.message}
        invalid={!!errors.date}
        legend="開催日"
      >
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Calendar
              {...field}
              firstDayOfWeek="sunday"
              locale="ja-JP"
              w="full"
            />
          )}
        />
      </Fieldset>
      <Button colorScheme="lime" loading={isSubmitting} type="submit">
        追加
      </Button>
    </VStack>
  );
};
