import { ChatGroupController } from "@/controllers/chat.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const router: Router = Router();

router.post("/chat-group", authMiddleware, ChatGroupController.store);

export default router;
