import { Router } from "express";
import { ChatGroupController } from "@/controllers/chat.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const router: Router = Router();

// Get All Chat Groups
router.get("/", authMiddleware, ChatGroupController.index);
// Get One Chat Group
router.get("/:id", authMiddleware, ChatGroupController.show);
// Create Chat Group
router.post("/", authMiddleware, ChatGroupController.store);
// Update Chat Group
router.put("/:id", authMiddleware, ChatGroupController.update);
// Delete Chat Group
router.delete("/:id", authMiddleware, ChatGroupController.delete);

export default router;
