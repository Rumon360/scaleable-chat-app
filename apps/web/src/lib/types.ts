import z from "zod";

export const createChatSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  passcode: z.string().min(6, "Passcode must be at least 6 characters"),
  user_id: z.string().optional(),
});

export type CreateChatForm = z.infer<typeof createChatSchema>;
