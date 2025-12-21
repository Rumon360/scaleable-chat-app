import { auth } from "@scaleable-chat-app/auth";
import prisma from "@scaleable-chat-app/db";
import { type Request, type Response } from "express";

export class ChatGroupController {
  // Get All
  static async index(_req: Request, res: Response) {
    try {
      const data = await auth.api.getSession();
      if (data) {
        const user = data.user;

        const groups = await prisma.chatGroup.findMany({
          where: { user_id: user.id },
          orderBy: { createdAt: "desc" },
        });

        return res.json({
          message: "Chat groups fetched successfully!",
          data: groups,
        });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Get One
  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const group = await prisma.chatGroup.findUnique({ where: { id: id } });

      return res.json({
        message: "Chat group fetched successfully!",
        data: group,
      });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Create
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

        return res.json({ message: "Chat group created successfully!" });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Update
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await auth.api.getSession();
      if (data) {
        const user = data.user;

        await prisma.chatGroup.update({
          where: {
            id: id,
            user_id: user.id,
          },
          data: { title: body.title, passcode: body.passcode },
        });

        return res.json({ message: "Chat group updated successfully!" });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Delete
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await auth.api.getSession();

      if (data) {
        await prisma.chatGroup.delete({
          where: { id: id, user_id: data.user.id },
        });

        return res.json({
          message: "Chat group deleted successfully!",
        });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }
}
