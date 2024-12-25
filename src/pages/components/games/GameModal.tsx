import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@yamada-ui/calendar";
import {
  Button,
  Fieldset,
  HStack,
  Heading,
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
import { type InferResponseType, hc } from "hono/client";
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
      open={open}
      onClose={() => {
        onClose();
      }}
      closeOnOverlay={false}
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
    players: z.array(z.string()).length(madamis.player),
    gm: z.string().refine((v) => userIds.includes(v)),
    date: z.date(),
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
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: [],
      gm: "1",
      date: new Date(),
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const reqObj = {
      madamisId: madamis.id,
      date: data.date.toISOString(),
      gm: Number.parseInt(data.gm),
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
        <Tag size="lg" colorScheme={gmRequiredBadgeColor[madamis.gmRequired]}>
          {gmRequired[madamis.gmRequired]}
        </Tag>
        <Tag size="lg" colorScheme="violet">
          PL: {madamis.player}人
        </Tag>
      </HStack>
      <Fieldset
        legend={gmRole[madamis.gmRequired]}
        invalid={!!errors.gm}
        errorMessage={errors.gm?.message}
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
          value={watch("players")}
          onChange={(e) => {
            setValue("players", e);
          }}
          as={Wrap}
          justifyContent="center"
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
                key={u.id}
                px="sm"
                size="sm"
                colorScheme="orange"
                variant="outline"
                value={u.id.toString()}
              >
                {u.name}
              </Toggle>
            ))}
        </ToggleGroup>
        {errors.players && (
          <Text size="sm" color="red">
            {errors.players.message}
          </Text>
        )}
      </VStack>
      <Fieldset
        legend="開催日"
        invalid={!!errors.date}
        errorMessage={errors.date?.message}
      >
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Calendar
              {...field}
              w="full"
              firstDayOfWeek="sunday"
              locale="ja-JP"
            />
          )}
        />
      </Fieldset>
      <Button type="submit" colorScheme="lime" loading={isSubmitting}>
        追加
      </Button>
    </VStack>
  );
};
