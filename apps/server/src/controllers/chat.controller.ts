import { auth } from "@scaleable-chat-app/auth";
import prisma from "@scaleable-chat-app/db";
import { type Request, type Response } from "express";

export class ChatGroupController {
  static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      const data = await auth.api.getSession();
      if (data) {
        const user = data?.user;

        await prisma.chatGroup.create({
          data: {
            title: body.title,
            passcode: body.passcode,
            user_id: user?.id,
          },
        });

        return res.json({ message: "Chat group created" });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }
}
