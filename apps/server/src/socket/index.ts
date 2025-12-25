import { addMessageToQueue } from "@/queues";
import { auth } from "@scaleable-chat-app/auth";
import prisma from "@scaleable-chat-app/db";
import { fromNodeHeaders } from "better-auth/node";
import type { Server, Socket } from "socket.io";

interface CustomSocket extends Socket {
  room: string;
  user?: any;
}

export const setupSocket = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.handshake.headers),
      });

      if (!session?.user) {
        return next(new Error("UNAUTHORIZED"));
      }

      const roomId = socket.handshake.auth.room;

      if (!roomId) {
        return next(new Error("ROOM_ID_REQUIRED"));
      }

      const chatGroup = await prisma.chatGroup.findUnique({
        where: { id: roomId },
      });

      if (!chatGroup) {
        return next(new Error("ROOM_NOT_FOUND"));
      }

      (socket as CustomSocket).user = session.user;
      (socket as CustomSocket).room = roomId;

      next();
    } catch (error) {
      console.error("[AUTH_MIDDLEWARE_ERROR]", error);
      next(new Error("Internal Server Error during Auth"));
    }
  });

  io.on("connection", (socket) => {
    const customSocket = socket as CustomSocket;

    // Join to the room
    socket.join(customSocket.room);

    console.log("[SOCKET_CONNECTED]", socket.id);

    socket.on("message", async (data) => {
      const payload = {
        ...data,
        from_id: customSocket.user.id,
      };

      io.to(customSocket.room).emit("message", {
        ...payload,
        from: {
          name: customSocket.user.name,
          email: customSocket.user.email,
        },
      });

      try {
        await addMessageToQueue(payload);
      } catch (error) {
        console.error(
          `[QUEUE_ERROR] User:${customSocket.user.id} Room:${customSocket.room}`,
          error
        );
      }
    });

    socket.on("disconnect", (reason) => {
      if (reason === "ping timeout") {
        console.warn(
          `[SOCKET_TIMEOUT] ${socket.id} for user ${customSocket.user.id}`
        );
      }
    });
  });
};
