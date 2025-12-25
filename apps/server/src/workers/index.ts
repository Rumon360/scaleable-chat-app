import { Worker, Job } from "bullmq";
import prisma from "@scaleable-chat-app/db";
import { redis } from "@scaleable-chat-app/db/redis";
import { CHAT_QUEUE_NAME } from "@/queues";

export const setupChatWorker = () => {
  const worker = new Worker(
    CHAT_QUEUE_NAME,
    async (job: Job) => {
      const { id, message, from_id, group_id, createdAt } = job.data;

      try {
        await prisma.chats.create({
          data: {
            message: message,
            from_id: from_id,
            group_id: group_id,
            id: id,
            createdAt: createdAt,
          },
        });
      } catch (error) {
        console.error(`Failed to save message for job ${job.id}:`, error);
        throw error;
      }
    },
    { connection: redis }
  );

  worker.on("completed", (job) => {
    console.log(`[WORKER] Message ${job.id} saved to DB`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[WORKER] Job ${job?.id} failed after retries: ${err.message}`
    );
  });

  return worker;
};

export const setupWorkers = () => {
  setupChatWorker();
};
