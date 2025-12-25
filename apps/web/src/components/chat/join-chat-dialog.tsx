import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinChat } from "@/lib/queries";
import { joinChatSchema, type JoinChatSchema } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type Props = {
  open: boolean;
  group_id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

function JoinChatDialog({ open, setOpen, group_id, refetch }: Props) {
  const mutation = useMutation({
    mutationFn: (data: JoinChatSchema) => {
      return joinChat(data);
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      refetch();
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error("Something went wrong!");
    },
  });

  const form = useForm({
    defaultValues: {
      passcode: "",
      group_id: group_id,
    } as JoinChatSchema,
    validators: {
      onSubmit: joinChatSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <Dialog open={open}>
      <DialogContent aria-describedby="join form" className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>Join Chat</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <form.Field name="passcode">
              {(field) => (
                <div className="grid gap-3">
                  <Label htmlFor={field.name}>Passcode</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    placeholder="Enter the passcode"
                    className="py-4"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 text-xs">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Join</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default JoinChatDialog;
