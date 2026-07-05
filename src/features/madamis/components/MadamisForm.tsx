import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  Input,
  NumberInput,
  SegmentedControl,
  VStack,
} from "@yamada-ui/react";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { gmRequired } from "../../../constants/gmRequired";
import {
  useMarkMadamisAsNotBought,
  useSaveMadamis,
} from "../hooks/useMadamisActions";
import type { MadamisListItem } from "../hooks/useMadamisList";
import {
  createMadamisFormSchema,
  type MadamisFormInput,
  type MadamisFormValues,
} from "../schemas/madamisFormSchema";
import { DeleteMadamisButton } from "./DeleteMadamisButton";

type MadamisFormProps = {
  editData?: MadamisListItem;
  madamisId?: number;
  madamisUrls: ReadonlyArray<string>;
  onSaved: () => void;
};

export const MadamisForm: FC<MadamisFormProps> = ({
  editData,
  madamisId,
  madamisUrls,
  onSaved,
}) => {
  const madamisFormSchema = createMadamisFormSchema(madamisUrls);
  const saveMadamis = useSaveMadamis(madamisId);
  const { loading: notBoughtLoading, markAsNotBought } =
    useMarkMadamisAsNotBought(editData);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<MadamisFormInput, unknown, MadamisFormValues>({
    defaultValues: {
      bought: Boolean(editData?.bought),
      gmRequired: editData?.gmRequired ?? 0,
      link: editData?.link ?? "",
      player: editData?.player ?? 4,
      title: editData?.title ?? "",
    },
    resolver: zodResolver(madamisFormSchema),
  });

  const onSubmit = async (data: MadamisFormValues) => {
    await saveMadamis(data);
    onSaved();
  };

  const onMarkAsNotBought = async () => {
    await markAsNotBought();
    onSaved();
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
            items={gmRequired.map((label, index) => ({
              label,
              value: index.toString(),
            }))}
            onChange={(value) => {
              field.onChange(Number(value));
            }}
            value={String(field.value)}
          />
        )}
      />
      <Button colorScheme="lime" loading={isSubmitting} type="submit">
        {editData ? "更新" : "追加"}
      </Button>
      {editData?.bought ? (
        <Button
          colorScheme="gray"
          loading={notBoughtLoading}
          onClick={onMarkAsNotBought}
          type="button"
        >
          未購入に戻す
        </Button>
      ) : null}
      {madamisId ? (
        <DeleteMadamisButton madamisId={madamisId} onDeleted={onSaved} />
      ) : null}
    </VStack>
  );
};
