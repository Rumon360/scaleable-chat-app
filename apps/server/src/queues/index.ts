import { Queue } from "bullmq";
import { redis } from "@scaleable-chat-app/db/redis";

export const CHAT_QUEUE_NAME = "chat-messages";

export const chatQueue = new Queue(CHAT_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

export const addMessageToQueue = async (data: any) => {
  return await chatQueue.add("save-message", data);
};
