import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  Input,
  Modal,
  NumberInput,
  SegmentedControl,
  VStack,
} from "@yamada-ui/react";
import { hc } from "hono/client";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { AppType } from "../../../api";
import { gmRequired } from "../../../constants/gmRequired";
import type { MadamisListItem } from "../../hooks/useMadamisList";
import { useMadamisList } from "../../hooks/useMadamisList";
import { useMadamisModalStore } from "../../stores/madamisModalStore";
import { Loader } from "../Loader";
import { DeleteMadamisButton } from "./DeleteMadamisModal";

const client = hc<AppType>("/api");

const formSchema = (urls: ReadonlyArray<string>) =>
  z.object({
    bought: z.boolean(),
    gmRequired: z.number().nonnegative().max(2),
    link: z
      .string()
      .url()
      .refine((v) => !urls.includes(v), {
        message: "Already exists",
      }),
    player: z.coerce.number().int().min(1).max(6),
    title: z.string().min(1),
  });

export const MadamisModal = () => {
  const { data } = useMadamisList();
  const { open, onClose, madamisId } = useMadamisModalStore();

  const editData = madamisId
    ? data?.items.find((d) => d.id === madamisId)
    : undefined;

  const madamisUrls = data?.items
    ?.filter((d) => (madamisId ? d.id !== madamisId : true))
    .map((d) => d.link);

  return (
    <Modal.Root closeOnOverlay={false} onClose={onClose} open={open} size="lg">
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{`マダミスを${editData ? "編集" : "追加"}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {madamisUrls ? (
            <MadamisForm editData={editData} madamisUrls={madamisUrls} />
          ) : (
            <Loader />
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

const MadamisForm: FC<{
  madamisUrls: ReadonlyArray<string>;
  editData?: MadamisListItem;
}> = ({ editData, madamisUrls }) => {
  const { mutate } = useMadamisList();
  const { onClose, madamisId } = useMadamisModalStore();

  const madamisFormSchema = formSchema(madamisUrls);
  type FormInput = z.input<typeof madamisFormSchema>;
  type FormSchema = z.output<typeof madamisFormSchema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormSchema>({
    defaultValues: {
      bought: Boolean(editData?.bought),
      gmRequired: editData?.gmRequired ?? 0,
      link: editData?.link,
      player: editData?.player ?? 4,
      title: editData?.title,
    },
    resolver: zodResolver(madamisFormSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    if (madamisId) {
      await client.madamis.$put({
        json: { id: madamisId, ...data },
      });
    } else {
      await client.madamis.$post({
        json: data,
      });
    }
    await mutate();
    onClose(); // FIXME: 閉じたときにスクロールが戻らない
  };

  const handleMarkAsNotBought = async () => {
    if (!madamisId || !editData) {
      return;
    }

    await client.madamis.$put({
      json: {
        bought: false,
        gmRequired: editData.gmRequired,
        id: madamisId,
        link: editData.link,
        player: editData.player,
        title: editData.title,
      },
    });
    await mutate();
    onClose();
  };

  return (
    <VStack as="form" gap="md" onSubmit={handleSubmit(onSubmit)}>
      <Field.Root
        errorMessage={errors.title?.message}
        invalid={!!errors.title}
        label="タイトル"
        name="title"
      >
        <Input placeholder="🧊山脈 陰謀の分水嶺" {...register("title")} />
      </Field.Root>
      <Field.Root
        errorMessage={errors.link?.message}
        invalid={!!errors.link}
        label="リンク"
        name="link"
      >
        <Input placeholder="https://example.booth.pm" {...register("link")} />
      </Field.Root>
      <Field.Root
        errorMessage={errors.player?.message}
        invalid={!!errors.player}
        label="PL人数"
        name="player"
      >
        <Controller
          control={control}
          name="player"
          render={({ field }) => (
            <NumberInput
              max={6}
              min={1}
              onChange={(value) => field.onChange(Number(value))}
              step={1}
              value={Number(field.value ?? 4)}
            />
          )}
        />
      </Field.Root>
      <Controller
        control={control}
        name="gmRequired"
        render={({ field }) => (
          <SegmentedControl.Root
            colorScheme="yellow"
            items={gmRequired.map((g, i) => ({
              label: g,
              value: i.toString(),
            }))}
            onChange={(e) => {
              field.onChange(Number(e));
            }}
            value={String(field.value)}
          />
        )}
      />
      <Button colorScheme="lime" loading={isSubmitting} type="submit">
        {editData ? "更新" : "追加"}
      </Button>
      {editData?.bought ? (
        <Button colorScheme="gray" onClick={handleMarkAsNotBought}>
          未購入に戻す
        </Button>
      ) : null}
      {madamisId && <DeleteMadamisButton madamisId={madamisId} />}
    </VStack>
  );
};
