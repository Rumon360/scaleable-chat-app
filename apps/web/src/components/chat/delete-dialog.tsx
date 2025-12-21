import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteChat } from "@/lib/queries";
import { toast } from "sonner";
import { AxiosError } from "axios";

type Props = {
  selectedChat: { type: "edit" | "del"; id: string } | null;
  setSelectedChat: (val: { type: "edit" | "del"; id: string } | null) => void;
  refetchChatGroups: () => void;
};

export function DeleteDialog({
  selectedChat,
  setSelectedChat,
  refetchChatGroups,
}: Props) {
  const isOpen = selectedChat?.type === "del";
  const chatId = selectedChat?.id;

  const mutation = useMutation({
    mutationFn: (id: string) => deleteChat({ id: id }),
    onSuccess: () => {
      toast.success("Chat deleted successfully");
      refetchChatGroups();
      handleClose();
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to delete chat";
      toast.error(message);
    },
  });

  const handleClose = () => {
    setSelectedChat(null);
  };

  const onConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (chatId) {
      mutation.mutate(chatId);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the chat
            group and all associated messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={mutation.isPending}>
            {mutation.isPending ? <>Deleting...</> : "Delete Chat"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
