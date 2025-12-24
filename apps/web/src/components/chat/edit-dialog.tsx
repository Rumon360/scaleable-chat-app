import { useEffect } from "react";
import {
  editChatSchema,
  type ChatGroupType,
  type EditChatForm,
} from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { editChat } from "@/lib/queries";
import { toast } from "sonner";
import { AxiosError } from "axios";

type Props = {
  chats: ChatGroupType[];
  selectedChat: { type: "edit" | "del"; id: string } | null;
  refetchChatGroups: () => void;
  setSelectedChat: (val: { type: "edit" | "del"; id: string } | null) => void;
};

function EditDialog({
  chats,
  selectedChat,
  setSelectedChat,
  refetchChatGroups,
}: Props) {
  const chatToEdit = chats.find((chat) => chat.id === selectedChat?.id);

  const isOpen = selectedChat?.type === "edit" && !!chatToEdit;

  const mutation = useMutation({
    mutationFn: editChat,
    onSuccess: (res) => {
      toast.success(res.data.message || "Chat updated successfully");
      refetchChatGroups();
      handleClose();
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Something went wrong";
      toast.error(message);
    },
  });

  const form = useForm({
    defaultValues: {
      title: chatToEdit?.title ?? "",
      passcode: chatToEdit?.passcode ?? "",
      id: chatToEdit?.id ?? "",
    } as EditChatForm,
    validators: {
      onSubmit: editChatSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  useEffect(() => {
    if (chatToEdit) {
      form.reset({
        title: chatToEdit.title,
        passcode: chatToEdit.passcode ?? "",
        id: chatToEdit.id,
      });
    }
  }, [chatToEdit, form]);

  const handleClose = () => {
    setSelectedChat(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit Chat Group</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <form.Field name="title">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="Enter group title"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={!!field.state.meta.errors.length}
                  />
                  <FieldErrors errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            <form.Field name="passcode">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Passcode (Optional)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="Enter passcode"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldErrors errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  disabled={!state.canSubmit || mutation.isPending}
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;

function FieldErrors({ errors }: { errors: any[] }) {
  if (!errors.length) return null;
  return (
    <div className="space-y-1">
      {errors.map((error, i) => (
        <p key={i} className="text-destructive text-sm font-medium">
          {error?.message || error}
        </p>
      ))}
    </div>
  );
}
