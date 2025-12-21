"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createChat } from "@/lib/queries";
import { createChatSchema, type CreateChatForm } from "@/lib/types";
import type { authClient } from "@/lib/auth-client";
import { AxiosError } from "axios";

interface CreateChatTypes {
  user: typeof authClient.$Infer.Session.user;
  refetchChatGroups: () => void;
}

function CreateChat({ user, refetchChatGroups }: CreateChatTypes) {
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: CreateChatForm) => {
      return createChat(data);
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      refetchChatGroups();
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.message);
        return;
      }
      toast.error("Something went wrong!");
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      passcode: "",
    } as CreateChatForm,
    validators: {
      onSubmit: createChatSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="flex items-center bg-accent justify-center group cursor-pointer w-full sm:w-72 lg:w-80 aspect-[16/6]">
          <CardContent>
            <p className="text-base group-hover:text-blue-500 transition-colors text-center font-medium">
              Create Chat
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent aria-describedby="" className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Create Chat Group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <form.Field name="title">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    placeholder="Give a title"
                    className="py-4"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 text-sm">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
            <form.Field name="passcode">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Passcode</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    className="py-4"
                    placeholder="Passcode"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 text-sm">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  disabled={!state.canSubmit || state.isSubmitting}
                >
                  {state.isSubmitting ? "Creating..." : "Create"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChat;
