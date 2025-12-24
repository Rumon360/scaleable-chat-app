import { io, Socket } from "socket.io-client";

let socket: Socket;
const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(BACKEND_URL, { autoConnect: false, withCredentials: true });
  }
  return socket;
};
