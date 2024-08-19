import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Fieldset,
  Modal,
  NativeSelect,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { Plus } from "@phosphor-icons/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const AddMadamisButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <AddMadamisModal opened={opened} close={close} />
      <Box pos="fixed" bottom="0" right="0" p="sm">
        <ActionIcon
          variant="filled"
          color="orange"
          size="xl"
          radius="xl"
          aria-label="Add Madamis"
          onClick={open}
        >
          <Plus fontSize="1.6rem" />
        </ActionIcon>
      </Box>
    </>
  );
};

const formSchema = z.object({
  title: z.string().min(1),
  link: z.string().url(),
  player: z.coerce.number().int().min(1).max(6),
  gmRequired: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

const AddMadamisModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
    close();
    reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="マダミスを追加"
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
              error={errors.title?.message}
            />
            <TextInput
              label="リンク"
              placeholder="https://example.booth.pm"
              {...register("link")}
              error={errors.link?.message}
            />
            <NativeSelect
              label="PL人数"
              data={["1", "2", "3", "4", "5", "6"]}
              defaultValue="4"
              {...register("player")}
              error={errors.player?.message}
            />
            <Checkbox
              defaultChecked
              label="GM必須"
              {...register("gmRequired")}
              error={errors.gmRequired?.message}
            />
            <Button mt="md" type="submit">
              追加
            </Button>
          </Stack>
        </Fieldset>
      </form>
    </Modal>
  );
};
