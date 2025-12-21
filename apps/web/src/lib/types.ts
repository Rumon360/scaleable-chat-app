import z from "zod";

export const createChatSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  passcode: z.string().min(6, "Passcode must be at least 6 characters"),
});

export const editChatSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  passcode: z.string().min(6, "Passcode must be at least 6 characters"),
  id: z.string(),
});

export const deleteChatSchema = z.object({
  id: z.string(),
});

export type CreateChatForm = z.infer<typeof createChatSchema>;
export type EditChatForm = z.infer<typeof editChatSchema>;
export type DeleteChatForm = z.infer<typeof deleteChatSchema>;

export type ChatGroupType = CreateChatForm & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
