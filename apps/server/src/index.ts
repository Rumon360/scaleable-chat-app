import "dotenv/config";
import { auth } from "@scaleable-chat-app/auth";
import { toNodeHandler } from "better-auth/node";
import { type Request, type Response } from "express";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "@/routes/index";
import { Server } from "socket.io";
import { createServer } from "http";
import { CORS_OPTIONS, PORT, SOCKET_CORS_OPTIONS } from "@/config/options";
import { setupSocket } from "@/socket/index";
import { instrument } from "@socket.io/admin-ui";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { redis } from "@scaleable-chat-app/db/redis";

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: SOCKET_CORS_OPTIONS,
  adapter: createAdapter(redis),
});

instrument(io, {
  auth: false,
  mode: "development",
});

app.use(morgan("dev"));

app.use(cors(CORS_OPTIONS));

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.use("/api", router);

app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: `Resource not found: ${req.originalUrl}`,
  });
});

// Universal Error Handler
app.use((err: any, _req: Request, res: Response) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
    },
  });
});

// Setup Socket.io
setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
