import type { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("[SOCKET_CONNECTED]", socket.id);

    socket.on("message", (data) => {
      console.log("ON_MESSAGE_RECIEVED", data);
      socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("[SOCKET_DISCONNECTED]", socket.id);
    });
  });
};
