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

      if (!session || !session.user) {
        return next(new Error("Unauthorized: Invalid Session"));
      }

      const room = socket.handshake.auth.room;

      const chat_room = await prisma.chatGroup.findUnique({
        where: { id: room },
      });

      if (!room || !chat_room) {
        return next(new Error("Invalid Room!"));
      }

      (socket as CustomSocket).user = session.user;
      (socket as CustomSocket).room = room;

      next();
    } catch (error) {
      next(new Error("Internal Server Error during Auth"));
    }
  });

  io.on("connection", (socket) => {
    const customSocket = socket as CustomSocket;

    // Join to the room
    socket.join(customSocket.room);

    console.log("[SOCKET_CONNECTED]", socket.id);

    socket.on("message", (data) => {
      console.log("ON_MESSAGE_RECIEVED", data);
      io.to(customSocket.room).emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("[SOCKET_DISCONNECTED]", socket.id);
    });
  });
};
