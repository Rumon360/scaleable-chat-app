import "dotenv/config";
import { auth } from "@scaleable-chat-app/auth";
import { toNodeHandler } from "better-auth/node";
import { type Request, type Response } from "express";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import router from "./routes";

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
