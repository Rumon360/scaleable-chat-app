import type { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("[SOCKET_CONNECTED]", socket.id);

    socket.on("disconnect", () => {
      console.log("[SOCKET_DISCONNECTED]", socket.id);
    });
  });
};
