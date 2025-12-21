import { Router } from "express";
import chatGroupRoutes from "@/routes/chat-groups/index";

const router: Router = Router();

router.use("/chat-group", chatGroupRoutes);

export default router;
