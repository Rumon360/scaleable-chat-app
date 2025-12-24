import type { Server, Socket } from "socket.io";

interface CustomSocket extends Socket {
  room: string;
}

export const setupSocket = (io: Server) => {
  io.use((socket: Socket, next) => {
    const room = socket.handshake.auth.room;
    if (!room) {
      return next(new Error("Invalid Room!"));
    }
    (socket as CustomSocket).room = room;
    next();
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
