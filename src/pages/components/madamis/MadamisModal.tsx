import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  FieldsetRoot as Fieldset,
  Input,
  ModalRoot as Modal,
  ModalBody,
  ModalHeader,
  NativeSelectRoot as NativeSelect,
  SegmentedControlRoot as SegmentedControl,
  VStack,
} from "@yamada-ui/react";
import { hc, type InferResponseType } from "hono/client";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { AppType } from "../../../api";
import { gmRequired } from "../../../constants/gmRequired";
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
    ? data?.find((d) => d.id === madamisId)
    : undefined;

  const madamisUrls = data
    ?.filter((d) => (madamisId ? d.id !== madamisId : true))
    .map((d) => d.link);

  return (
    <Modal closeOnOverlay={false} onClose={onClose} open={open}>
      <ModalHeader>{`マダミスを${editData ? "編集" : "追加"}`}</ModalHeader>
      <ModalBody>
        {madamisUrls ? (
          <MadamisForm editData={editData} madamisUrls={madamisUrls} />
        ) : (
          <Loader />
        )}
      </ModalBody>
    </Modal>
  );
};

const MadamisForm: FC<{
  madamisUrls: ReadonlyArray<string>;
  editData?: InferResponseType<typeof client.madamis.$get>[number];
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

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
      <Fieldset
        errorMessage={errors.title?.message}
        invalid={!!errors.title}
        legend="タイトル"
      >
        <Input placeholder="🧊山脈 陰謀の分水嶺" {...register("title")} />
      </Fieldset>
      <Fieldset
        errorMessage={errors.link?.message}
        invalid={!!errors.link}
        legend="リンク"
      >
        <Input placeholder="https://example.booth.pm" {...register("link")} />
      </Fieldset>
      <Fieldset
        errorMessage={errors.player?.message}
        invalid={!!errors.player}
        legend="PL人数"
      >
        <NativeSelect
          items={[
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
          ]}
          {...register("player")}
        />
      </Fieldset>
      <Controller
        control={control}
        name="gmRequired"
        render={({ field }) => (
          <SegmentedControl
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
      <Checkbox size="lg" {...register("bought")}>
        購入済み/無料
      </Checkbox>
      <Button colorScheme="lime" loading={isSubmitting} type="submit">
        {editData ? "更新" : "追加"}
      </Button>
      {madamisId && <DeleteMadamisButton madamisId={madamisId} />}
    </VStack>
  );
};
