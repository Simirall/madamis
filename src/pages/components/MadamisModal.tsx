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
import {
  MadamisDeleteType,
  MadamisPostType,
  MadamisPutType,
} from "../../apis/madamis";
import { useMadamisList } from "../hooks/useMadamisList";
import { useMadamisModalStore } from "../stores/madamisModalStore";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(1),
  link: z.string().url(),
  player: z.coerce.number().int().min(1).max(6),
  gmRequired: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

const postClient = hc<MadamisPostType>("/api/madamis/");
const putClient = hc<MadamisPutType>("/api/madamis/");

export const MadamisModal = () => {
  const { open, close, madamisId } = useMadamisModalStore();
  const { data, mutate } = useMadamisList();

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
    if (madamisId) {
      await putClient.index.$put({
        json: { id: madamisId, ...data },
      });
    } else {
      await postClient.index.$post({
        json: data,
      });
    }
    await mutate();
    close();
    reset();
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
            <Button mt="md" type="submit">
              {editData ? "更新" : "追加"}
            </Button>
            {madamisId && <DeleteMadamis madamisId={madamisId} />}
          </Stack>
        </Fieldset>
      </form>
    </Modal>
  );
};

const DeleteMadamis = ({ madamisId }: { madamisId: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { close: closeMadamisModal } = useMadamisModalStore();
  const deleteClient = hc<MadamisDeleteType>(`/api/madamis/`);
  const { mutate } = useMadamisList();

  const onDelete = async () => {
    await deleteClient[":id"].$delete({ param: { id: madamisId.toString() } });
    await mutate();
    close();
    closeMadamisModal();
  };

  return (
    <>
      <Button color="red" variant="light" onClick={open}>
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
          <Button color="blue" variant="light" onClick={close}>
            削除しない
          </Button>
          <Button color="red" onClick={onDelete}>
            削除する
          </Button>
        </Group>
      </Modal>
    </>
  );
};
