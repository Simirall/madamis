import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  Modal,
  NativeSelect,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { hc } from "hono/client";
import { useMadamisList } from "../hooks/useMadamisList";
import { useMadamisModalStore } from "../stores/madamisModalStore";
import { useEffect, useState } from "react";
import { AppType } from "../../api";

const formSchema = z.object({
  title: z.string().min(1),
  link: z.string().url(),
  player: z.coerce.number().int().min(1).max(6),
  gmRequired: z.boolean(),
  bought: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

const client = hc<AppType>("/api");

export const MadamisModal = () => {
  const { data, mutate } = useMadamisList();

  const { open, close, madamisId } = useMadamisModalStore();
  const [loading, setLoading] = useState(false);

  const editData = madamisId
    ? data?.find((d) => d.id === madamisId)
    : undefined;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
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
    close();
    setLoading(false);
  };

  useEffect(() => {
    reset();
  }, [madamisId, open]);

  return (
    <Modal
      opened={open}
      onClose={() => {
        reset();
        close();
      }}
      title={`マダミスを${editData ? "編集" : "追加"}`}
      centered
      closeOnClickOutside={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset legend="マダミス情報">
          <Stack>
            <TextInput
              label="タイトル"
              placeholder="上田山脈 陰謀の分水嶺"
              {...register("title")}
              defaultValue={editData?.title}
              error={errors.title?.message}
            />
            <TextInput
              label="リンク"
              placeholder="https://example.booth.pm"
              {...register("link")}
              defaultValue={editData?.link}
              error={errors.link?.message}
            />
            <NativeSelect
              label="PL人数"
              data={["1", "2", "3", "4", "5", "6"]}
              defaultValue={editData?.player ?? "4"}
              {...register("player")}
              error={errors.player?.message}
            />
            <Checkbox
              defaultChecked={Boolean(editData?.gmRequired)}
              label="GM必須"
              {...register("gmRequired")}
              error={errors.gmRequired?.message}
            />
            <Checkbox
              defaultChecked={Boolean(editData?.bought)}
              label="購入済み"
              {...register("bought")}
              error={errors.bought?.message}
            />
            <Button mt="md" type="submit" loading={loading}>
              {editData ? "更新" : "追加"}
            </Button>
            {madamisId && (
              <DeleteMadamis madamisId={madamisId} parentLoading={loading} />
            )}
          </Stack>
        </Fieldset>
      </form>
    </Modal>
  );
};

const DeleteMadamis = ({
  madamisId,
  parentLoading,
}: {
  madamisId: number;
  parentLoading: boolean;
}) => {
  const { close: closeMadamisModal } = useMadamisModalStore();
  const { mutate } = useMadamisList();

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await client.madamis[":id"].$delete({
      param: { id: madamisId.toString() },
    });
    await mutate();
    close();
    closeMadamisModal();
  };

  return (
    <>
      <Button
        color="red"
        variant="light"
        onClick={open}
        loading={parentLoading}
      >
        削除
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="sm"
        title="削除しますか？"
      >
        <Group>
          <Button
            color="blue"
            variant="light"
            onClick={close}
            loading={loading}
          >
            削除しない
          </Button>
          <Button color="red" onClick={onDelete} loading={loading}>
            削除する
          </Button>
        </Group>
      </Modal>
    </>
  );
};
